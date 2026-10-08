-- Tesorería interna de GRCP: registro manual, sin pasarela ni movimientos bancarios automáticos.
-- Requiere 03-instalar-portal.sql. No publicar información financiera a instituciones.
begin;

create table public.portal_finance_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 120),
  kind text not null check (kind in ('cash','bank','digital','other')),
  currency text not null default 'ARS' check (currency in ('ARS','USD')),
  opening_balance_cents bigint not null default 0 check (opening_balance_cents between -9000000000000 and 9000000000000),
  notes text not null default '' check (length(notes)<=2000),
  archived_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create table public.portal_finance_obligations (
  id uuid primary key default gen_random_uuid(),
  direction text not null check (direction in ('receivable','payable')),
  institution_id uuid references public.portal_institutions(id),
  title text not null check (length(btrim(title)) between 1 and 200),
  category text not null check (length(btrim(category)) between 1 and 100),
  amount_cents bigint not null check (amount_cents between 1 and 9000000000000),
  currency text not null default 'ARS' check (currency in ('ARS','USD')),
  issued_on date not null default current_date,
  due_on date,
  reference text not null default '' check (length(reference)<=120),
  notes text not null default '' check (length(notes)<=5000),
  status text not null default 'open' check (status in ('open','cancelled')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  check (due_on is null or due_on>=issued_on)
);

create table public.portal_finance_movements (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('income','expense','transfer')),
  account_id uuid not null references public.portal_finance_accounts(id),
  destination_account_id uuid references public.portal_finance_accounts(id),
  obligation_id uuid references public.portal_finance_obligations(id),
  institution_id uuid references public.portal_institutions(id),
  title text not null check (length(btrim(title)) between 1 and 200),
  category text not null check (length(btrim(category)) between 1 and 100),
  amount_cents bigint not null check (amount_cents between 1 and 9000000000000),
  occurred_on date not null default current_date,
  method text not null check (method in ('cash','transfer','card','other')),
  reference text not null default '' check (length(reference)<=120),
  notes text not null default '' check (length(notes)<=5000),
  void_reason text not null default '' check (length(void_reason)<=500),
  voided_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  check ((kind='transfer' and method='transfer' and destination_account_id is not null and destination_account_id<>account_id and obligation_id is null and institution_id is null)
      or (kind<>'transfer' and destination_account_id is null))
);

create table public.portal_finance_documents (
  id uuid primary key default gen_random_uuid(),
  obligation_id uuid references public.portal_finance_obligations(id),
  movement_id uuid references public.portal_finance_movements(id),
  kind text not null check (kind in ('invoice','receipt','budget','other')),
  title text not null check (length(btrim(title)) between 1 and 200),
  file_path text not null unique check (file_path like 'finance/%'),
  file_name text not null check (length(file_name) between 1 and 255),
  mime_type text not null check (mime_type in ('application/pdf','image/jpeg','image/png')),
  file_size bigint not null check (file_size between 1 and 10485760),
  notes text not null default '' check (length(notes)<=2000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  check (num_nonnulls(obligation_id,movement_id)=1)
);

create table public.portal_finance_audit (
  id bigint generated always as identity primary key,
  entity text not null,
  record_id uuid not null,
  action text not null check (action in ('INSERT','UPDATE')),
  actor_id uuid references auth.users(id) on delete set null,
  happened_at timestamptz not null default now(),
  before_data jsonb, after_data jsonb
);

create function private.finance_guard_account() returns trigger language plpgsql security invoker set search_path='' as $$
declare current_balance bigint;
begin
  if tg_op='UPDATE' and (new.currency,new.opening_balance_cents) is distinct from (old.currency,old.opening_balance_cents) then
    raise exception 'La moneda y el saldo inicial no pueden cambiar; registrá un movimiento de ajuste' using errcode='23514';
  end if;
  if tg_op='UPDATE' and old.archived_at is null and new.archived_at is not null then
    select old.opening_balance_cents + coalesce(sum(case
      when m.destination_account_id=old.id then m.amount_cents
      when m.kind='income' then m.amount_cents else -m.amount_cents end),0)
      into current_balance from public.portal_finance_movements m
      where m.voided_at is null and (m.account_id=old.id or m.destination_account_id=old.id);
    if current_balance<>0 then raise exception 'Transferí o ajustá el saldo antes de archivar el fondo' using errcode='23514'; end if;
  end if;
  return new;
end;
$$;

create function private.finance_guard_obligation() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if tg_op='UPDATE' then
    if (new.direction,new.institution_id,new.amount_cents,new.currency,new.issued_on) is distinct from
       (old.direction,old.institution_id,old.amount_cents,old.currency,old.issued_on) then
      raise exception 'El importe, moneda, dirección e institución no pueden cambiar; cancelá y registrá uno nuevo' using errcode='23514';
    end if;
    if new.status='cancelled' and old.status<>'cancelled' and exists (
      select 1 from public.portal_finance_movements where obligation_id=old.id and voided_at is null
    ) then
      raise exception 'No se puede cancelar una obligación con pagos vigentes' using errcode='23514';
    end if;
  end if;
  return new;
end;
$$;

create function private.finance_guard_movement() returns trigger language plpgsql security invoker set search_path='' as $$
declare source_currency text; destination_currency text; linked public.portal_finance_obligations%rowtype; paid bigint;
begin
  if tg_op='UPDATE' then
    if old.voided_at is not null or new.void_reason=old.void_reason or length(btrim(new.void_reason))=0 or
       (to_jsonb(new)-'void_reason'-'voided_at'-'updated_at') is distinct from
       (to_jsonb(old)-'void_reason'-'voided_at'-'updated_at') then
      raise exception 'Un movimiento solo puede anularse una vez, con motivo' using errcode='23514';
    end if;
    new.voided_at=clock_timestamp();
    return new;
  end if;
  select currency into source_currency from public.portal_finance_accounts where id=new.account_id and archived_at is null;
  if source_currency is null then raise exception 'Seleccioná un fondo activo' using errcode='23514'; end if;
  if new.kind='transfer' then
    select currency into destination_currency from public.portal_finance_accounts where id=new.destination_account_id and archived_at is null;
    if destination_currency is distinct from source_currency then
      raise exception 'Las transferencias requieren fondos activos de la misma moneda' using errcode='23514';
    end if;
  end if;
  if new.obligation_id is not null then
    select * into linked from public.portal_finance_obligations where id=new.obligation_id for update;
    if linked.id is null or linked.status<>'open' or linked.currency<>source_currency or
       (new.kind='income' and linked.direction<>'receivable') or
       (new.kind='expense' and linked.direction<>'payable') or
       new.institution_id is distinct from linked.institution_id then
      raise exception 'El cobro o pago no corresponde a esa obligación' using errcode='23514';
    end if;
    select coalesce(sum(amount_cents),0) into paid from public.portal_finance_movements
      where obligation_id=new.obligation_id and voided_at is null;
    if paid+new.amount_cents>linked.amount_cents then
      raise exception 'El pago supera el saldo pendiente' using errcode='23514';
    end if;
  end if;
  return new;
end;
$$;

create function private.finance_stamp() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  new.updated_at=clock_timestamp();
  if tg_op='INSERT' then new.created_at=new.updated_at; new.created_by=auth.uid(); end if;
  return new;
end;
$$;

create function private.finance_log() returns trigger language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is not null and not private.portal_admin() then
    raise exception 'Acceso denegado' using errcode='42501';
  end if;
  insert into public.portal_finance_audit(entity,record_id,action,actor_id,before_data,after_data)
  values(tg_table_name,new.id,tg_op,auth.uid(),case when tg_op='UPDATE' then to_jsonb(old) end,to_jsonb(new));
  return new;
end;
$$;

do $$ declare tab text; begin
  foreach tab in array array['portal_finance_accounts','portal_finance_obligations','portal_finance_movements','portal_finance_documents'] loop
    execute format('alter table public.%I enable row level security',tab);
    execute format('revoke all on public.%I from anon, authenticated',tab);
    execute format('grant select on public.%I to authenticated',tab);
    execute format('create policy finance_admin_read on public.%I for select to authenticated using ((select private.portal_admin()))',tab);
    execute format('create policy finance_admin_insert on public.%I for insert to authenticated with check ((select private.portal_admin()))',tab);
    execute format('create trigger finance_stamp before insert or update on public.%I for each row execute function private.finance_stamp()',tab);
    execute format('create trigger finance_log after insert or update on public.%I for each row execute function private.finance_log()',tab);
  end loop;
end $$;
create trigger finance_guard_account before insert or update on public.portal_finance_accounts for each row execute function private.finance_guard_account();
create trigger finance_guard_obligation before insert or update on public.portal_finance_obligations for each row execute function private.finance_guard_obligation();
create trigger finance_guard_movement before insert or update on public.portal_finance_movements for each row execute function private.finance_guard_movement();
create policy finance_admin_update on public.portal_finance_accounts for update to authenticated
  using ((select private.portal_admin())) with check ((select private.portal_admin()));
create policy finance_admin_update on public.portal_finance_obligations for update to authenticated
  using ((select private.portal_admin())) with check ((select private.portal_admin()));
create policy finance_admin_update on public.portal_finance_movements for update to authenticated
  using ((select private.portal_admin())) with check ((select private.portal_admin()));

grant insert(name,kind,currency,opening_balance_cents,notes),update(name,kind,notes,archived_at)
  on public.portal_finance_accounts to authenticated;
grant insert(direction,institution_id,title,category,amount_cents,currency,issued_on,due_on,reference,notes),
  update(title,category,due_on,reference,notes,status) on public.portal_finance_obligations to authenticated;
grant insert(kind,account_id,destination_account_id,obligation_id,institution_id,title,category,amount_cents,occurred_on,method,reference,notes),
  update(void_reason) on public.portal_finance_movements to authenticated;
grant insert(obligation_id,movement_id,kind,title,file_path,file_name,mime_type,file_size,notes)
  on public.portal_finance_documents to authenticated;

alter table public.portal_finance_audit enable row level security;
revoke all on public.portal_finance_audit from anon, authenticated;
grant select on public.portal_finance_audit to authenticated;
create policy finance_admin_audit on public.portal_finance_audit for select to authenticated using ((select private.portal_admin()));

create index finance_movements_date_idx on public.portal_finance_movements(occurred_on desc);
create index finance_movements_account_idx on public.portal_finance_movements(account_id,occurred_on desc) where voided_at is null;
create index finance_movements_destination_idx on public.portal_finance_movements(destination_account_id) where voided_at is null;
create index finance_movements_obligation_idx on public.portal_finance_movements(obligation_id) where voided_at is null;
create index finance_obligations_due_idx on public.portal_finance_obligations(due_on) where status='open';
create index finance_obligations_institution_idx on public.portal_finance_obligations(institution_id);
create index finance_movements_institution_idx on public.portal_finance_movements(institution_id);
create index finance_documents_obligation_idx on public.portal_finance_documents(obligation_id);
create index finance_documents_movement_idx on public.portal_finance_documents(movement_id);
create index finance_audit_record_idx on public.portal_finance_audit(record_id,happened_at desc);

revoke all on function private.finance_guard_account(),private.finance_guard_obligation(),private.finance_guard_movement(),private.finance_stamp(),private.finance_log()
  from public,anon,authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('grcp-finanzas','grcp-finanzas',false,10485760,array['application/pdf','image/jpeg','image/png']);
create policy finance_files_read on storage.objects for select to authenticated
  using(bucket_id='grcp-finanzas' and (select private.portal_admin()) and exists (
    select 1 from public.portal_finance_documents d where d.file_path=name));
create policy finance_files_insert on storage.objects for insert to authenticated
  with check(bucket_id='grcp-finanzas' and name like 'finance/%' and (select private.portal_admin()));
create policy finance_files_cleanup on storage.objects for delete to authenticated
  using(bucket_id='grcp-finanzas' and (select private.portal_admin()) and not exists (
    select 1 from public.portal_finance_documents d where d.file_path=name));

commit;
