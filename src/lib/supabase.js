import { createClient } from '@supabase/supabase-js';
import './authLink.js';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = url && key ? createClient(url, key) : null;
export const PUBLIC_DEA_FIELDS = 'id,name,address,city,province,latitude,longitude,access,availability,hours,notes,verification,verified_at,published,source,source_key,archived_at,created_at,updated_at';
export async function fetchAllDeas({ admin = false } = {}) {
  if (!supabase) {
    if (admin) throw new Error('Supabase todavía no está conectado.');
    const response = await fetch('/data/dea-import.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('No pudimos cargar las ubicaciones importadas.');
    const snapshot = await response.json();
    return { records: snapshot.records, preview: true, importedAt: snapshot.imported_at };
  }
  const records = [];
  for (let from = 0; ; from += 1000) {
    let query = supabase.from('dea_locations').select(PUBLIC_DEA_FIELDS).order('id').range(from, from + 999);
    if (!admin) query = query.eq('published', true).is('archived_at', null);
    const { data, error } = await query;
    if (error) throw new Error('No pudimos consultar las ubicaciones. Intentá nuevamente.');
    records.push(...data);
    if (data.length < 1000) break;
  }
  return { records, preview: false };
}
