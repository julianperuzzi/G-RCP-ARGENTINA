import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("portal institucional: SQL real, permisos y separación de instituciones", async (t) => {
  const db = new PGlite();
  const ids = {
    admin: "11111111-1111-4111-8111-111111111111",
    a: "22222222-2222-4222-8222-222222222222",
    b: "33333333-3333-4333-8333-333333333333",
    viewer: "44444444-4444-4444-8444-444444444444",
    outsider: "55555555-5555-4555-8555-555555555555",
    operator: "66666666-6666-4666-8666-666666666666",
  };
  const as = async (user) =>
    db.exec(
      `reset role; select set_config('request.jwt.claim.sub','${ids[user] || ""}',false); set role ${user === "anon" ? "anon" : "authenticated"};`,
    );
  const insert = async (table, values) =>
    (
      await db.query(
        `insert into public.${table}(${Object.keys(values).join(",")}) values(${Object.keys(
          values,
        )
          .map((_, i) => `$${i + 1}`)
          .join(",")}) returning *`,
        Object.values(values),
      )
    ).rows[0];
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth; create schema storage;
      create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,last_sign_in_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      grant usage on schema auth,storage to authenticated,anon; grant execute on function auth.uid() to authenticated,anon;
      create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
      alter table storage.objects enable row level security; grant select,insert,update,delete on storage.objects to authenticated;
      insert into auth.users(id,email,email_confirmed_at,last_sign_in_at) values ('${ids.admin}','gruporcpsa@gmail.com',now(),now()),('${ids.a}','a@example.com',now(),now()),
      ('${ids.b}','b@example.com',now(),null),('${ids.viewer}','viewer@example.com',now(),null),('${ids.outsider}','outsider@example.com',now(),null),('${ids.operator}','operator@example.com',now(),now());`);
    await db.exec(
      await readFile(
        new URL("../supabase/01-instalar-registro.sql", import.meta.url),
        "utf8",
      ),
    );
    await db.exec(
      await readFile(
        new URL("../supabase/03-instalar-portal.sql", import.meta.url),
        "utf8",
      ),
    );
    await db.exec(await readFile(new URL("../supabase/migrations/20261007044329_portal_institution_locations.sql", import.meta.url), "utf8"));
    await db.exec(await readFile(new URL("../supabase/migrations/20261008142346_portal_equipment_media.sql", import.meta.url), "utf8"));
    await db.exec(await readFile(new URL("../supabase/migrations/20261008150143_portal_staff_profiles_usage.sql", import.meta.url), "utf8"));
    await as("admin");
    const a = await insert("portal_institutions", { name: "Escuela A" });
    const b = await insert("portal_institutions", { name: "Empresa B" });
    const ma = await insert("portal_memberships", {
      institution_id: a.id,
      email: "a@example.com",
      role: "manager",
    });
    await insert("portal_memberships", {
      institution_id: b.id,
      email: "b@example.com",
      role: "manager",
    });
    await insert("portal_memberships", {
      institution_id: a.id,
      email: "viewer@example.com",
      role: "viewer",
    });
    const siteB = await insert("portal_sites", {
      institution_id: b.id,
      name: "Sede B",
    });
    const assetA = await insert("portal_assets", {
      institution_id: a.id,
      name: "DEA A",
      kind: "dea",
    });
    const assetB = await insert("portal_assets", {
      institution_id: b.id,
      name: "DEA B",
      kind: "dea",
      site_id: siteB.id,
    });
    const training = await insert("portal_activities", {
      institution_id: a.id,
      title: "RCP A",
      kind: "training",
      starts_at: "2026-01-31T13:00:00Z",
      ends_at: "2026-01-31T15:00:00Z",
      repeat_months: 1,
    });
    const person = await insert("portal_participants", {
      institution_id: a.id,
      activity_id: training.id,
      full_name: "Asistente A",
      attendance: "attended",
    });
    const cert = {
      institution_id: a.id,
      activity_id: training.id,
      participant_id: person.id,
      title: "Certificado A",
      kind: "certificate",
      file_path: `${a.id}/cert.pdf`,
      file_name: "cert.pdf",
      mime_type: "application/pdf",
      file_size: 100,
    };

    await t.test(
      "anon no puede leer datos privados ni invocar el contexto",
      async () => {
        await as("anon");
        await assert.rejects(
          db.query("select * from public.portal_institutions"),
          /permission denied/,
        );
        await assert.rejects(
          db.query("select public.get_portal_context()"),
          /permission denied/,
        );
      },
    );
    await t.test(
      "responsables ven solo sus instituciones incluso sin filtro de interfaz",
      async () => {
        await as("a");
        assert.deepEqual(
          (
            await db.query("select name from public.portal_institutions")
          ).rows.map((r) => r.name),
          ["Escuela A"],
        );
        assert.deepEqual(
          (await db.query("select name from public.portal_assets")).rows.map(
            (r) => r.name,
          ),
          ["DEA A"],
        );
        assert.equal(
          (await db.query("select * from public.portal_memberships")).rows
            .length,
          1,
        );
        assert.equal(
          (await db.query("select public.get_portal_context() c")).rows[0].c
            .is_admin,
          false,
        );
        await as("b");
        assert.deepEqual(
          (await db.query("select name from public.portal_assets")).rows.map(
            (r) => r.name,
          ),
          ["DEA B"],
        );
      },
    );
    await t.test(
      "cliente no cambia equipos, asigna permisos ni genera certificados",
      async () => {
        await as("a");
        assert.equal(
          (
            await db.query(
              "update public.portal_assets set status='operational' returning id",
            )
          ).rows.length,
          0,
        );
        await assert.rejects(
          insert("portal_memberships", {
            institution_id: b.id,
            email: "a@example.com",
          }),
          /row-level security/,
        );
        await assert.rejects(
          insert("portal_documents", cert),
          (e) => e.code === "42501",
        );
        await assert.rejects(
          db.query("delete from public.portal_assets"),
          /permission denied/,
        );
      },
    );
    await t.test('una institución no crea instituciones, capacitaciones ni otros registros de GRCP', async () => {
      await as('a');
      const restricted = [
        ['portal_institutions', { name: 'Institución creada por cliente' }],
        ['portal_memberships', { institution_id: a.id, email: 'nuevo@example.com' }],
        ['portal_sites', { institution_id: a.id, name: 'Sede cliente' }],
        ['portal_assets', { institution_id: a.id, name: 'Equipo cliente', kind: 'dea' }],
        ['portal_activities', { institution_id: a.id, title: 'Capacitación cliente', kind: 'training', starts_at: '2026-03-01T13:00:00Z' }],
        ['portal_inspections', { institution_id: a.id, asset_id: assetA.id, checked_on: '2026-01-01', result: 'pass', checked_by: 'Cliente' }],
        ['portal_participants', { institution_id: a.id, activity_id: training.id, full_name: 'Cargado por cliente' }],
        ['portal_documents', { institution_id: a.id, title: 'Documento cliente', kind: 'report', file_path: `${a.id}/cliente.pdf`, file_name: 'cliente.pdf', mime_type: 'application/pdf', file_size: 100 }],
      ];
      for (const [table, fields] of restricted) {
        await assert.rejects(insert(table, fields), (error) => ['42501', '23514'].includes(error.code), table);
      }
      assert.equal((await db.query("update public.portal_activities set title='Modificada' where id=$1 returning id", [training.id])).rows.length, 0);
    });
    await t.test('cada módulo oculta los registros de otra institución incluso en consultas directas', async () => {
      await as('admin');
      const activityB = await insert('portal_activities', { institution_id: b.id, title: 'Curso B', kind: 'training', starts_at: '2026-04-01T13:00:00Z' });
      await insert('portal_participants', { institution_id: b.id, activity_id: activityB.id, full_name: 'Asistente B' });
      await insert('portal_inspections', { institution_id: b.id, asset_id: assetB.id, checked_on: '2026-01-01', result: 'pass', checked_by: 'GRCP' });
      await insert('portal_documents', { institution_id: b.id, title: 'Informe B', kind: 'report', file_path: `${b.id}/informe.pdf`, file_name: 'informe.pdf', mime_type: 'application/pdf', file_size: 100 });
      await insert('portal_requests', { institution_id: b.id, title: 'Consulta B', kind: 'question', body: 'Consulta privada' });
      await as('a');
      for (const table of ['portal_sites', 'portal_assets', 'portal_activities', 'portal_inspections', 'portal_participants', 'portal_documents', 'portal_requests']) {
        assert.equal((await db.query(`select * from public.${table} where institution_id=$1`, [b.id])).rows.length, 0, table);
      }
      assert.equal((await db.query('select * from public.portal_institutions where id=$1', [b.id])).rows.length, 0);
      assert.equal((await db.query('select * from public.portal_memberships where institution_id=$1', [b.id])).rows.length, 0);
      await as('viewer');
      assert.equal((await db.query('select * from public.portal_activities where institution_id=$1', [b.id])).rows.length, 0);
    });
    await t.test(
      "responsable crea solicitudes, sin responderlas ni saltar de institución",
      async () => {
        await as("a");
        const r = await insert("portal_requests", {
          institution_id: a.id,
          title: "Revisar DEA",
          kind: "inspection",
          body: "Coordinar revisión",
        });
        assert.equal(r.created_by, ids.a);
        assert.equal(
          (
            await db.query(
              "update public.portal_requests set status='resolved',response='Inventado' returning id",
            )
          ).rows.length,
          0,
        );
        await assert.rejects(
          insert("portal_requests", {
            institution_id: b.id,
            title: "Fuera",
            kind: "question",
            body: "X",
          }),
          /row-level security/,
        );
        await assert.rejects(
          insert("portal_requests", {
            institution_id: a.id,
            title: "Estado falso",
            kind: "question",
            body: "X",
            status: "resolved",
            response: "X",
          }),
          /row-level security/,
        );
        await assert.rejects(
          insert("portal_requests", {
            institution_id: a.id,
            asset_id: assetB.id,
            title: "Equipo ajeno",
            kind: "question",
            body: "X",
          }),
          /foreign key/,
        );
        await as("viewer");
        await assert.rejects(
          insert("portal_requests", {
            institution_id: a.id,
            title: "Consulta",
            kind: "question",
            body: "X",
          }),
          /row-level security/,
        );
      },
    );
    await t.test(
      "relaciones entre sedes, equipos y documentos no cruzan instituciones",
      async () => {
        await as("admin");
        await assert.rejects(
          insert("portal_assets", {
            institution_id: a.id,
            site_id: siteB.id,
            name: "Cruzado",
            kind: "dea",
          }),
          /foreign key/,
        );
        await assert.rejects(
          insert("portal_activities", {
            institution_id: b.id,
            asset_id: assetA.id,
            title: "Cruzada",
            kind: "inspection",
            starts_at: "2026-03-01T13:00:00Z",
          }),
          /foreign key/,
        );
        await assert.rejects(
          insert("portal_documents", {
            ...cert,
            kind: "report",
            file_path: `${b.id}/cross.pdf`,
          }),
          /check constraint/,
        );
      },
    );
    await t.test(
      "completar actividad genera una única próxima fecha respetando fin de mes",
      async () => {
        await as("admin");
        await db.query(
          "update public.portal_activities set status='completed' where id=$1",
          [training.id],
        );
        let next = (
          await db.query(
            "select * from public.portal_activities where recurrence_source_id=$1",
            [training.id],
          )
        ).rows;
        assert.equal(next.length, 1);
        assert.equal(
          new Date(next[0].starts_at).toISOString(),
          "2026-02-28T13:00:00.000Z",
        );
        assert.equal(next[0].status, "planned");
        assert.equal(next[0].completed_at, null);
        await db.query(
          "update public.portal_activities set status='planned' where id=$1",
          [training.id],
        );
        await db.query(
          "update public.portal_activities set status='completed' where id=$1",
          [training.id],
        );
        assert.equal(
          (
            await db.query(
              "select * from public.portal_activities where recurrence_source_id=$1",
              [training.id],
            )
          ).rows.length,
          1,
        );
        await assert.rejects(
          insert("portal_activities", {
            institution_id: a.id,
            title: "Sin evidencia",
            kind: "drill",
            starts_at: "2026-02-01T13:00:00Z",
            status: "completed",
          }),
          /check constraint/,
        );
      },
    );
    await t.test(
      "certificados exigen asistencia y capacitación realizada",
      async () => {
        await as("admin");
        await db.query(
          "update public.portal_participants set attendance='absent' where id=$1",
          [person.id],
        );
        await assert.rejects(
          insert("portal_documents", cert),
          /asistencia registrada/,
        );
        await db.query(
          "update public.portal_participants set attendance='attended' where id=$1",
          [person.id],
        );
        await insert("portal_documents", cert);
        await assert.rejects(
          db.query(
            "update public.portal_participants set attendance='absent' where id=$1",
            [person.id],
          ),
          /Archivá el certificado/,
        );
        await assert.rejects(
          db.query(
            "update public.portal_activities set status='planned' where id=$1",
            [training.id],
          ),
          /certificados activos/,
        );
        await assert.rejects(
          db.query("update public.portal_documents set file_path='otra.pdf'"),
          /permission denied/,
        );
      },
    );
    await t.test(
      "Storage privado: acceso exige documento registrado y la institución correcta",
      async () => {
        await as("admin");
        await db.query(
          "insert into storage.objects(bucket_id,name) values($1,$2),($1,$3)",
          ["grcp-instituciones", cert.file_path, `${a.id}/orphan.pdf`],
        );
        await as("a");
        assert.equal(
          (await db.query("select * from storage.objects")).rows.length,
          1,
        );
        await assert.rejects(
          db.query(
            "insert into storage.objects(bucket_id,name) values('grcp-instituciones','fake')",
          ),
          /row-level security/,
        );
        await as("b");
        assert.equal(
          (await db.query("select * from storage.objects")).rows.length,
          0,
        );
        await as("admin");
        assert.equal(
          (
            await db.query(
              "delete from storage.objects where name=$1 returning id",
              [cert.file_path],
            )
          ).rows.length,
          0,
        );
        assert.equal(
          (
            await db.query(
              "delete from storage.objects where name=$1 returning id",
              [`${a.id}/orphan.pdf`],
            )
          ).rows.length,
          1,
        );
        await db.query("update public.portal_documents set archived_at=now()");
        await as("a");
        assert.equal(
          (await db.query("select * from storage.objects")).rows.length,
          0,
        );
      },
    );
    await t.test(
      "revisiones conservan historial y actualizan solo el estado más reciente",
      async () => {
        await as("admin");
        await insert("portal_inspections", {
          institution_id: a.id,
          asset_id: assetA.id,
          checked_on: "2026-01-20",
          next_review_on: "2026-06-20",
          result: "fail",
          checked_by: "GRCP",
        });
        await insert("portal_inspections", {
          institution_id: a.id,
          asset_id: assetA.id,
          checked_on: "2026-01-10",
          result: "pass",
          checked_by: "GRCP",
        });
        assert.equal(
          (
            await db.query(
              "select status from public.portal_assets where id=$1",
              [assetA.id],
            )
          ).rows[0].status,
          "out_of_service",
        );
        await assert.rejects(
          db.query("update public.portal_inspections set result='pass'"),
          /permission denied/,
        );
      },
    );
    await t.test(
      "revocar miembro o pausar institución corta inmediatamente el acceso",
      async () => {
        await as("admin");
        await db.query(
          "update public.portal_memberships set active=false where id=$1",
          [ma.id],
        );
        await as("a");
        assert.equal(
          (await db.query("select * from public.portal_assets")).rows.length,
          0,
        );
        await as("admin");
        await db.query(
          "update public.portal_memberships set active=true where id=$1",
          [ma.id],
        );
        await db.query(
          "update public.portal_institutions set status='paused' where id=$1",
          [a.id],
        );
        await as("a");
        assert.equal(
          (await db.query("select * from public.portal_assets")).rows.length,
          0,
        );
        await as("admin");
        await db.query(
          "update public.portal_institutions set status='active' where id=$1",
          [a.id],
        );
      },
    );
    await t.test(
      "cuentas no confirmadas y usuarios sin asignación no tienen acceso",
      async () => {
        await as("outsider");
        assert.equal(
          (await db.query("select * from public.portal_assets")).rows.length,
          0,
        );
        await db.exec(
          `reset role; update auth.users set email_confirmed_at=null where id='${ids.a}';`,
        );
        await as("a");
        assert.equal(
          (await db.query("select * from public.portal_assets")).rows.length,
          0,
        );
        await db.exec(
          `reset role; update auth.users set email_confirmed_at=null where id='${ids.admin}';`,
        );
        await as("admin");
        assert.equal(
          (await db.query("select public.get_portal_context() c")).rows[0].c
            .is_admin,
          false,
        );
        await db.exec(
          `reset role; update auth.users set email_confirmed_at=now();`,
        );
      },
    );
    await t.test("coordenadas privadas: rangos, pares completos y edición solo GRCP", async () => {
      await as("admin");
      await db.query("update public.portal_institutions set latitude=-31.515513,longitude=-68.512981 where id=$1", [a.id]);
      await db.query("update public.portal_sites set latitude=-31.5,longitude=-68.5 where id=$1", [siteB.id]);
      await assert.rejects(db.query("update public.portal_institutions set latitude=91 where id=$1", [a.id]), /check constraint/);
      await assert.rejects(db.query("update public.portal_sites set longitude=null where id=$1", [siteB.id]), /check constraint/);
      await as("a");
      assert.equal((await db.query("select latitude from public.portal_institutions where id=$1", [a.id])).rows[0].latitude,-31.515513);
      assert.equal((await db.query("update public.portal_institutions set latitude=0,longitude=0 where id=$1 returning id", [a.id])).rows.length,0);
      assert.equal((await db.query("select * from public.portal_sites where id=$1", [siteB.id])).rows.length,0);
      await as("anon");
      await assert.rejects(db.query("select latitude,longitude from public.portal_institutions"), /permission denied/);
    });
    await t.test(
      "auditoría protegida y permiso DEA original intacto",
      async () => {
        await as("a");
        assert.equal(
          (await db.query("select * from public.portal_audit")).rows.length,
          0,
        );
        await assert.rejects(
          db.query(
            "insert into public.portal_audit(institution_id,entity,record_id,action) values($1,$2,$1,$3)",
            [a.id, "X", "INSERT"],
          ),
          /permission denied/,
        );
        assert.equal(
          (await db.query("select public.get_dea_role() role")).rows[0].role,
          null,
        );
        await as("admin");
        assert.ok(
          (await db.query("select * from public.portal_audit")).rows.length >
            10,
        );
        assert.equal(
          (await db.query("select public.get_dea_role() role")).rows[0].role,
          "admin",
        );
      },
    );
    await t.test('equipamiento admite nuevos tipos y adjuntos privados de su misma institución', async () => {
      await as('admin');
      const board = await insert('portal_assets', { institution_id: a.id, name: 'Camilla rígida', kind: 'spine_board' });
      await insert('portal_assets', { institution_id: a.id, name: 'Kit de trauma', kind: 'trauma_kit' });
      const photo = { institution_id: a.id, asset_id: board.id, title: 'Foto camilla', kind: 'photo',
        file_path: `${a.id}/camilla.jpg`, file_name: 'camilla.jpg', mime_type: 'image/jpeg', file_size: 1200 };
      await insert('portal_documents', photo);
      await assert.rejects(insert('portal_documents', { ...photo, file_path: `${a.id}/otro.jpg`, asset_id: assetB.id }), (error) => error.code === '23503');
      await assert.rejects(insert('portal_documents', { ...photo, file_path: `${a.id}/foto.pdf`, mime_type: 'application/pdf' }), (error) => error.code === '23514');
      await as('a');
      assert.equal((await db.query('select id from public.portal_documents where asset_id=$1', [board.id])).rows.length, 1);
      assert.equal((await db.query('select private.portal_file_access($1) as allowed', [photo.file_path])).rows[0].allowed, true);
      await assert.rejects(insert('portal_documents', { ...photo, file_path: `${a.id}/cliente.jpg` }), (error) => error.code === '42501');
      await as('b');
      assert.equal((await db.query('select id from public.portal_documents where asset_id=$1', [board.id])).rows.length, 0);
      assert.equal((await db.query('select private.portal_file_access($1) as allowed', [photo.file_path])).rows[0].allowed, false);
    });
    await t.test('operador GRCP trabaja con instituciones pero no administra accesos', async () => {
      await as('admin');
      const operator = await insert('portal_operators', { email: 'operator@example.com', full_name: 'Operador de prueba' });
      assert.ok((await db.query('select * from public.portal_operator_audit')).rows.length);
      await as('operator');
      const context = (await db.query('select public.get_portal_context() as c')).rows[0].c;
      assert.equal(context.is_admin, false);
      assert.equal(context.is_operator, true);
      assert.equal((await db.query('select id from public.portal_institutions')).rows.length, 2);
      const asset = await insert('portal_assets', { institution_id: b.id, name: 'Equipo de operador', kind: 'trauma_kit' });
      assert.equal(asset.institution_id, b.id);
      const filePath = `${b.id}/operator-report.pdf`;
      await db.query('insert into storage.objects(bucket_id,name) values($1,$2)', ['grcp-instituciones', filePath]);
      await insert('portal_documents', { institution_id: b.id, asset_id: asset.id, title: 'Informe del operador', kind: 'report',
        file_path: filePath, file_name: 'operator-report.pdf', mime_type: 'application/pdf', file_size: 200 });
      assert.equal((await db.query('select private.portal_file_access($1) as allowed', [filePath])).rows[0].allowed, true);
      assert.equal((await db.query('select public.get_dea_role() as role')).rows[0].role, null);
      assert.equal((await db.query('select institution_id from public.portal_usage_by_institution()')).rows.length, 2);
      await assert.rejects(db.query('select * from public.portal_operator_activity()'), /Acceso denegado/);
      assert.equal((await db.query('select id from public.portal_memberships')).rows.length, 3);
      await assert.rejects(insert('portal_memberships', { institution_id: a.id, email: 'otro@example.com' }), /row-level security/);
      await assert.rejects(insert('portal_operators', { email: 'otro@example.com' }), /row-level security/);
      assert.equal((await db.query('select id from public.portal_operators')).rows.length, 0);
      await as('admin');
      await db.query('update public.portal_operators set email=$1 where id=$2', ['outsider@example.com', operator.id]);
      await as('operator');
      assert.equal((await db.query('select public.get_portal_context() as c')).rows[0].c.is_operator, false);
      await as('outsider');
      assert.equal((await db.query('select public.get_portal_context() as c')).rows[0].c.is_operator, true);
      await as('admin');
      await db.query('update public.portal_operators set email=$1 where id=$2', ['operator@example.com', operator.id]);
      await db.query('update public.portal_operators set active=false where id=$1', [operator.id]);
      await as('operator');
      assert.equal((await db.query('select public.get_portal_context() as c')).rows[0].c.is_operator, false);
      assert.equal((await db.query('select id from public.portal_institutions')).rows.length, 0);
    });
    await t.test('perfil propio y métricas institucionales quedan separados', async () => {
      await as('a');
      await insert('portal_user_profiles', { user_id: ids.a, display_name: 'A', phone: '123' });
      await assert.rejects(insert('portal_user_profiles', { user_id: ids.b, display_name: 'B' }), /row-level security/);
      assert.equal((await db.query('select user_id from public.portal_user_profiles')).rows.length, 1);
      await db.query('select public.portal_record_module_visit($1,$2)', [a.id, 'equipamiento']);
      await db.query('select public.portal_record_module_visit($1,$2)', [a.id, 'equipamiento']);
      await assert.rejects(db.query('select public.portal_record_module_visit($1,$2)', [b.id, 'equipamiento']), /Acceso denegado/);
      await assert.rejects(db.query('select * from public.portal_usage_daily'), /permission denied/);
      await assert.rejects(db.query('select * from public.portal_usage_by_institution()'), /Acceso denegado/);
      await as('admin');
      assert.equal((await db.query('select user_id from public.portal_user_profiles')).rows.length, 0);
      const metrics = (await db.query('select * from public.portal_usage_by_institution() order by institution_id')).rows;
      assert.equal(metrics.length, 2);
      assert.ok(metrics.find((row) => row.institution_id === a.id).active_members >= 1);
      assert.ok(metrics.find((row) => row.institution_id === a.id).stored_bytes >= 100);
      assert.equal(metrics.find((row) => row.institution_id === a.id).active_users_30d, 1);
      assert.equal(metrics.find((row) => row.institution_id === a.id).module_uses_30d, 1);
      await assert.rejects(db.query('select public.portal_record_module_visit($1,$2)', [a.id, 'equipamiento']), /Acceso denegado/);
      await as('anon');
      await assert.rejects(db.query('select * from public.portal_usage_by_institution()'), /permission denied/);
    });
  } finally {
    await db.close();
  }
});
