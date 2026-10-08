-- Correcciones de importes con trazabilidad y sin perder movimientos ni comprobantes.
begin;

create or replace function private.finance_guard_obligation() returns trigger
language plpgsql security invoker set search_path='' as $$
declare already_paid bigint;
begin
  if tg_op='UPDATE' then
    if (new.direction,new.institution_id,new.currency,new.issued_on) is distinct from
       (old.direction,old.institution_id,old.currency,old.issued_on) then
      raise exception 'La moneda, dirección e institución no pueden cambiar; cancelá y registrá uno nuevo' using errcode='23514';
    end if;
    if old.status='cancelled' and new.amount_cents is distinct from old.amount_cents then
      raise exception 'No se puede corregir el importe de un registro cancelado' using errcode='23514';
    end if;
    if new.amount_cents is distinct from old.amount_cents then
      select coalesce(sum(amount_cents),0) into already_paid
      from public.portal_finance_movements
      where obligation_id=old.id and voided_at is null;
      if new.amount_cents<already_paid then
        raise exception 'El importe corregido no puede ser menor que los cobros o pagos vigentes' using errcode='23514';
      end if;
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

grant update(amount_cents) on public.portal_finance_obligations to authenticated;

alter table public.portal_finance_movements
  add column corrects_movement_id uuid references public.portal_finance_movements(id);
create index finance_movements_correction_idx on public.portal_finance_movements(corrects_movement_id)
  where corrects_movement_id is not null;
grant insert(corrects_movement_id) on public.portal_finance_movements to authenticated;

create function public.portal_finance_correct_movement(
  p_movement_id uuid, p_amount_cents bigint, p_reason text
) returns uuid language plpgsql security invoker set search_path='' as $$
declare original public.portal_finance_movements%rowtype;
declare replacement_id uuid;
begin
  if not private.portal_admin() then
    raise exception 'Acceso denegado' using errcode='42501';
  end if;
  if p_amount_cents is null or p_amount_cents<1 or p_amount_cents>9000000000000 then
    raise exception 'Ingresá un importe válido' using errcode='23514';
  end if;
  if length(btrim(coalesce(p_reason,''))) not between 3 and 476 then
    raise exception 'Explicá el motivo de la corrección' using errcode='23514';
  end if;
  select * into original from public.portal_finance_movements
    where id=p_movement_id for update;
  if original.id is null or original.voided_at is not null then
    raise exception 'El movimiento no existe o ya está anulado' using errcode='23514';
  end if;
  if original.amount_cents=p_amount_cents then
    raise exception 'El nuevo importe debe ser diferente' using errcode='23514';
  end if;

  update public.portal_finance_movements
    set void_reason='Corrección de importe: ' || btrim(p_reason)
    where id=original.id;
  insert into public.portal_finance_movements (
    kind,account_id,destination_account_id,obligation_id,institution_id,
    title,category,amount_cents,occurred_on,method,reference,notes,corrects_movement_id
  ) values (
    original.kind,original.account_id,original.destination_account_id,
    original.obligation_id,original.institution_id,original.title,original.category,
    p_amount_cents,original.occurred_on,original.method,original.reference,original.notes,original.id
  ) returning id into replacement_id;
  return replacement_id;
end;
$$;
revoke all on function public.portal_finance_correct_movement(uuid,bigint,text) from public,anon,authenticated;
grant execute on function public.portal_finance_correct_movement(uuid,bigint,text) to authenticated;

commit;
