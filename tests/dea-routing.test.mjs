import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeRouteShape, routeRequest, readFastestRoute, fetchDeaRoute, routeDuration } from '../src/lib/deaRouting.js';
import { directionsUrl } from '../src/lib/dea.js';

// Canonical encoded-polyline example, interpreted at Valhalla's 1e6 precision.
const shape = '_p~iF~ps|U_ulLnnqC_mqNvxq`@';
const origin = { latitude: -34.6037, longitude: -58.3816, accuracy: 30 };
const destination = { latitude: -34.6082, longitude: -58.3733 };
const trip = (time, length) => ({ status: 0, summary: { time, length }, legs: [{ shape, maneuvers: [{ instruction: 'Camine hacia el este.', length: .2 }] }] });

test('route geometry decodes six decimal precision and rejects broken data', () => {
  assert.deepEqual(decodeRouteShape(shape), [[3.85,-12.02],[4.07,-12.095],[4.3252,-12.6453]]);
  assert.throws(() => decodeRouteShape('_'), /incompleto/);
  assert.throws(() => decodeRouteShape(''), /válido/);
});
test('mode-specific routing uses auto or pedestrian and picks the fastest returned alternative', () => {
  assert.equal(routeRequest(origin,destination,'driving').costing,'auto');
  assert.equal(routeRequest(origin,destination,'walking').costing,'pedestrian');
  assert.equal('accuracy' in routeRequest(origin,destination,'walking').locations[0],false);
  assert.throws(() => routeRequest(origin,destination,'unknown'), /Elegí/);
  assert.throws(() => routeRequest({latitude:NaN,longitude:0},destination,'walking'), /coordenadas/);
  const result = readFastestRoute({trip:trip(900,1),alternates:[{trip:trip(600,1.5)},{trip:trip(1200,.8)}]});
  assert.equal(result.seconds,600); assert.equal(result.kilometers,1.5);
  assert.equal(result.maneuvers[0].instruction,'Camine hacia el este.');
  assert.throws(() => readFastestRoute({trip:{status:1}}), /No encontramos/);
  assert.equal(routeDuration(1),'1 min'); assert.equal(routeDuration(3660),'1 h 1 min');
  assert.equal(new URL(directionsUrl(destination,'walking',origin)).searchParams.get('origin'),'-34.6037,-58.3816');
});
test('routing request sends only coordinates, handles service failure and preserves cancellation', async () => {
  const controller = new AbortController();
  const result = await fetchDeaRoute(origin,destination,'walking',{signal:controller.signal,fetcher:async (url,options) => {
    assert.equal(options.signal,controller.signal);
    const body = JSON.parse(url.searchParams.get('json'));
    assert.equal(body.costing,'pedestrian'); assert.equal(body.locations.length,2);
    return {ok:true,json:async()=>({trip:trip(600,1)})};
  }});
  assert.equal(result.seconds,600);
  await assert.rejects(fetchDeaRoute(origin,destination,'driving',{fetcher:async()=>({ok:false,status:429})}),/ocupado/);
});
