import { supabase } from "./supabase";
import { PORTAL_BUCKET, validateDocument } from "./portal";

export const PORTAL_TABLES = [
  "institutions",
  "memberships",
  "sites",
  "assets",
  "activities",
  "inspections",
  "participants",
  "documents",
  "requests",
];
async function readPortalTable(key, scopeColumn, scopeValues) {
  const records = [];
  if (scopeValues && !scopeValues.length) return records;
  for (let from = 0; ; from += 1000) {
    let query = supabase.from(`portal_${key}`).select('*');
    if (scopeValues) query = scopeValues.length === 1
      ? query.eq(scopeColumn, scopeValues[0])
      : query.in(scopeColumn, scopeValues);
    const { data, error } = await query.order(key === 'audit' ? 'happened_at' : 'created_at', {
      ascending: key !== 'audit',
    }).order('id', { ascending: key !== 'audit' }).range(from, from + 999);
    if (error) throw error;
    records.push(...data);
    if (data.length < 1000) break;
  }
  return records;
}

export async function loadPortal(isAdmin, email, isOwner = isAdmin) {
  const memberships = isAdmin ? null : email
    ? (await readPortalTable('memberships', 'email', [email])).filter((row) => row.active && row.email === email)
    : [];
  const tenantIds = isAdmin ? null : [...new Set(memberships.map((row) => row.institution_id))];
  const entries = await Promise.all(
    [...PORTAL_TABLES, ...(isAdmin ? ['audit'] : [])].map(async (key) => [
      key,
      key === 'memberships' && !isAdmin ? memberships : await readPortalTable(
        key,
        key === 'institutions' ? 'id' : 'institution_id',
        key === 'audit' ? null : tenantIds,
      ),
    ]),
  );
  let accessActivity = [];
  if (isOwner) {
    const { data, error } = await supabase.rpc('portal_access_activity');
    if (error && !['PGRST202', '42883'].includes(error.code)) throw error;
    accessActivity = data || [];
  }
  return { ...Object.fromEntries(entries), accessActivity, ...(isAdmin ? {} : { audit: [] }) };
}
export async function savePortal(key, payload, id) {
  if (!PORTAL_TABLES.includes(key)) throw new Error("Entidad inválida");
  const query = id
    ? supabase.from(`portal_${key}`).update(payload).eq("id", id)
    : supabase.from(`portal_${key}`).insert(payload);
  const { data, error } = await query.select().single();
  if (error) throw error;
  return data;
}
export async function uploadPortalDocument(payload, file) {
  validateDocument(file);
  const extension = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
  }[file.type];
  const path = `${payload.institution_id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(PORTAL_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  try {
    return await savePortal("documents", {
      ...payload,
      file_path: path,
      file_name: file.name,
      mime_type: file.type,
      file_size: file.size,
    });
  } catch (saveError) {
    await supabase.storage.from(PORTAL_BUCKET).remove([path]);
    throw saveError;
  }
}
export async function getPortalDocumentBlob(document) {
  const { data, error } = await supabase.storage
    .from(PORTAL_BUCKET)
    .download(document.file_path);
  if (error) throw error;
  return data;
}

export async function downloadPortalDocument(document) {
  const data = await getPortalDocumentBlob(document);
  const url = URL.createObjectURL(data);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = document.file_name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function invitePortalMember(id) {
  const { data, error } = await supabase.functions.invoke("grcp-invite", {
    body: { membership_id: id },
  });
  if (error) {
    let message;
    try {
      message = (await error.context.json()).message;
    } catch {
      /* Función no desplegada o sin conexión. */
    }
    throw {
      portalMessage:
        message ||
        "Las invitaciones necesitan activar la función grcp-invite en Supabase. Mientras tanto, podés crear o invitar la cuenta desde Authentication → Users.",
    };
  }
  return data;
}

export async function invitePortalOperator(id) {
  const { data, error } = await supabase.functions.invoke('grcp-invite', {
    body: { operator_id: id },
  });
  if (error) {
    let message;
    try { message = (await error.context.json()).message; } catch { /* Función no disponible. */ }
    throw new Error(message || 'La invitación de operadores requiere desplegar la función grcp-invite actualizada.');
  }
  return data;
}
