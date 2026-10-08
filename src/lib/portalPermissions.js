export function canWritePortal({ isAdmin, role, entity, recordId, institutionId, selectedInstitutionId }) {
  if (isAdmin) return true;
  return role === 'manager' && entity === 'requests' && !recordId &&
    Boolean(selectedInstitutionId) && institutionId === selectedInstitutionId;
}
