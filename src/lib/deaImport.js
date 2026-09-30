import { XMLParser } from 'fast-xml-parser';
import { unzipSync, strFromU8 } from 'fflate';

import { normalizeText, plainText } from './dea.js';
export function parseDeaFile(bytes, filename) {
  if (bytes.length > 10 * 1024 * 1024) throw new Error('El archivo supera el límite de 10 MB.');
  let xml;
  if (/\.kmz$/i.test(filename)) {
    // Bound decompression before extracting to protect against oversized archives.
    let total = 0;
    const entries = unzipSync(bytes, { filter: entry => {
      if (!/\.kml$/i.test(entry.name)) return false;
      total += entry.originalSize;
      if (total > 20 * 1024 * 1024) throw new Error('El KML descomprimido supera el límite de 20 MB.');
      return true;
    }});
    const key = Object.keys(entries).find(name => /(^|\/)doc\.kml$/i.test(name)) || Object.keys(entries)[0];
    if (!key) throw new Error('El KMZ no contiene un archivo KML.');
    xml = strFromU8(entries[key]);
  } else if (/\.kml$/i.test(filename)) xml = strFromU8(bytes);
  else throw new Error('Seleccioná un archivo KMZ o KML.');
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('El archivo contiene declaraciones XML no permitidas.');
  const tree = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true, parseTagValue: false }).parse(xml);
  const placemarks = [];
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    for (const [key, value] of Object.entries(node)) {
      if (key === 'Placemark') placemarks.push(...(Array.isArray(value) ? value : [value]));
      else if (Array.isArray(value)) value.forEach(visit);
      else visit(value);
    }
  }
  visit(tree);
  const rejected = [], records = [], seen = new Set();
  for (const [index, place] of placemarks.entries()) {
    const name = plainText(place.name || `DEA ${index + 1}`).slice(0, 200);
    const coord = String(place.Point?.coordinates || '').trim().split(',');
    const longitude = Number(coord[0]), latitude = Number(coord[1]);
    if (coord.length < 2 || !Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -56 || latitude > -21 || longitude < -74 || longitude > -53) {
      rejected.push({ name, reason: 'Coordenadas ausentes o fuera del área de Argentina.' }); continue;
    }
    const source_key = `${normalizeText(name)}|${latitude.toFixed(6)}|${longitude.toFixed(6)}`;
    if (seen.has(source_key)) { rejected.push({ name, reason: 'Registro duplicado dentro del archivo.' }); continue; }
    seen.add(source_key);
    records.push({ name, latitude, longitude, address: '', city: '', province: '', access: 'unknown', availability: 'unknown', hours: '', notes: plainText(place.description || '').slice(0, 3000), verification: 'unverified', verified_at: null, published: true, source: 'Importación KMZ / KML', source_key });
  }
  if (!records.length) throw new Error('No se encontraron puntos DEA válidos dentro del área de Argentina.');
  return { records, rejected, total: placemarks.length };
}
