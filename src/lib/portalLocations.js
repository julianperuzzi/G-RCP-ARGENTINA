export function coordinatesOf(record) {
  if (record.latitude == null || record.longitude == null ||
      String(record.latitude).trim() === "" || String(record.longitude).trim() === "") return null;
  const latitude = Number(record.latitude), longitude = Number(record.longitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
    ? { latitude, longitude } : null;
}

export function locationPayload(values) {
  const empty = (value) => value == null || String(value).trim() === "";
  if (empty(values.latitude) && empty(values.longitude)) return { latitude: null, longitude: null };
  const point = coordinatesOf(values);
  if (!point) throw new Error("Completá latitud y longitud válidas, o quitá ambas para dejar la ubicación pendiente.");
  return point;
}

export function institutionLocations(institutions, sites) {
  const active = institutions.filter((row) => !row.archived_at);
  const parents = new Map(active.map((row) => [row.id, row]));
  return [
    ...active.map((row) => ({ ...row, entity: "institutions", mapId: `institution-${row.id}`, institutionName: row.name, institutionId: row.id })),
    ...sites.filter((row) => !row.archived_at && parents.has(row.institution_id)).map((row) => ({
      ...row, entity: "sites", mapId: `site-${row.id}`, institutionName: parents.get(row.institution_id).name,
      institutionId: row.institution_id, status: parents.get(row.institution_id).status,
    })),
  ];
}
