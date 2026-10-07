import { test } from "node:test";
import assert from "node:assert/strict";
import { coordinatesOf, locationPayload, institutionLocations } from "../src/lib/portalLocations.js";

test("ubicaciones: no convierte vacíos en coordenadas 0,0", () => {
  for (const record of [{}, {latitude:null,longitude:null}, {latitude:"",longitude:""}, {latitude:" ",longitude:0}, {latitude:0,longitude:null}]) {
    assert.equal(coordinatesOf(record), null);
  }
  assert.deepEqual(locationPayload({latitude:"",longitude:""}), {latitude:null,longitude:null});
  assert.deepEqual(coordinatesOf({latitude:"0",longitude:"0"}), {latitude:0,longitude:0});
  assert.throws(() => locationPayload({latitude:-31,longitude:""}));
  assert.throws(() => locationPayload({latitude:91,longitude:-68}));
  assert.throws(() => locationPayload({latitude:-31,longitude:Infinity}));
});
test("mapa institucional: excluye archivos y sedes de instituciones archivadas", () => {
  const rows = institutionLocations([{id:"a",name:"A",status:"active"},{id:"b",name:"B",archived_at:"2026-01-01"}], [
    {id:"a",name:"Sede A",institution_id:"a"}, {id:"b",institution_id:"b"}, {id:"c",institution_id:"a",archived_at:"2026-01-01"},
  ]);
  assert.equal(rows.length,2);
  assert.notEqual(rows[0].mapId,rows[1].mapId);
  assert.equal(rows[1].institutionName,"A");
  assert.equal(rows[1].institutionId,"a");
});
