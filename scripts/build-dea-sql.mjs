import { readFile, writeFile } from 'node:fs/promises';

const schema = await readFile(new URL('../supabase/migrations/20260930015508_dea_registry.sql', import.meta.url), 'utf8');
const records = JSON.parse(await readFile(new URL('../supabase/dea-import.json', import.meta.url), 'utf8'));
// A quoted SQL string, never interpolation of file contents into shell commands.
const literal = value => `'${String(value).replace(/[ \t]+(?=\r?\n)/g, '').replaceAll("'", "''")}'`;
const fields = ['name','latitude','longitude','address','city','province','access','availability','hours','notes','verification','verified_at','published','source','source_key'];
const rows = records.map(record => `(${fields.map(field => record[field] === null ? 'null' : typeof record[field] === 'number' || typeof record[field] === 'boolean' ? String(record[field]) : literal(record[field])).join(',')})`);
const seed = `-- Original KMZ: ${records.length} points, published with access/availability unconfirmed.\n-- Repeat-safe: existing records are never overwritten.\nbegin;\ninsert into public.dea_locations (${fields.join(',')}) values\n${rows.join(',\n')}\non conflict (source_key) do nothing;\ncommit;\nselect count(*) as total_dea, count(*) filter (where published and archived_at is null) as publicados from public.dea_locations;\n`;
await writeFile(new URL('../supabase/02-cargar-dea.sql', import.meta.url), seed);
await writeFile(new URL('../supabase/01-instalar-registro.sql', import.meta.url), `-- GRCP project: tfueuppotcanagvgxpca. Execute ONCE in Supabase SQL Editor.\n-- Does not create passwords or Auth users.\nbegin;\n${schema}\ncommit;\n`);
console.log(`SQL generated: schema + ${records.length} repeat-safe DEA records.`);
