import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectedPortalInstitution, scopedPortalData } from '../src/lib/portalScope.js';

test('GRCP comienza en vista general y puede filtrar por institución', () => {
  const institutions = [{ id: 'disei', name: 'DISEI' }, { id: 'otra', name: 'Otra' }];
  const records = {
    institutions,
    sites: [{ id: 's1', institution_id: 'disei' }, { id: 's2', institution_id: 'otra' }],
    audit: [{ id: 'a1', institution_id: 'disei' }, { id: 'a2', institution_id: 'otra' }],
  };
  assert.equal(selectedPortalInstitution(institutions, '', true), null);
  assert.equal(selectedPortalInstitution(institutions, 'otra', true)?.name, 'Otra');
  assert.deepEqual(scopedPortalData(records, null, true).sites.map((row) => row.id), ['s1', 's2']);
  assert.deepEqual(scopedPortalData(records, 'otra', true).sites.map((row) => row.id), ['s2']);
  assert.deepEqual(scopedPortalData(records, 'otra', true).audit.map((row) => row.id), ['a2']);
});

test('la cuenta institucional sigue limitada a sus instituciones autorizadas', () => {
  const institutions = [{ id: 'propia', name: 'Propia' }];
  assert.equal(selectedPortalInstitution(institutions, '', false)?.id, 'propia');
  const records = { institutions, sites: [{ id: 's1', institution_id: 'propia' }, { id: 's2', institution_id: 'ajena' }] };
  assert.deepEqual(scopedPortalData(records, 'propia', false).sites.map((row) => row.id), ['s1']);
});
