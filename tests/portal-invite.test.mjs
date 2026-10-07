import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import vm from "node:vm";

const source = stripTypeScriptTypes(
  (
    await readFile(
      new URL("../supabase/functions/grcp-invite/index.ts", import.meta.url),
      "utf8",
    )
  ).replace(/^import .*supabase.*;\r?\n/m, ""),
);
function runtime({
  user = true,
  admin = true,
  active = true,
  status = "active",
  inviteError = null,
} = {}) {
  let handler;
  const invitations = [];
  const client = {
    auth: {
      getUser: async () => ({
        data: { user: user ? { id: "verified-user" } : null },
        error: null,
      }),
      admin: {
        inviteUserByEmail: async (email, options) => {
          invitations.push({ email, options });
          return { error: inviteError };
        },
      },
    },
    rpc: async () => ({ data: { is_admin: admin }, error: null }),
    from: (table) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data:
              table === "portal_memberships"
                ? {
                    email: "member@example.com",
                    institution_id: "institution",
                    active,
                  }
                : { status, archived_at: null },
            error: null,
          }),
        }),
      }),
    }),
  };
  vm.runInNewContext(source, {
    Request,
    Response,
    URL,
    Set,
    createClient: () => client,
    Deno: {
      env: {
        get: (name) =>
          name === "GRCP_PORTAL_URL"
            ? "https://grcp-arg.com/Portal"
            : "test-only-value",
      },
      serve: (fn) => {
        handler = fn;
      },
    },
  });
  return { handler, invitations };
}
const request = (
  body = { membership_id: "11111111-1111-4111-8111-111111111111" },
  token = "verified-token",
  origin = "https://grcp-arg.com",
) =>
  new Request("https://example.supabase.co/functions/v1/grcp-invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Origin: origin,
    },
    body: JSON.stringify(body),
  });
test("función de invitación rechaza sesiones ausentes y usuarios ajenos", async () => {
  assert.equal((await runtime().handler(request({}, ""))).status, 401);
  assert.equal((await runtime({ user: false }).handler(request())).status, 401);
  const r = runtime({ admin: false });
  assert.equal((await r.handler(request())).status, 403);
  assert.equal(r.invitations.length, 0);
});
test("función valida origen, acceso e institución antes de enviar", async () => {
  assert.equal(
    (await runtime().handler(request({}, "token", "https://untrusted.example")))
      .status,
    403,
  );
  assert.equal(
    (await runtime().handler(request({ membership_id: "invalid" }))).status,
    400,
  );
  const disabled = runtime({ active: false });
  assert.equal((await disabled.handler(request())).status, 400);
  assert.equal(disabled.invitations.length, 0);
  assert.equal(
    (await runtime({ status: "paused" }).handler(request())).status,
    400,
  );
});
test("invitación usa el email asignado, con destino fijo al portal", async () => {
  const r = runtime();
  const response = await r.handler(
    request({
      membership_id: "11111111-1111-4111-8111-111111111111",
      email: "attacker@example.com",
      redirectTo: "https://untrusted.example",
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(r.invitations[0].email, "member@example.com");
  assert.equal(
    r.invitations[0].options.redirectTo,
    "https://grcp-arg.com/Portal",
  );
});
test("cuenta existente y límite de correo se informan sin exponer credenciales", async () => {
  const response = await runtime({
    inviteError: { code: "email_exists" },
  }).handler(request());
  assert.equal(response.status, 409);
  assert.match((await response.json()).message, /ya existe/);
  const limit = await runtime({ inviteError: { status: 429 } }).handler(
    request(),
  );
  assert.equal(limit.status, 400);
  assert.match((await limit.json()).message, /límite/);
});
