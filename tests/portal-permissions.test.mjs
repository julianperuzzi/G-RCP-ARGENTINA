import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canWritePortal } from '../src/lib/portalPermissions.js';

test('solo GRCP administra módulos; responsables crean solicitudes de su institución', () => {
  const own = { institutionId: 'escuela-a', selectedInstitutionId: 'escuela-a' };
  for (const entity of ['institutions', 'memberships', 'sites', 'assets', 'activities', 'inspections', 'participants', 'documents', 'requests']) {
    assert.equal(canWritePortal({ isAdmin: true, role: null, entity, ...own }), true, entity);
    assert.equal(canWritePortal({ isAdmin: false, role: 'viewer', entity, ...own }), false, entity);
    if (entity !== 'requests') assert.equal(canWritePortal({ isAdmin: false, role: 'manager', entity, ...own }), false, entity);
  }
  assert.equal(canWritePortal({ isAdmin: false, role: 'manager', entity: 'requests', ...own }), true);
  assert.equal(canWritePortal({ isAdmin: false, role: 'manager', entity: 'requests', recordId: 'existing', ...own }), false);
  assert.equal(canWritePortal({ isAdmin: false, role: 'manager', entity: 'requests', institutionId: 'empresa-b', selectedInstitutionId: 'escuela-a' }), false);
});
