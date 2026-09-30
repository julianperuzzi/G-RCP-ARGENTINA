import { distanceKm } from './dea.js';
// Valhalla geometries use polyline6 (lat/lon at six decimal places).
export function decodeRouteShape(encoded) {
  if (typeof encoded !== 'string' || !encoded.length) throw new Error('La ruta no incluye un trazado válido.');
  let index = 0, latitude = 0, longitude = 0;
  const coordinates = [];
  function nextDelta() {
    let result = 0, shift = 0, byte;
    do {
      if (index >= encoded.length || shift > 30) throw new Error('El trazado de la ruta está incompleto.');
      byte = encoded.charCodeAt(index++) - 63;
      if (byte < 0 || byte > 63) throw new Error('El trazado de la ruta es inválido.');
      result |= (byte & 31) << shift; shift += 5;
    } while (byte >= 32);
    return result & 1 ? ~(result >>> 1) : result >>> 1;
  }
  while (index < encoded.length) {
    latitude += nextDelta(); longitude += nextDelta();
    if (Math.abs(latitude) > 90e6 || Math.abs(longitude) > 180e6) throw new Error('La ruta contiene coordenadas inválidas.');
    coordinates.push([latitude / 1e6, longitude / 1e6]);
  }
  if (coordinates.length < 2) throw new Error('La ruta no incluye un recorrido válido.');
  return coordinates;
}

export function routeRequest(origin, destination, mode) {
  if (!['driving', 'walking'].includes(mode)) throw new Error('Elegí auto o caminata.');
  for (const point of [origin, destination]) {
    if (!point || !Number.isFinite(point.latitude) || !Number.isFinite(point.longitude) || Math.abs(point.latitude) > 90 || Math.abs(point.longitude) > 180) throw new Error('Necesitamos coordenadas válidas para trazar la ruta.');
  }
  return {
    locations: [origin, destination].map(point => ({ lat: point.latitude, lon: point.longitude })),
    costing: mode === 'driving' ? 'auto' : 'pedestrian',
    costing_options: mode === 'driving' ? { auto: { shortest: false } } : { pedestrian: { shortest: false } },
    directions_options: { units: 'kilometers', language: 'es-ES' },
    alternates: 2,
  };
}

export function readFastestRoute(response) {
  const trips = [response.trip, ...(response.alternates || []).map(alternate => alternate.trip)]
    .filter(trip => trip?.status === 0 && Number.isFinite(trip.summary?.time) && trip.summary.time >= 0 && Number.isFinite(trip.summary?.length) && trip.legs?.length);
  if (!trips.length) throw new Error('No encontramos un recorrido para este medio de transporte.');
  const fastest = trips.sort((a, b) => a.summary.time - b.summary.time)[0];
  return {
    coordinates: fastest.legs.flatMap(leg => decodeRouteShape(leg.shape)),
    seconds: fastest.summary.time,
    kilometers: fastest.summary.length,
    maneuvers: fastest.legs.flatMap(leg => leg.maneuvers || []).map(step => ({ instruction: String(step.instruction || ''), kilometers: step.length || 0 })),
  };
}

export async function fetchDeaRoute(origin, destination, mode, { signal, endpoint = 'https://valhalla1.openstreetmap.de/route', fetcher = fetch } = {}) {
  const url = new URL(endpoint);
  url.searchParams.set('json', JSON.stringify(routeRequest(origin, destination, mode)));
  const response = await fetcher(url, { signal, referrerPolicy: 'no-referrer', headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(response.status === 429 ? 'El servicio de rutas está ocupado. Intentá nuevamente en unos minutos.' : 'No pudimos calcular la ruta. Podés abrir las indicaciones externas.');
  const route = readFastestRoute(await response.json());
  const end = route.coordinates.at(-1);
  return { ...route, destinationGap: distanceKm(destination, { latitude: end[0], longitude: end[1] }) };
}

export function routeDuration(seconds) {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60} min` : ''}`;
}
