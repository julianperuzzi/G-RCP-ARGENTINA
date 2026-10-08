-- Catálogo público administrado exclusivamente por la cuenta principal de GRCP.
begin;

create table public.shop_products (
  id uuid primary key default gen_random_uuid(),
  sku text unique check (sku is null or length(btrim(sku)) between 1 and 60),
  name text not null check (length(btrim(name)) between 2 and 180),
  category text not null default 'Equipamiento' check (length(btrim(category)) between 2 and 80),
  summary text not null default '' check (length(summary) <= 350),
  description text not null default '' check (length(description) <= 8000),
  price_cents bigint not null check (price_cents > 0 and price_cents <= 99999999999),
  sale_price_cents bigint check (sale_price_cents is null or (sale_price_cents > 0 and sale_price_cents < price_cents)),
  stock_mode text not null default 'out_of_stock' check (stock_mode in ('available','limited','out_of_stock')),
  stock_quantity integer not null default 0 check (stock_quantity >= 0 and stock_quantity <= 1000000),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  external_image_url text check (external_image_url is null or
    (length(external_image_url) <= 2000 and external_image_url ~ '^https://[^[:space:]]+$')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  constraint shop_stock_quantity_matches_mode check (stock_mode <> 'limited' or stock_quantity > 0)
);
create index shop_products_public_idx on public.shop_products(featured desc,sort_order,name)
  where status = 'published';
create index shop_products_category_idx on public.shop_products(category) where status = 'published';
alter table public.shop_products enable row level security;
revoke all on public.shop_products from anon,authenticated;
grant select on public.shop_products to anon,authenticated;
grant insert,update on public.shop_products to authenticated;
create policy shop_products_public_read on public.shop_products for select to anon
  using (status = 'published');
create policy shop_products_signed_read on public.shop_products for select to authenticated
  using (status = 'published' or (select private.portal_admin()));
create policy shop_products_owner_insert on public.shop_products for insert to authenticated
  with check ((select private.portal_admin()));
create policy shop_products_owner_update on public.shop_products for update to authenticated
  using ((select private.portal_admin())) with check ((select private.portal_admin()));

create function private.shop_stamp_product() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = clock_timestamp();
  new.updated_by = auth.uid();
  if tg_op = 'INSERT' then
    new.created_at = new.updated_at;
    new.created_by = auth.uid();
  end if;
  return new;
end;
$$;
create trigger shop_product_stamp before insert or update on public.shop_products
  for each row execute function private.shop_stamp_product();
revoke all on function private.shop_stamp_product() from public,anon,authenticated;

create table public.shop_product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.shop_products(id) on delete cascade,
  file_path text not null unique check (file_path like product_id::text || '/%'),
  alt_text text not null default '' check (length(alt_text) <= 180),
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now()
);
create index shop_product_images_product_idx on public.shop_product_images(product_id,position,id);
alter table public.shop_product_images enable row level security;
revoke all on public.shop_product_images from anon,authenticated;
grant select on public.shop_product_images to anon,authenticated;
grant insert,update,delete on public.shop_product_images to authenticated;
create policy shop_images_public_read on public.shop_product_images for select to anon
  using (exists (select 1 from public.shop_products p where p.id=product_id and p.status='published'));
create policy shop_images_signed_read on public.shop_product_images for select to authenticated
  using (exists (select 1 from public.shop_products p where p.id=product_id and p.status='published')
    or (select private.portal_admin()));
create policy shop_images_owner_insert on public.shop_product_images for insert to authenticated
  with check ((select private.portal_admin()));
create policy shop_images_owner_update on public.shop_product_images for update to authenticated
  using ((select private.portal_admin())) with check ((select private.portal_admin()));
create policy shop_images_owner_delete on public.shop_product_images for delete to authenticated
  using ((select private.portal_admin()));

create table public.shop_product_audit (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.shop_products(id),
  action text not null check (action in ('INSERT','UPDATE')),
  actor_id uuid references auth.users(id) on delete set null,
  happened_at timestamptz not null default now(),
  before_data jsonb,
  after_data jsonb not null
);
create index shop_product_audit_product_idx on public.shop_product_audit(product_id,happened_at desc);
alter table public.shop_product_audit enable row level security;
revoke all on public.shop_product_audit from anon,authenticated;
grant select on public.shop_product_audit to authenticated;
create policy shop_audit_owner_read on public.shop_product_audit for select to authenticated
  using ((select private.portal_admin()));
create function private.shop_audit_product() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.shop_product_audit(product_id,action,actor_id,before_data,after_data)
  values(new.id,tg_op,auth.uid(),case when tg_op='UPDATE' then to_jsonb(old) else null end,to_jsonb(new));
  return new;
end;
$$;
create trigger shop_product_audit after insert or update on public.shop_products
  for each row execute function private.shop_audit_product();
revoke all on function private.shop_audit_product() from public,anon,authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('shop-images','shop-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy shop_images_owner_list on storage.objects for select to authenticated
  using (bucket_id='shop-images' and (select private.portal_admin()));
create policy shop_images_owner_upload on storage.objects for insert to authenticated
  with check (bucket_id='shop-images' and (select private.portal_admin()));
create policy shop_images_owner_remove on storage.objects for delete to authenticated
  using (bucket_id='shop-images' and (select private.portal_admin()));

commit;
