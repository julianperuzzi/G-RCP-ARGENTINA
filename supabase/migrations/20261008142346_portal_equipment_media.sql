begin;

alter table public.portal_assets drop constraint portal_assets_kind_check;
alter table public.portal_assets add constraint portal_assets_kind_check
  check (kind in (
    'dea', 'kit', 'trauma_kit', 'spine_board', 'oxygen_kit', 'bvm',
    'splint_kit', 'evacuation_chair', 'exit', 'extinguisher', 'other'
  ));

alter table public.portal_documents add column asset_id uuid;
alter table public.portal_documents add constraint portal_documents_asset_institution_fkey
  foreign key (asset_id, institution_id) references public.portal_assets(id, institution_id);
alter table public.portal_documents drop constraint portal_documents_kind_check;
alter table public.portal_documents add constraint portal_documents_kind_check
  check (kind in ('certificate', 'protocol', 'report', 'photo', 'manual', 'other'));
alter table public.portal_documents add constraint portal_documents_photo_asset_check
  check (kind <> 'photo' or (asset_id is not null and mime_type in ('image/jpeg', 'image/png')));
alter table public.portal_documents add constraint portal_documents_manual_asset_check
  check (kind <> 'manual' or asset_id is not null);

create index portal_documents_asset_idx on public.portal_documents(asset_id)
  where asset_id is not null;
grant insert(asset_id) on public.portal_documents to authenticated;

commit;
