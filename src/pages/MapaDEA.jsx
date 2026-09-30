import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Car, Footprints, HeartPulse, LocateFixed, MapPin, Navigation, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import DeaMap from '../components/dea/DeaMap';
import { accessLabels, availabilityLabels, directionsUrl, distanceKm, normalizeText } from '../lib/dea';
import { fetchAllDeas } from '../lib/supabase';
import { fetchDeaRoute, routeDuration } from '../lib/deaRouting';
import '../components/dea/dea.css';

export default function MapaDEA() {
  const [records, setRecords] = useState([]), [selected, setSelected] = useState(null);
  const [query, setQuery] = useState(''), [province, setProvince] = useState(''), [onlyVerified, setOnlyVerified] = useState(false);
  const [origin, setOrigin] = useState(null), [locating, setLocating] = useState(false), [geoError, setGeoError] = useState('');
  const [loading, setLoading] = useState(true), [error, setError] = useState(''), [preview, setPreview] = useState(false), [refresh, setRefresh] = useState(0), [resetKey, setResetKey] = useState(0);
  const [limit, setLimit] = useState(30), [travelMode, setTravelMode] = useState('driving');
  const [route, setRoute] = useState(null), [routeLoading, setRouteLoading] = useState(false), [routeError, setRouteError] = useState(''), [routeRetry, setRouteRetry] = useState(0);
  const [choosingOrigin, setChoosingOrigin] = useState(false);
  const originLat = origin?.latitude, originLng = origin?.longitude;
  const destinationId = selected?.id, destinationLat = selected?.latitude, destinationLng = selected?.longitude;
  useEffect(() => {
    setRoute(null); setRouteError(''); setRouteLoading(false);
    if (originLat == null || destinationId == null) return;
    const controller = new AbortController();
    let timedOut = false, active = true;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 20000);
    setRouteLoading(true);
    fetchDeaRoute({ latitude: originLat, longitude: originLng }, { latitude: destinationLat, longitude: destinationLng }, travelMode, { signal: controller.signal, endpoint: import.meta.env.VITE_ROUTING_URL || undefined })
      .then(result => { if (active && !controller.signal.aborted) setRoute(result); })
      .catch(err => { if (active && (!controller.signal.aborted || timedOut)) setRouteError(timedOut ? 'El cálculo tardó demasiado. Reintentá o abrí las indicaciones externas.' : err.message); })
      .finally(() => { clearTimeout(timeout); if (active) setRouteLoading(false); });
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [originLat, originLng, destinationId, destinationLat, destinationLng, travelMode, routeRetry]);
  useEffect(() => {
    let alive = true; setLoading(true); setError('');
    fetchAllDeas().then(result => { if (alive) { setRecords(result.records); setPreview(result.preview); } }).catch(err => { if (alive) setError(err.message); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [refresh]);
  const filtered = useMemo(() => records.filter(record => {
    const text = normalizeText(`${record.name} ${record.address} ${record.city} ${record.province}`);
    return (!query || text.includes(normalizeText(query))) && (!province || record.province === province) && (!onlyVerified || record.verification === 'verified');
  }).map(record => ({ ...record, distance: origin ? distanceKm(origin, record) : null })).sort((a, b) => origin ? a.distance - b.distance : a.name.localeCompare(b.name, 'es')), [records, query, province, onlyVerified, origin]);
  useEffect(() => { setLimit(30); }, [query, province, onlyVerified]);
  useEffect(() => { setSelected(previous => previous ? filtered.find(record => record.id === previous.id) || null : null); }, [filtered]);
  const nearest = useMemo(() => origin ? records.filter(r => r.availability !== 'unavailable' && r.access !== 'restricted').map(r => ({ ...r, distance: distanceKm(origin, r) })).sort((a,b) => a.distance-b.distance)[0] : null, [origin, records]);
  function locate() {
    setGeoError(''); setChoosingOrigin(false);
    if (!navigator.geolocation) { setGeoError('Tu navegador no admite ubicación. Buscá un lugar por nombre o dirección.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(position => {
      const nextOrigin = { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy };
      setOrigin(nextOrigin); setLocating(false);
      const closest = records.filter(r => r.availability !== 'unavailable' && r.access !== 'restricted').map(r => ({ ...r, distance: distanceKm(nextOrigin, r) })).sort((a,b) => a.distance-b.distance)[0];
      if (closest) { setSelected(closest); setQuery(''); setProvince(''); setOnlyVerified(false); }
      else setGeoError('No hay ubicaciones candidatas disponibles en el registro.');
    }, err => { setLocating(false); setGeoError(err.code === 1 ? 'No se autorizó la ubicación. Podés buscar manualmente o habilitar el permiso en tu navegador.' : 'No pudimos obtener tu ubicación. Intentá de nuevo o buscá manualmente.'); }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  }
  function pickOrigin(point) {
    setOrigin({ ...point, accuracy: 0, manual: true }); setChoosingOrigin(false); setGeoError('');
    const closest = records.filter(r => r.availability !== 'unavailable' && r.access !== 'restricted').map(r => ({ ...r, distance: distanceKm(point, r) })).sort((a,b) => a.distance-b.distance)[0];
    if (closest && !selected) { setSelected(closest); setQuery(''); setProvince(''); setOnlyVerified(false); }
  }
  const selectedDistance = origin && selected ? distanceKm(origin, selected) : null;
  const formatDistance = value => value < 1 ? `${Math.round(value * 1000)} m` : `${value.toFixed(1)} km`;
  return <div className="dea-page">
    <section className="dea-page-heading grcp-container"><div><p className="grcp-eyebrow">UNA RED PARA CUIDARNOS</p><h1>Encontrá un <span>DEA.</span></h1><p>Consultá las ubicaciones registradas de desfibriladores en Argentina y las indicaciones para llegar.</p></div><Link to="/PanelDEA" className="grcp-button grcp-button-secondary"><ShieldCheck size={17} />Acceso de gestión <ArrowUpRight size={16} /></Link></section>
    <div className="grcp-container">
      {preview && <p className="dea-notice" role="status">Vista de respaldo con las 437 ubicaciones del KMZ. La conexión a Supabase no está configurada en este entorno; esta vista no refleja las actualizaciones del panel.</p>}
      <div className="dea-emergency-note"><HeartPulse size={20} aria-hidden="true" /><p><strong>El mapa es una herramienta de consulta.</strong> La ubicación registrada no garantiza acceso ni disponibilidad. En una emergencia, contactá al servicio de emergencias de tu localidad.</p></div>
      <div className="dea-map-toolbar"><div className="dea-travel-modes" role="group" aria-label="Medio de transporte para la ruta"><button aria-pressed={travelMode === 'driving'} onClick={() => setTravelMode('driving')}><Car size={18} />En auto</button><button aria-pressed={travelMode === 'walking'} onClick={() => setTravelMode('walking')}><Footprints size={18} />Caminando</button></div><button className="grcp-button grcp-button-primary" disabled={locating || loading || !records.length} onClick={locate}><LocateFixed size={18} />{locating ? 'Buscando tu ubicación…' : 'Ubicar DEA y trazar ruta'}</button><button className="dea-text-button" onClick={() => { setSelected(null); setQuery(''); setProvince(''); setOnlyVerified(false); setResetKey(key => key + 1); }}>Ver todas las ubicaciones</button><p className="dea-route-privacy">Al trazar una ruta, tu ubicación y el destino se envían al servicio de rutas de OpenStreetMap / FOSSGIS. GRCP no guarda tu ubicación.</p></div>
      {geoError && <p className="dea-error" role="alert">{geoError}</p>}
      <div className="dea-origin-choice"><button className="dea-text-button" aria-pressed={choosingOrigin} disabled={locating || loading} onClick={() => setChoosingOrigin(value => !value)}><MapPin size={16} />{choosingOrigin ? 'Cancelar elección del punto de partida' : 'Elegir punto de partida en el mapa'}</button>{choosingOrigin && <p role="status">Tocá un punto del mapa para usarlo como origen de la ruta.</p>}</div>
      {origin && <p className="dea-location-info">{origin.manual ? 'Punto de partida elegido en el mapa.' : `Ubicación aproximada: precisión de ${Math.round(origin.accuracy)} m.`} Ordenamos por distancia en línea recta; el recorrido real puede variar.{nearest && ` Candidato más cercano: ${nearest.name} (${formatDistance(nearest.distance)}).`}<button className="dea-text-button" onClick={() => { setOrigin(null); setSelected(null); setChoosingOrigin(false); }}>Quitar punto de partida</button></p>}
      {error ? <div className="dea-empty" role="alert"><p>{error}</p><button className="grcp-button grcp-button-secondary" onClick={() => setRefresh(value => value+1)}><RefreshCw size={17} />Reintentar</button></div> : <div className="dea-explorer">
        <aside className="dea-search-panel" aria-label="Buscar ubicaciones"><div className="dea-search-controls"><label className="dea-search-field"><Search size={18} aria-hidden="true" /><input aria-label="Buscar DEA por nombre, localidad o dirección" placeholder="Lugar, localidad o dirección" value={query} onChange={e => setQuery(e.target.value)} /></label>
          <label className="dea-field"><span>Provincia</span><select value={province} onChange={e => setProvince(e.target.value)}><option value="">Todas las provincias</option>{[...new Set(records.map(r => r.province).filter(Boolean))].sort().map(name => <option key={name}>{name}</option>)}</select></label>
          <label className="dea-checkbox"><input type="checkbox" checked={onlyVerified} onChange={e => setOnlyVerified(e.target.checked)} />Solo ubicaciones verificadas</label>
          <p className="dea-result-count" aria-live="polite">{loading ? 'Cargando ubicaciones…' : `${filtered.length} ${filtered.length === 1 ? 'ubicación registrada' : 'ubicaciones registradas'}`}</p></div>
          <div className="dea-results">{filtered.slice(0,limit).map(record => <button key={record.id} className={`dea-result ${selected?.id === record.id ? 'is-selected' : ''}`} onClick={() => setSelected(record)}><span className="dea-result-icon"><HeartPulse size={18} /></span><span><strong>{record.name}</strong><small>{record.address || record.city || 'Dirección pendiente de completar'}</small><small className="dea-result-meta">{record.verification === 'verified' ? 'Verificado' : 'Sin verificar'}{record.distance !== null && ` · ${formatDistance(record.distance)}`}</small></span></button>)}{!loading && !filtered.length && <div className="dea-empty"><p>No hay ubicaciones para esta búsqueda.</p><button className="dea-text-button" onClick={() => { setQuery(''); setProvince(''); setOnlyVerified(false); }}>Limpiar filtros</button></div>}{filtered.length > limit && <button className="dea-load-more" onClick={() => setLimit(value => value+30)}>Mostrar más ubicaciones</button>}</div>
        </aside>
        <div className="dea-map-column"><DeaMap records={filtered} selected={selected} onSelect={choosingOrigin ? undefined : setSelected} origin={origin} route={route} onPick={choosingOrigin ? pickOrigin : undefined} resetKey={resetKey} />
          {selected && origin && <section className="dea-route-card" aria-label="Ruta al DEA seleccionado" aria-live="polite">{routeLoading ? <p role="status"><RefreshCw size={18} className="dea-route-spinner" />Calculando el recorrido {travelMode === 'driving' ? 'en auto' : 'caminando'}…</p> : routeError ? <div><p className="dea-error" role="alert">{routeError}</p><button className="dea-text-button" onClick={() => setRouteRetry(value => value + 1)}>Reintentar cálculo</button></div> : route && <><div className="dea-route-summary"><span className="dea-route-mode-icon">{travelMode === 'driving' ? <Car size={23} /> : <Footprints size={23} />}</span><div><p>Ruta más rápida estimada · {travelMode === 'driving' ? 'En auto' : 'Caminando'}</p><strong>{routeDuration(route.seconds)} <span>· {formatDistance(route.kilometers)}</span></strong></div><a className="grcp-button grcp-button-secondary" href={directionsUrl(selected,travelMode,origin)} target="_blank" rel="noopener noreferrer">Abrir navegación <ArrowUpRight size={16} /></a></div><small>Comparación entre los recorridos calculados. Sin tráfico en vivo; tiempo y acceso sujetos a las condiciones del lugar.</small>{route.destinationGap > .05 && <p className="dea-route-access-note">La vía calculada termina a {formatDistance(route.destinationGap)} del punto registrado. Confirmá el acceso al lugar; el último tramo no está cubierto por esta ruta.</p>}<details className="dea-route-steps"><summary>Ver indicaciones paso a paso</summary><ol>{route.maneuvers.map((step,index) => <li key={index}><span>{step.instruction}</span>{step.kilometers > 0 && <small>{formatDistance(step.kilometers)}</small>}</li>)}</ol></details></>}</section>}
          {selected ? <section className="dea-selected" aria-labelledby="selected-dea-title"><div className="dea-selected-heading"><MapPin size={22} /><div><h2 id="selected-dea-title">{selected.name}</h2><p>{[selected.address, selected.city, selected.province].filter(Boolean).join(', ') || 'Dirección no informada en el registro de origen.'}</p></div><button className="dea-text-button" onClick={() => setSelected(null)} aria-label="Cerrar detalle del DEA">Cerrar</button></div><div className="dea-status-row"><span>{availabilityLabels[selected.availability]}</span><span>{accessLabels[selected.access]}</span><span>{selected.verification === 'verified' ? `Verificado el ${new Date(`${selected.verified_at}T12:00:00`).toLocaleDateString('es-AR')}` : 'Ubicación sin verificar'}</span></div>{selected.hours && <p><strong>Horario / acceso:</strong> {selected.hours}</p>}{selected.notes && <p className="dea-place-notes">{selected.notes}</p>}{selectedDistance !== null && <p>Distancia en línea recta: <strong>{formatDistance(selectedDistance)}</strong>.</p>}<div className="dea-directions"><label className="dea-field"><span>Cómo llegar</span><select value={travelMode} onChange={e => setTravelMode(e.target.value)}><option value="walking">A pie</option><option value="driving">En auto</option></select></label><a href={directionsUrl(selected, travelMode, origin)} target="_blank" rel="noopener noreferrer" className="grcp-button grcp-button-primary"><Navigation size={17} />Abrir indicaciones <ArrowUpRight size={16} /></a><small>Abre Google Maps para continuar la navegación. Si compartiste tu ubicación, se incluye como punto de partida.</small></div></section> : <div className="dea-map-hint"><MapPin size={18} />Elegí un punto del mapa o un lugar de la lista para consultar sus datos y cómo llegar.</div>}
        </div>
      </div>}
      <div className="dea-map-footer"><p>Registro en construcción. Los datos importados se muestran sin verificación hasta que GRCP los revise; el mapa no representa todos los DEA existentes en el país.</p><Link to="/Contacto">Informar una ubicación o corrección <ArrowUpRight size={15} /></Link></div>
    </div>
  </div>;
}
