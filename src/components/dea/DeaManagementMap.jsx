import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Archive, Eye, FileText, History, Link2, LocateFixed, MapPin, Pencil, Plus, Upload } from 'lucide-react';
import DeaMap from './DeaMap';
import { validateDea } from '../../lib/dea';

export default function DeaManagementMap({ records, evidence = [], evidenceAvailable = false, loading, busy, onCreate, onEdit, onHistory, onArchive, onRestore, onUploadEvidence, onPreviewEvidence }) {
  const [params, setParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState(null);
  const [copyMessage, setCopyMessage] = useState('Copiar enlace');
  const [resetKey, setResetKey] = useState(0);
  const [pickError, setPickError] = useState('');
  const [confirmArchive, setConfirmArchive] = useState(false);
  const selected = records.find(record => record.id === selectedId) || null;
  const linkedId = params.get('dea');
  useEffect(() => { setSelectedId(linkedId && records.some((record) => record.id === linkedId) ? linkedId : null); }, [linkedId, records]);

  function selectRecord(record) {
    setSelectedId(record?.id || null);
    setConfirmArchive(false);
    setPickError('');
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (record) next.set('dea', record.id); else next.delete('dea');
      return next;
    });
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(window.location.href); setCopyMessage('Enlace copiado'); }
    catch { setCopyMessage('No se pudo copiar'); }
  }

  function pickPoint(coordinates) {
    if (busy || loading) return;
    const error = validateDea({ name: 'DEA', ...coordinates });
    if (error) { setPickError(error); return; }
    setPickError('');
    onCreate(coordinates);
  }

  return <section className="dea-management-map" aria-label="Mapa de gestión de DEA">
    <div className="dea-management-map-heading">
      <div><h2>Ubicaciones en el mapa</h2><p>Seleccioná un marcador para revisar o editar un DEA. Tocá un espacio libre para añadir uno nuevo en esa ubicación.</p><div className="dea-management-map-legend"><span><i className="is-published" /> Publicado</span><span><i className="is-draft" /> Borrador</span><span><i className="is-archived" /> Archivado</span></div></div>
      <button type="button" className="dea-map-reset" onClick={() => { selectRecord(null); setResetKey(value => value + 1); }} disabled={!records.length}><LocateFixed size={16} /> Ver todos</button>
    </div>
    {pickError && <p className="dea-error" role="alert">{pickError}</p>}
    <div className="dea-management-map-layout">
      <DeaMap records={records} selected={selected} onSelect={selectRecord} onPick={pickPoint} resetKey={resetKey} management />
      <div className="dea-management-map-sidebar">
        {selected && <article className="dea-management-map-selected">
          <span className={`dea-badge ${selected.published && !selected.archived_at ? 'is-published' : ''}`}>{selected.archived_at ? 'Archivado' : selected.published ? 'Publicado' : 'Borrador'}</span>
          <h3>{selected.name}</h3>
          <p>{[selected.address, selected.city, selected.province].filter(Boolean).join(', ') || 'Dirección pendiente'}</p>
          <small>{selected.latitude.toFixed(5)}, {selected.longitude.toFixed(5)}</small>
          <p>{selected.verification === 'verified' ? `Verificado${selected.verified_at ? ` el ${selected.verified_at}` : ''}` : 'Sin verificar'}</p>
          <button type="button" className="dea-text-button" onClick={copyLink}><Link2 size={15} /> {copyMessage}</button>
          <div className="dea-evidence-panel"><strong>Evidencia de verificación</strong>{evidence.filter((document) => document.dea_id === selected.id && !document.archived_at).map((document) => <button type="button" key={document.id} onClick={() => onPreviewEvidence(document)}><FileText size={16} /><span>{document.file_name}</span><Eye size={15} /></button>)}{!evidence.some((document) => document.dea_id === selected.id && !document.archived_at) && <small>Sin archivos adjuntos.</small>}{evidenceAvailable && !selected.archived_at ? <label className="dea-evidence-upload"><Upload size={15} /> Adjuntar PDF o foto<input type="file" accept=".pdf,.jpg,.jpeg,.png" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) onUploadEvidence(selected,file); event.target.value = ''; }} /></label> : !evidenceAvailable ? <small>La evidencia estará disponible al instalar la migración del portal.</small> : null}</div>
          <div className="dea-management-map-actions">
            {selected.archived_at ? <button type="button" className="grcp-button grcp-button-primary" disabled={busy} onClick={() => onRestore(selected)}>Restaurar como borrador</button> : <button type="button" className="grcp-button grcp-button-primary" disabled={busy} onClick={() => onEdit(selected)}><Pencil size={16} /> Editar DEA</button>}
            {!selected.archived_at && <button type="button" className="dea-text-button" disabled={busy} onClick={() => setConfirmArchive(true)}><Archive size={16} /> Archivar</button>}
            <button type="button" className="dea-text-button" onClick={() => onHistory(selected)}><History size={16} /> Historial</button>
          </div>
          {confirmArchive && !selected.archived_at && <div className="dea-management-map-confirm" role="alert"><p>¿Archivar {selected.name}? Se retirará del mapa público.</p><div><button type="button" className="grcp-button grcp-button-primary" disabled={busy} onClick={() => { setConfirmArchive(false); onArchive(selected); }}>Confirmar</button><button type="button" className="grcp-button grcp-button-secondary" disabled={busy} onClick={() => setConfirmArchive(false)}>Cancelar</button></div></div>}
        </article>}
        <div className="dea-management-map-list-heading"><strong>{records.length} ubicaciones</strong><span>Elegí una para centrar el mapa</span></div>
        <div className="dea-management-map-list">
          {loading && <p className="dea-empty" role="status">Cargando ubicaciones…</p>}
          {!loading && records.length === 0 && <p className="dea-empty">No hay ubicaciones para este filtro.</p>}
          {records.map(record => <button type="button" key={record.id} className={selectedId === record.id ? 'is-selected' : ''} aria-pressed={selectedId === record.id} onClick={() => selectRecord(record)}>
            <MapPin size={16} aria-hidden="true" /><span><strong>{record.name}</strong><small>{[record.city, record.province].filter(Boolean).join(', ') || 'Localidad pendiente'} · {record.archived_at ? 'Archivado' : record.published ? 'Publicado' : 'Borrador'}</small></span>
          </button>)}
        </div>
        <button type="button" className="dea-management-map-new" disabled={busy} onClick={() => onCreate(null)}><Plus size={16} /> Nuevo DEA sin seleccionar punto</button>
      </div>
    </div>
  </section>;
}

DeaManagementMap.propTypes = {
  records: PropTypes.arrayOf(PropTypes.object).isRequired,
  evidence: PropTypes.arrayOf(PropTypes.object),
  evidenceAvailable: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  busy: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onHistory: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
  onUploadEvidence: PropTypes.func,
  onPreviewEvidence: PropTypes.func,
};
