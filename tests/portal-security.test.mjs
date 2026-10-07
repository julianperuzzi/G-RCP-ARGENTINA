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
      create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      grant usage on schema auth,storage to authenticated,anon; grant execute on function auth.uid() to authenticated,anon;
      create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
      alter table storage.objects enable row level security; grant select,insert,update,delete on storage.objects to authenticated;
      insert into auth.users values ('${ids.admin}','gruporcpsa@gmail.com',now()),('${ids.a}','a@example.com',now()),
      ('${ids.b}','b@example.com',now()),('${ids.viewer}','viewer@example.com',now()),('${ids.outsider}','outsider@example.com',now());`);
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
  } finally {
    await db.close();
  }
});
