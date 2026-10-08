import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('tesorería GRCP: permisos, saldos y comprobantes privados', async (t) => {
  const db = new PGlite();
  const admin = '11111111-1111-4111-8111-111111111111';
  const member = '22222222-2222-4222-8222-222222222222';
  const operator = '66666666-6666-4666-8666-666666666666';
  const as = async (id) => db.exec(`reset role; select set_config('request.jwt.claim.sub','${id || ''}',false); set role ${id ? 'authenticated' : 'anon'};`);
  const insert = async (table, fields) => (await db.query(
    `insert into public.${table}(${Object.keys(fields).join(',')}) values(${Object.keys(fields).map((_, i) => `$${i + 1}`).join(',')}) returning *`,
    Object.values(fields),
  )).rows[0];
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth; create schema storage;
      create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,last_sign_in_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      grant usage on schema auth,storage to authenticated,anon; grant execute on function auth.uid() to authenticated,anon;
      create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
      alter table storage.objects enable row level security; grant select,insert,update,delete on storage.objects to authenticated;
      insert into auth.users values ('${admin}','gruporcpsa@gmail.com',now()),('${member}','member@example.com',now()),('${operator}','operator@example.com',now());`);
    for (const file of ['01-instalar-registro.sql', '03-instalar-portal.sql', 'migrations/20261007165719_grcp_finance_wallet.sql', 'migrations/20261007191433_grcp_finance_amount_corrections.sql', 'migrations/20261007194929_grcp_portal_access_status_and_dea_evidence.sql', 'migrations/20261008150143_portal_staff_profiles_usage.sql']) {
      await db.exec(await readFile(new URL(`../supabase/${file}`, import.meta.url), 'utf8'));
    }
    await as(admin);
    const institution = await insert('portal_institutions', { name: 'Institución A' });
    await insert('portal_memberships', { institution_id: institution.id, email: 'member@example.com' });
    const cash = await insert('portal_finance_accounts', { name: 'Caja', kind: 'cash', opening_balance_cents: 10000 });
    const bank = await insert('portal_finance_accounts', { name: 'Banco', kind: 'bank' });
    const invoice = await insert('portal_finance_obligations', { direction: 'receivable', institution_id: institution.id, title: 'Capacitación', category: 'Capacitaciones', amount_cents: 15000 });

    await t.test('operador GRCP no accede a Tesorería', async () => {
      await as(admin);
      await insert('portal_operators', { email: 'operator@example.com' });
      await as(operator);
      assert.equal((await db.query('select public.get_portal_context() as c')).rows[0].c.is_operator, true);
      for (const table of ['portal_finance_accounts', 'portal_finance_obligations', 'portal_finance_movements', 'portal_finance_documents', 'portal_finance_audit']) {
        assert.equal((await db.query(`select * from public.${table}`)).rows.length, 0);
      }
      await assert.rejects(insert('portal_finance_accounts', { name: 'Caja operador', kind: 'cash' }), /row-level security/);
    });

    await t.test('institución y visitante no leen ni escriben finanzas', async () => {
      await as(member);
      for (const table of ['portal_finance_accounts', 'portal_finance_obligations', 'portal_finance_movements', 'portal_finance_documents', 'portal_finance_audit']) {
        assert.equal((await db.query(`select * from public.${table}`)).rows.length, 0);
      }
      await assert.rejects(insert('portal_finance_accounts', { name: 'Ajena', kind: 'cash' }), /row-level security/);
      await assert.rejects(db.query('delete from public.portal_finance_accounts'), /permission denied/);
      await as(null);
      await assert.rejects(db.query('select * from public.portal_finance_accounts'), /permission denied/);
    });

    await t.test('cobros parciales no exceden la obligación y pueden anularse con motivo', async () => {
      await as(admin);
      const payment = await insert('portal_finance_movements', { kind: 'income', account_id: cash.id, obligation_id: invoice.id, institution_id: institution.id, title: 'Pago parcial', category: 'Capacitaciones', amount_cents: 5000, method: 'transfer' });
      await assert.rejects(insert('portal_finance_movements', { kind: 'income', account_id: cash.id, obligation_id: invoice.id, institution_id: institution.id, title: 'Exceso', category: 'Capacitaciones', amount_cents: 11000, method: 'transfer' }), /supera el saldo/);
      await assert.rejects(db.query('update public.portal_finance_movements set amount_cents=7000 where id=$1', [payment.id]), /permission denied/);
      await assert.rejects(db.query('update public.portal_finance_movements set void_reason=$1 where id=$2', ['', payment.id]), /solo puede anularse/);
      await db.query('update public.portal_finance_movements set void_reason=$1 where id=$2', ['Carga duplicada', payment.id]);
      assert.ok((await db.query('select voided_at from public.portal_finance_movements where id=$1', [payment.id])).rows[0].voided_at);
      await assert.rejects(db.query('update public.portal_finance_movements set void_reason=$1 where id=$2', ['Otra vez', payment.id]), /solo puede anularse/);
      await insert('portal_finance_movements', { kind: 'income', account_id: cash.id, obligation_id: invoice.id, institution_id: institution.id, title: 'Cobro completo', category: 'Capacitaciones', amount_cents: 15000, method: 'transfer' });
      await assert.rejects(db.query("update public.portal_finance_obligations set status='cancelled' where id=$1", [invoice.id]), /pagos vigentes/);
    });

    await t.test('transferencias entre fondos y documentos respetan moneda y acceso', async () => {
      await as(admin);
      await insert('portal_finance_movements', { kind: 'transfer', account_id: cash.id, destination_account_id: bank.id, title: 'Depósito', category: 'Transferencia', amount_cents: 3000, method: 'transfer' });
      const usd = await insert('portal_finance_accounts', { name: 'USD', kind: 'cash', currency: 'USD' });
      await assert.rejects(insert('portal_finance_movements', { kind: 'transfer', account_id: cash.id, destination_account_id: usd.id, title: 'Cruce', category: 'Transferencia', amount_cents: 100, method: 'transfer' }), /misma moneda/);
      await assert.rejects(db.query('update public.portal_finance_accounts set archived_at=now() where id=$1', [cash.id]), /saldo antes de archivar/);
      const document = await insert('portal_finance_documents', { obligation_id: invoice.id, kind: 'invoice', title: 'Factura', file_path: 'finance/factura.pdf', file_name: 'factura.pdf', mime_type: 'application/pdf', file_size: 100 });
      assert.equal(document.created_by, admin);
      await db.query("insert into storage.objects(bucket_id,name) values('grcp-finanzas','finance/factura.pdf')");
      assert.equal((await db.query("select * from storage.objects where bucket_id='grcp-finanzas'")).rows.length, 1);
      await as(member);
      assert.equal((await db.query("select * from storage.objects where bucket_id='grcp-finanzas'")).rows.length, 0);
      await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values('grcp-finanzas','finance/ajeno.pdf')"), /row-level security/);
      await as(admin);
      assert.ok((await db.query("select * from public.portal_finance_audit where record_id=$1", [invoice.id])).rows.length);
    });
    await t.test('corrección de importes conserva auditoría y permisos', async () => {
      await as(admin);
      await assert.rejects(db.query('update public.portal_finance_obligations set amount_cents=14000 where id=$1', [invoice.id]), /menor que los cobros/);
      await db.query('update public.portal_finance_obligations set amount_cents=18000 where id=$1', [invoice.id]);
      const payment = await insert('portal_finance_movements', { kind: 'income', account_id: cash.id, obligation_id: invoice.id, institution_id: institution.id, title: 'Saldo', category: 'Capacitaciones', amount_cents: 3000, method: 'transfer' });
      const corrected = (await db.query('select public.portal_finance_correct_movement($1,$2,$3) as id', [payment.id, 2500, 'Error de carga'])).rows[0].id;
      const rows = (await db.query('select id,amount_cents,voided_at,corrects_movement_id from public.portal_finance_movements where id in ($1,$2)', [payment.id, corrected])).rows;
      assert.ok(rows.find((row) => row.id === payment.id).voided_at);
      assert.equal(Number(rows.find((row) => row.id === corrected).amount_cents), 2500);
      assert.equal(rows.find((row) => row.id === corrected).corrects_movement_id, payment.id);
      await assert.rejects(db.query('select public.portal_finance_correct_movement($1,$2,$3)', [corrected, 999999, 'Error de carga']), /supera el saldo/);
      assert.equal((await db.query('select voided_at from public.portal_finance_movements where id=$1', [corrected])).rows[0].voided_at, null);
      await as(member);
      await assert.rejects(db.query('select public.portal_finance_correct_movement($1,$2,$3)', [corrected, 2000, 'Ajeno']), /Acceso denegado/);
    });
    await t.test('estado de invitaciones y evidencia DEA son privados de GRCP', async () => {
      await as(admin);
      const membership = (await db.query('select id from public.portal_memberships where institution_id=$1', [institution.id])).rows[0];
      await db.exec('reset role');
      await db.query('update public.portal_memberships set last_invited_at=now(),invite_count=1 where id=$1', [membership.id]);
      await as(admin);
      const activity = (await db.query('select * from public.portal_access_activity()')).rows;
      assert.equal(activity.find((row) => row.membership_id === membership.id).confirmed_at != null, true);
      const dea = await insert('dea_locations', { name: 'Sede prueba', latitude: -31.5, longitude: -68.5 });
      const evidence = await insert('dea_verification_documents', { dea_id: dea.id, title: 'Foto de verificación', file_path: `verification/${dea.id}/foto.jpg`, file_name: 'foto.jpg', mime_type: 'image/jpeg', file_size: 100 });
      assert.equal(evidence.created_by, admin);
      await db.query('insert into storage.objects(bucket_id,name) values($1,$2)', ['grcp-dea-verification', evidence.file_path]);
      assert.equal((await db.query('select * from public.dea_verification_documents')).rows.length, 1);
      assert.equal((await db.query("select * from storage.objects where bucket_id='grcp-dea-verification'")).rows.length, 1);
      await as(member);
      await assert.rejects(db.query('select * from public.portal_access_activity()'), /Acceso denegado/);
      assert.equal((await db.query('select * from public.dea_verification_documents')).rows.length, 0);
      assert.equal((await db.query("select * from storage.objects where bucket_id='grcp-dea-verification'")).rows.length, 0);
      await assert.rejects(insert('dea_verification_documents', { dea_id: dea.id, title: 'Ajena', file_path: `verification/${dea.id}/ajena.jpg`, file_name: 'ajena.jpg', mime_type: 'image/jpeg', file_size: 100 }), /row-level security/);
    });
  } finally {
    await db.close();
  }
});
