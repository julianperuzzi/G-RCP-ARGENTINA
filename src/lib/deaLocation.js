// Coordinates live only in memory during this visit, never in URLs or browser storage.
export function createDeaLocation(geolocation = globalThis.navigator?.geolocation) {
  let snapshot = { origin: null, locating: false, error: '' };
  let attempted = false, pending = null, version = 0, cancelPending;
  const listeners = new Set();
  const update = values => { snapshot = { ...snapshot, ...values }; listeners.forEach(listener => listener()); };
  function setOrigin(origin) {
    version++; attempted = true; cancelPending?.(); pending = null;
    update({ origin, locating: false, error: '' });
  }
  function requestLocation({ automatic = false } = {}) {
    if (pending) return pending;
    if (automatic && attempted) return Promise.resolve(snapshot.origin);
    attempted = true;
    if (!geolocation) {
      update({ error: 'Tu navegador no permite obtener la ubicación. Podés elegir un punto de partida en el mapa.' });
      return Promise.resolve(null);
    }
    update({ locating: true, error: '' });
    const requestVersion = ++version;
    const promise = new Promise(resolve => {
      cancelPending = () => resolve(null);
      const finish = (origin, error = '') => {
        if (requestVersion !== version) return;
        pending = null; cancelPending = null;
        update({ origin: origin || snapshot.origin, locating: false, error }); resolve(origin);
      };
      try {
        geolocation.getCurrentPosition(position => {
          const { latitude, longitude, accuracy } = position.coords;
          if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) { finish(null, 'No pudimos obtener una ubicación válida. Intentá nuevamente.'); return; }
          finish({ latitude, longitude, accuracy: Number.isFinite(accuracy) ? accuracy : 0 });
        }, error => {
          finish(null, error.code === 1 ? 'No se autorizó la ubicación. Podés habilitar el permiso en tu navegador o elegir un punto en el mapa.' : error.code === 3 ? 'La búsqueda de ubicación tardó demasiado. Intentá otra vez o elegí un punto en el mapa.' : 'No pudimos obtener tu ubicación. Intentá otra vez o elegí un punto en el mapa.');
        }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
      } catch { finish(null, 'No pudimos solicitar la ubicación. Podés elegir un punto de partida en el mapa.'); }
    });
    pending = snapshot.locating ? promise : null;
    return promise;
  }
  return { getSnapshot: () => snapshot, subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); }, requestLocation, setOrigin, clearOrigin: () => setOrigin(null) };
}

export const deaLocation = createDeaLocation();
