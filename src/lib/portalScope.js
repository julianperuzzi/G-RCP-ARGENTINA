export function selectedPortalInstitution(institutions, selectedId, isAdmin) {
  if (isAdmin) return institutions.find((row) => row.id === selectedId) || null;
  return institutions.find((row) => row.id === selectedId) ||
    institutions.find((row) => !row.archived_at) || institutions[0] || null;
}

export function scopedPortalData(records, institutionId, isAdmin) {
  if (!records) return null;
  return Object.fromEntries(Object.entries(records).map(([key, rows]) => [
    key,
    key === 'institutions' || key === 'accessActivity' || (isAdmin && !institutionId)
      ? rows
      : rows.filter((row) => row.institution_id === institutionId),
  ]));
}
