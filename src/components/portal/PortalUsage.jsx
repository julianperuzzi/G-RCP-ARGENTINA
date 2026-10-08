import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowRight, BarChart3, RefreshCw, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../lib/portal';

function demoRows(data) {
  return data.institutions.map((institution) => {
    const own = (rows) => rows.filter((row) => row.institution_id === institution.id);
    const documents = own(data.documents);
    return {
      institution_id: institution.id,
      active_members: own(data.memberships).filter((row) => row.active).length,
      last_sign_in_at: null,
      active_users_30d: 0,
      module_uses_30d: 0,
      last_portal_visit_at: null,
      assets: own(data.assets).filter((row) => !row.archived_at).length,
      inspections: own(data.inspections).length,
      activities: own(data.activities).filter((row) => !row.archived_at).length,
      documents: documents.filter((row) => !row.archived_at).length,
      stored_bytes: documents.reduce((total, row) => total + Number(row.file_size || 0), 0),
      open_requests: own(data.requests).filter((row) => row.status !== 'resolved').length,
    };
  });
}
const fileSize = (bytes) => bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : bytes >= 1024 ? `${Math.round(bytes / 1024)} KB` : `${bytes} B`;

export default function PortalUsage({ institutions, data, demo, onOpen }) {
  const [rows, setRows] = useState(() => demo ? demoRows(data) : []);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    if (demo) { setRows(demoRows(data)); return; }
    setLoading(true); setError('');
    const { data: result, error: failure } = await supabase.rpc('portal_usage_by_institution');
    if (failure) setError('Las métricas de uso todavía no están activadas en la base de datos.');
    else setRows(result || []);
    setLoading(false);
  }, [data, demo]);
  useEffect(() => { reload(); }, [reload]);
  const names = useMemo(() => Object.fromEntries(institutions.map((row) => [row.id, row.name])), [institutions]);
  const filtered = rows.filter((row) => (names[row.institution_id] || '').toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')));
  const totals = rows.reduce((current, row) => ({
    members: current.members + Number(row.active_members), users: current.users + Number(row.active_users_30d || 0),
    uses: current.uses + Number(row.module_uses_30d || 0), documents: current.documents + Number(row.documents),
    bytes: current.bytes + Number(row.stored_bytes), requests: current.requests + Number(row.open_requests),
  }), { members: 0, users: 0, uses: 0, documents: 0, bytes: 0, requests: 0 });
  return <div className="portal-usage-page">
    <p className="portal-muted">Cada uso de módulo cuenta una vez por persona y día. El espacio incluye archivos archivados; no mide descargas, tiempo de uso ni pagos.</p>
    <div className="portal-usage-stats"><div><strong>{rows.length}</strong><span>Instituciones</span></div><div><strong>{totals.members}</strong><span>Accesos asignados</span></div><div><strong>{totals.users}</strong><span>Personas activas · 30 días</span></div><div><strong>{totals.uses}</strong><span>Usos de módulos · 30 días</span></div><div><strong>{totals.documents}</strong><span>Documentos vigentes</span></div><div><strong>{fileSize(totals.bytes)}</strong><span>Archivos almacenados</span></div><div><strong>{totals.requests}</strong><span>Solicitudes abiertas</span></div></div>
    <div className="portal-usage-toolbar"><label className="portal-search"><Search size={17} /><input aria-label="Buscar institución en métricas" placeholder="Buscar institución…" value={search} onChange={(event) => setSearch(event.target.value)} /></label><button className="portal-button" onClick={reload} disabled={loading || demo}><RefreshCw size={16} /> Actualizar</button></div>
    {error && <p className="portal-alert error" role="alert">{error}</p>}
    {loading ? <p role="status">Cargando métricas…</p> : <div className="portal-card portal-table-wrap"><table><thead><tr><th>Institución</th><th>Accesos</th><th>Uso · 30 días</th><th>Última actividad</th><th>Registros</th><th>Espacio</th><th>Solicitudes</th></tr></thead><tbody>
      {filtered.map((row) => <tr key={row.institution_id}><td className="portal-usage-institution"><button className="portal-record-link" onClick={() => onOpen(row.institution_id)}>{names[row.institution_id] || 'Institución' } <ArrowRight size={13} /></button></td><td>{row.active_members}</td><td><strong>{row.active_users_30d} {Number(row.active_users_30d) === 1 ? 'persona' : 'personas'}</strong><small>{row.module_uses_30d} usos de módulos</small></td><td>{row.last_portal_visit_at ? formatDate(row.last_portal_visit_at, true) : 'Sin uso registrado'}<small>Ingreso: {row.last_sign_in_at ? formatDate(row.last_sign_in_at, true) : 'sin registro'}</small></td><td className="portal-usage-records">{row.assets} {Number(row.assets) === 1 ? 'equipo' : 'equipos'} · {row.inspections} {Number(row.inspections) === 1 ? 'revisión' : 'revisiones'}<small>{row.activities} {Number(row.activities) === 1 ? 'actividad' : 'actividades'} · {row.documents} {Number(row.documents) === 1 ? 'documento' : 'documentos'}</small></td><td>{fileSize(Number(row.stored_bytes))}</td><td>{row.open_requests} {Number(row.open_requests) === 1 ? 'abierta' : 'abiertas'}</td></tr>)}
      {!filtered.length && <tr><td colSpan={7}>No hay instituciones que coincidan con la búsqueda.</td></tr>}
    </tbody></table></div>}
    <div className="portal-usage-note"><BarChart3 size={17} /><span>Los indicadores se calculan al abrir la pantalla y al pulsar Actualizar.</span></div>
  </div>;
}

PortalUsage.propTypes = {
  institutions: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  demo: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
};
