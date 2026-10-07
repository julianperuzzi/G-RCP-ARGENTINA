import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Footprints, HeartPulse, LocateFixed, MapPin, RefreshCw } from 'lucide-react';
import useDeaLocation from '../../hooks/useDeaLocation';
import { accessLabels, availabilityLabels, nearestDea } from '../../lib/dea';
import './nearest-dea.css';

export default function NearestDea() {
  const { origin, locating, error: locationError, requestLocation, clearOrigin } = useDeaLocation();
  const [records, setRecords] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState(''), [preview, setPreview] = useState(false), [retry, setRetry] = useState(0);
  const [mode, setMode] = useState('driving');
  useEffect(() => { requestLocation({ automatic: true }); }, [requestLocation]);
  useEffect(() => {
    let active = true; setLoading(true); setError('');
    // The map library stays off the home page; load only the public registry client.
    import('../../lib/supabase').then(module => module.fetchAllDeas()).then(result => { if (active) { setRecords(result.records); setPreview(result.preview); } })
      .catch(() => { if (active) setError('No pudimos consultar el registro. Reintentá o abrí el mapa de DEA.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);
  const closest = useMemo(() => nearestDea(records, origin), [records, origin]);
  const distance = closest && (closest.distance < 1 ? `${Math.round(closest.distance * 1000)} m` : `${closest.distance.toFixed(1)} km`);
  const busy = locating || (Boolean(origin) && loading);
  const detailUrl = closest ? `/MapaDEA?${new URLSearchParams({ dea: closest.id, modo: mode })}` : '/MapaDEA';
  return <section className="grcp-nearest-dea" aria-labelledby="nearest-dea-title"><div className="grcp-container grcp-nearest-grid">
    <div className="grcp-nearest-copy"><p className="grcp-eyebrow">LA RED DEA, CERCA TUYO</p><h2 id="nearest-dea-title">Saber dónde está.<br /><span>Saber cómo llegar.</span></h2><p>Permití el acceso a tu ubicación para encontrar el desfibrilador registrado más cercano y consultar el camino hasta el lugar.</p><Link to="/MapaDEA" className="grcp-nearest-map-link" onClick={() => { if (locating) clearOrigin(); }}>Explorar todos los DEA <ArrowRight size={17} aria-hidden="true" /></Link></div>
    <div className="grcp-nearest-card" aria-live="polite" aria-busy={busy}>
      <div className="grcp-nearest-card-heading"><span className="grcp-nearest-icon"><HeartPulse size={25} aria-hidden="true" /></span><p>{closest ? 'EL DEA MÁS CERCANO A TU PUNTO DE PARTIDA' : 'ENCONTRÁ UN DEA CERCA TUYO'}</p>{closest && <button className="grcp-nearest-clear" onClick={clearOrigin}>Quitar ubicación</button>}</div>
      {busy ? <div className="grcp-nearest-pending" role="status"><LocateFixed size={29} aria-hidden="true" /><h3>{locating ? 'Buscando tu ubicación…' : 'Consultando ubicaciones…'}</h3><p>{locating ? 'Si el navegador lo solicita, elegí permitir ubicación. También podés recorrer el mapa manualmente.' : 'Estamos comparando los puntos del registro.'}</p><Link className="grcp-nearest-map-link" to="/MapaDEA" onClick={clearOrigin}>Abrir mapa sin esperar <ArrowRight size={16} /></Link></div> : error ? <div className="grcp-nearest-pending"><h3>El registro no está disponible.</h3><p role="alert">{error}</p><button className="grcp-button grcp-button-secondary" onClick={() => setRetry(value => value + 1)}><RefreshCw size={17} />Reintentar</button></div> : closest ? <>
        <div className="grcp-nearest-result"><div><h3>{closest.name}</h3><p><MapPin size={16} aria-hidden="true" />{[closest.address, closest.city, closest.province].filter(Boolean).join(', ') || 'Dirección pendiente de completar'}</p></div><div className="grcp-nearest-distance"><strong>{distance}</strong><span>en línea recta</span></div></div>
        <div className="grcp-nearest-status"><span>{closest.verification === 'verified' ? 'Ubicación verificada' : 'Ubicación sin verificar'}</span><span>{accessLabels[closest.access]}</span><span>{availabilityLabels[closest.availability]}</span></div>
        <div className="grcp-nearest-travel" role="group" aria-label="Cómo llegar al DEA"><button aria-pressed={mode === 'driving'} onClick={() => setMode('driving')}><Car size={17} aria-hidden="true" />En auto</button><button aria-pressed={mode === 'walking'} onClick={() => setMode('walking')}><Footprints size={17} aria-hidden="true" />Caminando</button></div>
        <Link to={detailUrl} className="grcp-button grcp-button-primary grcp-nearest-detail">Ver más detalles y cómo llegar <ArrowRight size={18} aria-hidden="true" /></Link><p className="grcp-nearest-note">El mapa abrirá este DEA y trazará la ruta desde tu punto de partida. La distancia real del recorrido puede variar.</p>
        <div className="grcp-nearest-location-actions"><span>{origin.manual ? 'Punto de partida elegido en el mapa.' : `Ubicación aproximada · precisión de ${Math.round(origin.accuracy)} m.`}</span><button onClick={() => requestLocation()}><LocateFixed size={14} aria-hidden="true" />Actualizar ubicación</button></div>
      </> : <div className="grcp-nearest-pending"><h3>{origin ? 'No encontramos un DEA candidato.' : 'Tu ubicación es el punto de partida.'}</h3><p>{origin ? 'No hay ubicaciones candidatas en el registro. Podés consultar todos los puntos en el mapa.' : locationError || 'Elegí permitir ubicación para ver aquí el DEA más cercano. También podés elegir un punto de partida en el mapa.'}</p><button className="grcp-button grcp-button-primary" onClick={() => requestLocation()}><LocateFixed size={18} aria-hidden="true" />{locationError ? 'Volver a solicitar ubicación' : 'Permitir ubicación'}</button></div>}
      {closest && locationError && <p className="grcp-nearest-note" role="alert">{locationError}</p>}
      {preview && <p className="grcp-nearest-note">Consulta de respaldo con puntos importados; las actualizaciones del panel no aparecen en esta vista.</p>}
      <p className="grcp-nearest-caution">El acceso y la disponibilidad pueden variar. Confirmá los datos del lugar.</p>
    </div>
  </div></section>;
}
