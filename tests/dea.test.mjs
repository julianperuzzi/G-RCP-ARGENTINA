import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { zipSync, strToU8 } from 'fflate';
import { distanceKm, validateDea, directionsUrl, potentialDeaDuplicates } from '../src/lib/dea.js';
import { parseDeaFile } from '../src/lib/deaImport.js';

test('distance, coordinate validation and destination navigation', () => {
  assert.equal(distanceKm({latitude:-34,longitude:-58},{latitude:-34,longitude:-58}),0);
  assert.ok(Math.abs(distanceKm({latitude:-34,longitude:-58},{latitude:-35,longitude:-58})-111.195)<.01);
  assert.ok(validateDea({name:'DEA',latitude:0,longitude:0}));
  assert.ok(validateDea({name:'DEA',latitude:-34,longitude:-58,verification:'verified'}));
  assert.equal(validateDea({name:'DEA',latitude:-34,longitude:-58,verification:'unverified'}),'');
  const url = new URL(directionsUrl({latitude:-34,longitude:-58},'driving'));
  assert.equal(url.searchParams.get('destination'),'-34,-58');
  assert.equal(url.searchParams.get('travelmode'),'driving');
  assert.equal(url.searchParams.has('origin'),false);
});

test('advierte coincidencias cercanas sin bloquear ubicaciones legítimas', () => {
  const records = [
    { id: 'one', name: 'Estación Central', address: 'San Martín 100', city: 'San Juan', latitude: -31.53, longitude: -68.52 },
    { id: 'two', name: 'Sede Norte', address: 'Otra calle', city: 'San Juan', latitude: -31.6, longitude: -68.6 },
  ];
  assert.deepEqual(potentialDeaDuplicates(records, { name: 'Nuevo DEA', latitude: -31.5301, longitude: -68.52 }).map((row) => row.id), ['one']);
  assert.deepEqual(potentialDeaDuplicates(records, { name: 'Estación Central', address: 'San Martín 100', city: 'San Juan', latitude: -31.55, longitude: -68.55 }).map((row) => row.id), ['one']);
  assert.equal(potentialDeaDuplicates(records, { name: 'Nuevo DEA', latitude: -31.5301, longitude: -68.52 }, 'one').length, 0);
});

test('KML imports remove markup, reject invalid and duplicate points, and block XML entities', () => {
  const xml = '<kml><Document><Placemark><name><![CDATA[<b>Clínica</b>]]></name><Point><coordinates>-58,-34,0</coordinates></Point></Placemark><Placemark><name>Clínica</name><Point><coordinates>-58,-34</coordinates></Point></Placemark><Placemark><name>Fuera</name><Point><coordinates>0,0</coordinates></Point></Placemark></Document></kml>';
  const result = parseDeaFile(zipSync({'doc.kml':strToU8(xml)}),'test.kmz');
  assert.equal(result.records.length,1); assert.equal(result.rejected.length,2);
  assert.equal(result.records[0].name,'Clínica');
  assert.equal(result.records[0].verification,'unverified');
  assert.throws(()=>parseDeaFile(strToU8('<!DOCTYPE x><kml/>'),'test.kml'),/no permitidas/);
  assert.throws(()=>parseDeaFile(zipSync({'doc.kml':new Uint8Array(21*1024*1024)}),'large.kmz'),/20 MB/);
});

test('actual PostgreSQL schema, exclusive Auth account, audit, publication and repeat-safe seed', async () => {
  const db = new PGlite();
  const admin = '11111111-1111-4111-8111-111111111111', other = '22222222-2222-4222-8222-222222222222';
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      grant usage on schema auth to authenticated,anon; grant execute on function auth.uid() to authenticated,anon;
      insert into auth.users values ('${admin}','gruporcpsa@gmail.com',now()),('${other}','other@example.com',now());`);
    await db.exec(await readFile(new URL('../supabase/01-instalar-registro.sql',import.meta.url),'utf8'));
    const seed = await readFile(new URL('../supabase/02-cargar-dea.sql',import.meta.url),'utf8');
    await db.exec(seed); await db.exec(seed);
    assert.equal((await db.query('select count(*)::int as n from public.dea_locations')).rows[0].n,437);
    await db.exec('set role anon');
    assert.equal((await db.query('select count(name)::int as n from public.dea_locations')).rows[0].n,437);
    await assert.rejects(db.query("insert into public.dea_locations(name,latitude,longitude) values ('forbidden',-34,-58)"),/permission denied/);
    await assert.rejects(db.query('select * from public.dea_audit_log'),/permission denied/);
    await db.exec(`reset role; select set_config('request.jwt.claim.sub','${other}',false); set role authenticated;`);
    assert.equal((await db.query('select public.get_dea_role() as role')).rows[0].role,null);
    await assert.rejects(db.query("insert into public.dea_locations(name,latitude,longitude) values ('forbidden',-34,-58)"),/row-level security/);
    assert.equal((await db.query("update public.dea_locations set name='forbidden' returning id")).rows.length,0);
    assert.equal((await db.query('select * from public.dea_audit_log')).rows.length,0);
    await db.exec(`reset role; select set_config('request.jwt.claim.sub','${admin}',false); set role authenticated;`);
    assert.equal((await db.query('select public.get_dea_role() as role')).rows[0].role,'admin');
    const id = (await db.query("insert into public.dea_locations(name,latitude,longitude) values ('Test draft',-34,-58) returning id,created_by")).rows[0];
    assert.equal(id.created_by,admin);
    await db.exec('reset role; set role anon');
    assert.equal((await db.query(`select name from public.dea_locations where id='${id.id}'`)).rows.length,0);
    await db.exec('reset role; set role authenticated');
    await db.query(`update public.dea_locations set published=true where id='${id.id}'`);
    await db.exec('reset role; set role anon');
    assert.equal((await db.query(`select name from public.dea_locations where id='${id.id}'`)).rows.length,1);
    await db.exec('reset role; set role authenticated');
    await db.query(`update public.dea_locations set archived_at=now(), published=false where id='${id.id}'`);
    assert.equal((await db.query(`select * from public.dea_audit_log where dea_id='${id.id}'`)).rows.length,3);
    await assert.rejects(db.query(`update public.dea_locations set created_by='${other}' where id='${id.id}'`),/permission denied/);
    await assert.rejects(db.query(`delete from public.dea_locations where id='${id.id}'`),/permission denied/);
    await assert.rejects(db.query("insert into public.dea_audit_log(dea_id,action) values (gen_random_uuid(),'INSERT')"),/permission denied/);
    await assert.rejects(db.query("insert into public.dea_locations(name,latitude,longitude,verification) values ('invalid verified',-34,-58,'verified')"),/verified_date_required/);
    await db.exec(`reset role; update auth.users set email_confirmed_at=null where id='${admin}'; set role authenticated;`);
    assert.equal((await db.query('select public.get_dea_role() as role')).rows[0].role,null);
    await assert.rejects(db.query("insert into public.dea_locations(name,latitude,longitude) values ('unconfirmed',-34,-58)"),/row-level security/);
  } finally { await db.close(); }
});
