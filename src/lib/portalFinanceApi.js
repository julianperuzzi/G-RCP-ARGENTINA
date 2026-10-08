import { supabase } from './supabase';
import { validateDocument } from './portal';
import { FINANCE_BUCKET, FINANCE_TABLES } from './portalFinance';

export async function loadFinance() {
  const entries = await Promise.all(FINANCE_TABLES.map(async (name) => {
    const rows = [];
    const pageSize = name === 'audit' ? 500 : 1000;
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase.from(`portal_finance_${name}`).select('*')
        .order(name === 'audit' ? 'happened_at' : 'created_at', { ascending: false })
        .order('id', { ascending: false })
        .range(from, from + pageSize - 1);
      if (error) throw error;
      rows.push(...data);
      if (data.length < pageSize) break;
    }
    return [name, rows];
  }));
  return Object.fromEntries(entries);
}

export async function saveFinance(name, payload, id) {
  if (!['accounts', 'obligations', 'movements'].includes(name)) throw new Error('Registro financiero inválido.');
  const query = id
    ? supabase.from(`portal_finance_${name}`).update(payload).eq('id', id)
    : supabase.from(`portal_finance_${name}`).insert(payload);
  const { data, error } = await query.select().single();
  if (error) {
    if (name === 'obligations' && id && payload.amount_cents != null && error.code === '42501') throw new Error('La edición de importes aún no está activada en la base. Aplicá la migración de importes de Tesorería.');
    throw error;
  }
  return data;
}

export async function correctFinanceMovement(id, amountCents, reason) {
  const { data, error } = await supabase.rpc('portal_finance_correct_movement', {
    p_movement_id: id, p_amount_cents: amountCents, p_reason: reason,
  });
  if (error) {
    if (['PGRST202', '42883'].includes(error.code)) throw new Error('La corrección aún no está activada en la base. Aplicá la migración de importes de Tesorería.');
    throw error;
  }
  return data;
}

export async function uploadFinanceDocument(payload, file) {
  validateDocument(file);
  const extension = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png' }[file.type];
  const path = `finance/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(FINANCE_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;
  const { error } = await supabase.from('portal_finance_documents').insert({
    ...payload, file_path: path, file_name: file.name, mime_type: file.type, file_size: file.size,
  });
  if (error) {
    await supabase.storage.from(FINANCE_BUCKET).remove([path]);
    throw error;
  }
}

export async function getFinanceDocumentBlob(document) {
  const { data, error } = await supabase.storage.from(FINANCE_BUCKET).download(document.file_path);
  if (error) throw error;
  return data;
}

export async function downloadFinanceDocument(document) {
  const data = await getFinanceDocumentBlob(document);
  const url = URL.createObjectURL(data);
  const anchor = window.document.createElement('a');
  anchor.href = url;
  anchor.download = document.file_name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
