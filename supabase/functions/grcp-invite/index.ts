// Deploy only in tfueuppotcanagvgxpca. Service key stays in the Supabase runtime.
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

const portalUrl =
  Deno.env.get("GRCP_PORTAL_URL") || "https://grcp-arg.com/Portal";
const allowedOrigins = new Set([
  new URL(portalUrl).origin,
  "http://localhost:3001",
  "http://127.0.0.1:3001",
]);
Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin") || "";
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigins.has(origin)
      ? origin
      : new URL(portalUrl).origin,
    "Access-Control-Allow-Headers":
      "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
  const respond = (body: object, status = 200) =>
    new Response(JSON.stringify(body), { status, headers });
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers });
  if (request.method !== "POST")
    return respond({ message: "Método no permitido" }, 405);
  if (origin && !allowedOrigins.has(origin))
    return respond({ message: "Origen no autorizado" }, 403);
  const token = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");
  if (!token) return respond({ message: "Ingresá con la cuenta GRCP." }, 401);
  const url = Deno.env.get("SUPABASE_URL")!;
  const client = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser(token);
  if (authError || !user)
    return respond({ message: "La sesión no es válida." }, 401);
  const { data: context, error: contextError } =
    await client.rpc("get_portal_context");
  if (contextError || !context?.is_admin)
    return respond({ message: "Solo GRCP puede invitar usuarios." }, 403);
  let body: { membership_id?: string };
  try {
    body = await request.json();
  } catch {
    return respond({ message: "Solicitud inválida." }, 400);
  }
  if (
    !body.membership_id ||
    !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(body.membership_id)
  )
    return respond({ message: "Seleccioná un acceso válido." }, 400);
  const { data: membership, error } = await client
    .from("portal_memberships")
    .select("email,active,institution_id")
    .eq("id", body.membership_id)
    .single();
  if (error || !membership?.active)
    return respond(
      { message: "El acceso no existe o está deshabilitado." },
      400,
    );
  const { data: institution } = await client
    .from("portal_institutions")
    .select("status,archived_at")
    .eq("id", membership.institution_id)
    .single();
  if (
    !institution ||
    institution.status !== "active" ||
    institution.archived_at
  )
    return respond({ message: "La institución debe estar activa." }, 400);
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    membership.email,
    { redirectTo: portalUrl },
  );
  if (inviteError) {
    if (
      ["email_exists", "user_already_exists"].includes(inviteError.code || "")
    )
      return respond(
        {
          message:
            "La cuenta ya existe. Puede ingresar o recuperar su contraseña desde el portal.",
        },
        409,
      );
    return respond(
      {
        message:
          inviteError.status === 429
            ? "Se alcanzó el límite de correos. Esperá unos minutos."
            : "No se pudo enviar la invitación. Revisá la configuración de correo en Supabase.",
      },
      400,
    );
  }
  return respond({
    message:
      "Invitación enviada. La persona podrá elegir su contraseña desde el enlace.",
  });
});
