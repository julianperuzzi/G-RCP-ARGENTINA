import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDeaLocation } from '../src/lib/deaLocation.js';
import { nearestDea } from '../src/lib/dea.js';

test('nearest DEA excludes inaccessible, unavailable, archived, draft and invalid records', () => {
  const origin = { latitude: -31.5375, longitude: -68.5364 };
  const point = { id:'candidate', name:'DEA público', ...origin, latitude:origin.latitude+.01, availability:'unknown', access:'unknown', published:true };
  const excluded = [
    {...point,id:'restricted',latitude:origin.latitude,access:'restricted'},
    {...point,id:'unavailable',latitude:origin.latitude,availability:'unavailable'},
    {...point,id:'archived',latitude:origin.latitude,archived_at:'2026-10-06'},
    {...point,id:'draft',latitude:origin.latitude,published:false},
    {...point,id:'invalid',latitude:NaN},
  ];
  assert.equal(nearestDea([...excluded,point],origin).id,'candidate');
  assert.ok(nearestDea([point],origin).distance>1);
  assert.equal(nearestDea(excluded,origin),null);
  assert.equal(nearestDea([point],null),null);
});

test('automatic permission requests happen once and coordinates stay available across page subscribers', async () => {
  let success, calls=0;
  const store = createDeaLocation({getCurrentPosition:(ok,fail,options)=>{calls++;success=ok;assert.equal(options.timeout,15000);}});
  let notifications=0;
  const unsubscribe = store.subscribe(()=>notifications++);
  const pending=store.requestLocation({automatic:true});
  assert.equal(store.getSnapshot().locating,true);
  assert.equal(store.requestLocation({automatic:true}),pending);
  success({coords:{latitude:-31.5375,longitude:-68.5364,accuracy:25}});
  const origin=await pending;
  unsubscribe();
  assert.equal(origin.accuracy,25); assert.ok(notifications>=2);
  assert.equal((await store.requestLocation({automatic:true})).latitude,-31.5375);
  assert.equal(calls,1);
  // A new page subscribes to the same in-memory snapshot without another GPS request.
  const stop=store.subscribe(()=>{});
  assert.equal(store.getSnapshot().origin,origin); stop();
  store.clearOrigin();
  assert.equal(await store.requestLocation({automatic:true}),null);
  assert.equal(calls,1);
});

test('denial leaves a manual fallback, an explicit retry works, and stale GPS callbacks cannot restore a cleared origin', async () => {
  let success, failure;
  const store=createDeaLocation({getCurrentPosition:(ok,fail)=>{success=ok;failure=fail;}});
  const denied=store.requestLocation({automatic:true}); failure({code:1});
  assert.equal(await denied,null); assert.match(store.getSnapshot().error,/No se autorizó/);
  assert.equal(await store.requestLocation({automatic:true}),null);
  const retry=store.requestLocation();
  const staleSuccess=success;
  store.clearOrigin();
  assert.equal(await retry,null);
  staleSuccess({coords:{latitude:-31.5,longitude:-68.5,accuracy:30}});
  assert.equal(store.getSnapshot().origin,null);
  const again=store.requestLocation();
  success({coords:{latitude:-31.5,longitude:-68.5,accuracy:30}});
  assert.equal((await again).longitude,-68.5);
  assert.equal(store.getSnapshot().error,'');
});

test('missing geolocation and invalid GPS data produce usable errors', async () => {
  const missing=createDeaLocation({});
  await missing.requestLocation();
  assert.match(missing.getSnapshot().error,/No pudimos solicitar/);
  const invalid=createDeaLocation({getCurrentPosition:ok=>ok({coords:{latitude:NaN,longitude:0}})});
  assert.equal(await invalid.requestLocation(),null);
  assert.match(invalid.getSnapshot().error,/ubicación válida/);
});
