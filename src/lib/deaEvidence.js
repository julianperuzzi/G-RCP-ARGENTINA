import { supabase } from './supabase';
import { validateDocument } from './portal';

const BUCKET = 'grcp-dea-verification';

export async function loadDeaEvidence() {
  const records = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('dea_verification_documents').select('*')
      .order('created_at', { ascending: false }).range(from, from + 999);
    if (error) {
      if (['42P01', 'PGRST205'].includes(error.code)) return { records: [], available: false };
      throw error;
    }
    records.push(...data);
    if (data.length < 1000) break;
  }
  return { records, available: true };
}

export async function uploadDeaEvidence(dea, file) {
  validateDocument(file);
  const extension = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png' }[file.type];
  const path = `verification/${dea.id}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;
  const { data, error } = await supabase.from('dea_verification_documents').insert({
    dea_id: dea.id, title: file.name.slice(0, 200), file_path: path,
    file_name: file.name, mime_type: file.type, file_size: file.size,
  }).select().single();
  if (error) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw error;
  }
  return data;
}

export async function getDeaEvidenceBlob(document) {
  const { data, error } = await supabase.storage.from(BUCKET).download(document.file_path);
  if (error) throw error;
  return data;
}

export async function downloadDeaEvidence(document) {
  const blob = await getDeaEvidenceBlob(document);
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = document.file_name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
