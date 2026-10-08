-- Seguimiento de invitaciones y evidencia privada de verificación DEA.
begin;

alter table public.portal_memberships
  add column last_invited_at timestamptz,
  add column invite_failed_at timestamptz,
  add column invite_count integer not null default 0 check (invite_count between 0 and 100000);

create function public.portal_access_activity()
returns table(membership_id uuid, confirmed_at timestamptz, last_sign_in_at timestamptz)
language plpgsql stable security definer set search_path='' as $$
begin
  if not private.portal_admin() then
    raise exception 'Acceso denegado' using errcode='42501';
  end if;
  return query
    select m.id, u.email_confirmed_at, u.last_sign_in_at
    from public.portal_memberships m
    left join auth.users u on lower(u.email)=lower(m.email);
end;
$$;
revoke all on function public.portal_access_activity() from public,anon,authenticated;
grant execute on function public.portal_access_activity() to authenticated;

create table public.dea_verification_documents (
  id uuid primary key default gen_random_uuid(),
  dea_id uuid not null references public.dea_locations(id),
  title text not null check (length(btrim(title)) between 1 and 200),
  file_path text not null unique check (file_path like 'verification/' || dea_id::text || '/%'),
  file_name text not null check (length(file_name) between 1 and 255),
  mime_type text not null check (mime_type in ('application/pdf','image/jpeg','image/png')),
  file_size bigint not null check (file_size between 1 and 10485760),
  notes text not null default '' check (length(notes)<=2000),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);
create index dea_verification_documents_dea_idx on public.dea_verification_documents(dea_id,created_at desc);
alter table public.dea_verification_documents enable row level security;
revoke all on public.dea_verification_documents from anon,authenticated;
grant select on public.dea_verification_documents to authenticated;
grant insert(dea_id,title,file_path,file_name,mime_type,file_size,notes),update(archived_at)
  on public.dea_verification_documents to authenticated;
create policy dea_verification_read on public.dea_verification_documents for select to authenticated
  using ((select private.dea_role())='admin');
create policy dea_verification_insert on public.dea_verification_documents for insert to authenticated
  with check ((select private.dea_role())='admin');
create policy dea_verification_update on public.dea_verification_documents for update to authenticated
  using ((select private.dea_role())='admin') with check ((select private.dea_role())='admin');

create function private.dea_verification_document_stamp() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  if tg_op='INSERT' then
    new.created_by=auth.uid();
    new.created_at=clock_timestamp();
  elsif (to_jsonb(new)-'archived_at') is distinct from (to_jsonb(old)-'archived_at') then
    raise exception 'La evidencia solo puede archivarse' using errcode='23514';
  end if;
  return new;
end;
$$;
create trigger dea_verification_document_stamp before insert or update on public.dea_verification_documents
  for each row execute function private.dea_verification_document_stamp();
revoke all on function private.dea_verification_document_stamp() from public,anon,authenticated;

create function private.dea_verification_document_audit() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is not null and private.dea_role() is distinct from 'admin' then
    raise exception 'Acceso no autorizado' using errcode='42501';
  end if;
  insert into public.dea_audit_log(dea_id,action,actor_id,before_data,after_data)
  values(new.dea_id,tg_op,auth.uid(),case when tg_op='UPDATE' then to_jsonb(old) end,to_jsonb(new));
  return new;
end;
$$;
create trigger dea_verification_document_audit after insert or update on public.dea_verification_documents
  for each row execute function private.dea_verification_document_audit();
revoke all on function private.dea_verification_document_audit() from public,anon,authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('grcp-dea-verification','grcp-dea-verification',false,10485760,array['application/pdf','image/jpeg','image/png']);
create policy dea_verification_files_read on storage.objects for select to authenticated
  using(bucket_id='grcp-dea-verification' and (select private.dea_role())='admin' and exists (
    select 1 from public.dea_verification_documents d where d.file_path=name and d.archived_at is null));
create policy dea_verification_files_insert on storage.objects for insert to authenticated
  with check(bucket_id='grcp-dea-verification' and name like 'verification/%' and (select private.dea_role())='admin');
create policy dea_verification_files_cleanup on storage.objects for delete to authenticated
  using(bucket_id='grcp-dea-verification' and (select private.dea_role())='admin' and not exists (
    select 1 from public.dea_verification_documents d where d.file_path=name));

commit;
