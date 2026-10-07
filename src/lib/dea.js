export const normalizeText = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const plainText = (value = '') => String(value).replace(/<br\s*\/?\s*>/gi, '\n').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
export function distanceKm(origin, destination) {
  const rad = value => value * Math.PI / 180;
  const deltaLat = rad(destination.latitude - origin.latitude);
  const deltaLng = rad(destination.longitude - origin.longitude);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(rad(origin.latitude)) * Math.cos(rad(destination.latitude)) * Math.sin(deltaLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}
export function nearestDea(records, origin) {
  if (!origin || !Number.isFinite(origin.latitude) || !Number.isFinite(origin.longitude)) return null;
  return records.reduce((nearest, record) => {
    if (record.published === false || record.archived_at || record.availability === 'unavailable' || record.access === 'restricted' || !Number.isFinite(record.latitude) || !Number.isFinite(record.longitude)) return nearest;
    const distance = distanceKm(origin, record);
    return !nearest || distance < nearest.distance ? { ...record, distance } : nearest;
  }, null);
}
export function directionsUrl(record, mode = 'walking', origin) {
  const params = new URLSearchParams({ api: '1', destination: `${record.latitude},${record.longitude}`, travelmode: mode });
  if (origin) params.set('origin', `${origin.latitude},${origin.longitude}`);
  return `https://www.google.com/maps/dir/?${params}`;
}
export function validateDea(record) {
  if (!record.name?.trim()) return 'Ingresá el nombre del lugar.';
  if (record.name.length > 200) return 'El nombre no puede superar 200 caracteres.';
  if (record.latitude === '' || record.longitude === '' || !Number.isFinite(Number(record.latitude)) || !Number.isFinite(Number(record.longitude))) return 'Ingresá coordenadas válidas.';
  if (Number(record.latitude) < -56 || Number(record.latitude) > -21 || Number(record.longitude) < -74 || Number(record.longitude) > -53) return 'Las coordenadas deben estar dentro del área de Argentina.';
  if (record.verification === 'verified' && !record.verified_at) return 'Indicá la fecha de verificación.';
  return '';
}
export const provinces = ['Buenos Aires', 'Ciudad Autónoma de Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'];
export const availabilityLabels = { unknown: 'Disponibilidad sin confirmar', available: 'Informado disponible', unavailable: 'Fuera de servicio' };
export const accessLabels = { unknown: 'Acceso sin confirmar', public: 'Acceso público', restricted: 'Acceso restringido' };
