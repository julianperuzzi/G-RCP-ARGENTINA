-- Comprobación después de instalar 03. Ejecutar como postgres en el proyecto GRCP.
-- Todo registro de prueba se revierte. No crea cuentas ni envía correos.
begin;
do $$
begin
  if (select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relname like 'portal_%' and c.relkind='r' and c.relrowsecurity) <> 10 then
    raise exception 'Faltan tablas del portal o RLS';
  end if;
  if not exists(select 1 from storage.buckets where id='grcp-instituciones'
      and not public and file_size_limit=10485760) then
    raise exception 'El bucket privado no está configurado';
  end if;
  if has_table_privilege('anon','public.portal_institutions','SELECT')
      or has_function_privilege('anon','public.get_portal_context()','EXECUTE') then
    raise exception 'El portal permite acceso anónimo';
  end if;
  if not exists(select 1 from auth.users where lower(email)='gruporcpsa@gmail.com' and email_confirmed_at is not null) then
    raise exception 'Falta la cuenta GRCP confirmada';
  end if;
end;
$$;
select set_config('request.jwt.claim.sub',(select id::text from auth.users
  where lower(email)='gruporcpsa@gmail.com' and email_confirmed_at is not null),true);
set local role authenticated;
do $$
declare tenant uuid; asset uuid; training uuid; participant uuid; event_count integer;
begin
  if not (public.get_portal_context()->>'is_admin')::boolean then
    raise exception 'La cuenta GRCP no tiene permisos';
  end if;
  insert into public.portal_institutions(name) values('Verificación transaccional GRCP') returning id into tenant;
  insert into public.portal_assets(institution_id,name,kind) values(tenant,'DEA de prueba','dea') returning id into asset;
  insert into public.portal_inspections(institution_id,asset_id,checked_on,next_review_on,result,checked_by)
    values(tenant,asset,current_date,current_date+30,'pass','Prueba transaccional');
  if not exists(select 1 from public.portal_assets where id=asset and status='operational' and next_review_on=current_date+30) then
    raise exception 'La revisión no actualiza el equipo';
  end if;
  insert into public.portal_activities(institution_id,title,kind,starts_at,repeat_months)
    values(tenant,'Capacitación de prueba','training',now(),1) returning id into training;
  update public.portal_activities set status='completed' where id=training;
  update public.portal_activities set status='completed' where id=training;
  select count(*) into event_count from public.portal_activities where recurrence_source_id=training;
  if event_count <> 1 then raise exception 'La repetición no genera una sola próxima actividad'; end if;
  insert into public.portal_participants(institution_id,activity_id,full_name,attendance)
    values(tenant,training,'Participante de prueba','attended') returning id into participant;
  insert into public.portal_documents(institution_id,activity_id,participant_id,title,kind,file_path,file_name,mime_type,file_size)
    values(tenant,training,participant,'Certificado de prueba','certificate',tenant::text||'/prueba.pdf','prueba.pdf','application/pdf',1);
  if not exists(select 1 from public.portal_audit where institution_id=tenant) then
    raise exception 'La auditoría no registra cambios';
  end if;
  insert into public.portal_requests(institution_id,title,kind,body)
    values(tenant,'Consulta de prueba','question','Verificación sin persistencia');
end;
$$;
reset role;
select set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
set local role authenticated;
do $$
begin
  if (public.get_portal_context()->>'is_admin')::boolean
      or exists(select 1 from public.portal_institutions)
      or exists(select 1 from public.portal_documents)
      or exists(select 1 from public.portal_audit) then
    raise exception 'Una sesión sin membresía puede acceder a datos del portal';
  end if;
  begin
    insert into public.portal_institutions(name) values('No debe permitirse');
    raise exception 'Una sesión sin membresía puede crear instituciones';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;
rollback;
select 'OK: RLS, administración, revisión, recurrencia, certificado y auditoría. Pruebas revertidas.' as resultado;
