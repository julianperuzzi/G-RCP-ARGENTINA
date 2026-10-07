-- Ubicación privada de instituciones y sedes; conserva RLS y permisos GRCP.
begin;
alter table public.portal_institutions
  add column latitude double precision,
  add column longitude double precision,
  add constraint portal_institution_coordinates check (
    (latitude is null and longitude is null) or
    (latitude is not null and longitude is not null and latitude between -90 and 90 and longitude between -180 and 180)
  );
alter table public.portal_sites
  add column latitude double precision,
  add column longitude double precision,
  add constraint portal_site_coordinates check (
    (latitude is null and longitude is null) or
    (latitude is not null and longitude is not null and latitude between -90 and 90 and longitude between -180 and 180)
  );
grant insert(latitude,longitude), update(latitude,longitude) on public.portal_institutions to authenticated;
grant insert(latitude,longitude), update(latitude,longitude) on public.portal_sites to authenticated;
commit;
