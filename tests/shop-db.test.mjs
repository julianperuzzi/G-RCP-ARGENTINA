import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('tienda: borradores privados, edición GRCP, fotos y auditoría', async () => {
  const db = new PGlite();
  const owner = '11111111-1111-4111-8111-111111111111';
  const institution = '22222222-2222-4222-8222-222222222222';
  const as = async (id, role = 'authenticated') => db.exec(`reset role; select set_config('request.jwt.claim.sub','${id || ''}',false); set role ${role};`);
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth; create schema storage; create schema private;
      create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      grant usage on schema auth,storage,private to authenticated; grant usage on schema auth,storage to anon;
      grant execute on function auth.uid() to authenticated,anon;
      create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
      alter table storage.objects enable row level security;
      grant select,insert,delete on storage.objects to authenticated;
      create function private.portal_admin() returns boolean language sql stable security definer set search_path='' as $$
        select exists(select 1 from auth.users where id=(select auth.uid()) and lower(email)='gruporcpsa@gmail.com' and email_confirmed_at is not null)
      $$;
      grant execute on function private.portal_admin() to authenticated;
      insert into auth.users(id,email,email_confirmed_at) values
        ('${owner}','gruporcpsa@gmail.com',now()),('${institution}','institucion@example.com',now());`);
    await db.exec(await readFile(new URL('../supabase/migrations/20261008170418_shop_catalog.sql', import.meta.url), 'utf8'));
    await as(owner);
    const draft = (await db.query(`insert into public.shop_products(name,category,price_cents,stock_mode,stock_quantity)
      values('Kit RCP','Capacitación',2500000,'limited',3) returning id`)).rows[0];
    const published = (await db.query(`insert into public.shop_products(name,category,price_cents,stock_mode,status)
      values('Camilla','Rescate',1700000,'available','published') returning id`)).rows[0];
    await db.query(`insert into public.shop_product_images(product_id,file_path,alt_text) values($1,$2,'Foto de camilla')`, [published.id, `${published.id}/foto.jpg`]);
    assert.equal((await db.query(`select count(*)::int as count from public.shop_product_audit`)).rows[0].count, 2);
    await db.query(`update public.shop_products set price_cents=1800000 where id=$1`, [published.id]);
    assert.equal((await db.query(`select count(*)::int as count from public.shop_product_audit where product_id=$1`, [published.id])).rows[0].count, 2);
    await as(institution);
    assert.deepEqual((await db.query(`select name from public.shop_products order by name`)).rows.map((row) => row.name), ['Camilla']);
    assert.equal((await db.query(`select count(*)::int as count from public.shop_product_images`)).rows[0].count, 1);
    assert.equal((await db.query(`select count(*)::int as count from public.shop_product_audit`)).rows[0].count, 0);
    await assert.rejects(db.query(`insert into public.shop_products(name,price_cents) values('Intruso',1000)`), /row-level security|permission denied/i);
    assert.equal((await db.query(`update public.shop_products set price_cents=1 where id=$1`, [published.id])).affectedRows, 0);
    assert.equal((await db.query(`select price_cents from public.shop_products where id=$1`, [published.id])).rows[0].price_cents, 1800000);
    await assert.rejects(db.query(`insert into storage.objects(bucket_id,name) values('shop-images','${draft.id}/unauthorized.jpg')`), /row-level security|permission denied/i);
    await as('', 'anon');
    assert.equal((await db.query(`select count(*)::int as count from public.shop_products`)).rows[0].count, 1);
    assert.equal((await db.query(`select count(*)::int as count from public.shop_product_images`)).rows[0].count, 1);
    await assert.rejects(db.query(`select * from public.shop_product_audit`), /permission denied/i);
    await as(owner);
    await db.query(`update public.shop_products set status='published' where id=$1`, [draft.id]);
    await as('', 'anon');
    assert.equal((await db.query(`select count(*)::int as count from public.shop_products`)).rows[0].count, 2);
  } finally { await db.close(); }
});
