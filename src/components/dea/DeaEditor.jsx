import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MapPin, Save, X } from 'lucide-react';
import DeaMap from './DeaMap';
import UnsavedChangesPrompt from '../portal/UnsavedChangesPrompt';
import useUnsavedForm from '../../hooks/useUnsavedForm';
import { accessLabels, availabilityLabels, potentialDeaDuplicates, provinces, validateDea } from '../../lib/dea';

const blank = { name: '', address: '', city: '', province: '', latitude: '', longitude: '', access: 'unknown', availability: 'unknown', hours: '', notes: '', verification: 'unverified', verified_at: '', published: false, source: 'Registro del equipo GRCP' };
export default function DeaEditor({ record, initialCoordinates, records = [], onClose, onSave }) {
  const [form, setForm] = useState({ ...blank, ...initialCoordinates, ...record, verified_at: record?.verified_at || '' });
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const unsaved = useUnsavedForm(form, null, busy, onClose);
  const dialogRef = useRef(null);
  useEffect(() => { dialogRef.current.showModal(); }, []);
  const change = (name, value) => setForm(previous => ({ ...previous, [name]: value }));
  const pin = form.latitude !== '' && form.longitude !== '' && !validateDea({ ...form, name: 'Pin', verification: 'unverified' }) ? { ...form, id: 'editing', latitude: Number(form.latitude), longitude: Number(form.longitude) } : null;
  const possibleDuplicates = potentialDeaDuplicates(records, form, record?.id);
  async function submit(event) {
    event.preventDefault();
    const validation = validateDea(form); if (validation) { setError(validation); return; }
    setBusy(true); setError('');
    const payload = Object.fromEntries(Object.keys(blank).map(key => [key, form[key]]));
    payload.name = payload.name.trim(); payload.latitude = Number(payload.latitude); payload.longitude = Number(payload.longitude);
    payload.verified_at = payload.verification === 'verified' ? payload.verified_at : null;
    try { await onSave(payload, record); unsaved.closeAfterSave(); } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return <dialog ref={dialogRef} className="dea-editor-dialog" aria-labelledby="editor-title" onCancel={event => { event.preventDefault(); if (unsaved.confirmDiscard) unsaved.setConfirmDiscard(false); else unsaved.requestClose(); }}>
    <div className="dea-dialog-heading"><div><p className="grcp-eyebrow">REGISTRO GRCP</p><h2 id="editor-title">{record ? 'Editar ubicación' : 'Nueva ubicación DEA'}</h2></div><button type="button" className="dea-icon-button" disabled={busy} onClick={unsaved.requestClose} aria-label="Cerrar editor"><X /></button></div>
    <form onSubmit={submit}><fieldset disabled={busy} className="dea-editor-fieldset"><div className="dea-form-grid">
      <label className="dea-field dea-span-two"><span>Nombre del lugar *</span><input autoFocus required maxLength={200} value={form.name} onChange={e => change('name', e.target.value)} /></label>
      <label className="dea-field dea-span-two"><span>Dirección</span><input maxLength={300} value={form.address} onChange={e => change('address', e.target.value)} /></label>
      <label className="dea-field"><span>Localidad</span><input maxLength={100} value={form.city} onChange={e => change('city', e.target.value)} /></label>
      <label className="dea-field"><span>Provincia</span><select value={form.province} onChange={e => change('province', e.target.value)}><option value="">Sin completar</option>{provinces.map(name => <option key={name}>{name}</option>)}</select></label>
      <label className="dea-field"><span>Latitud *</span><input type="number" step="any" min="-56" max="-21" required value={form.latitude} onChange={e => change('latitude', e.target.value)} /></label>
      <label className="dea-field"><span>Longitud *</span><input type="number" step="any" min="-74" max="-53" required value={form.longitude} onChange={e => change('longitude', e.target.value)} /></label>
    </div>{possibleDuplicates.length > 0 && <div className="dea-duplicate-warning" role="status"><strong>Posible ubicación duplicada</strong><p>Hay {possibleDuplicates.length} {possibleDuplicates.length === 1 ? 'registro cercano o coincidente' : 'registros cercanos o coincidentes'}. Revisalos antes de guardar:</p><ul>{possibleDuplicates.map((row) => <li key={row.id}>{row.name} · {[row.address, row.city].filter(Boolean).join(', ')} · {Math.round(row.duplicateDistanceKm * 1000)} m</li>)}</ul></div>}<p className="dea-editor-map-note"><MapPin size={16} />Podés completar las coordenadas haciendo clic en el mapa.</p><div className="dea-editor-map"><DeaMap records={pin ? [pin] : []} selected={pin} onPick={coords => setForm(previous => ({ ...previous, ...coords }))} /></div>
    <div className="dea-form-grid">
      <label className="dea-field"><span>Disponibilidad informada</span><select value={form.availability} onChange={e => change('availability',e.target.value)}>{Object.entries(availabilityLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="dea-field"><span>Acceso</span><select value={form.access} onChange={e => change('access',e.target.value)}>{Object.entries(accessLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="dea-field dea-span-two"><span>Horarios e instrucciones de acceso</span><input maxLength={300} value={form.hours} onChange={e => change('hours',e.target.value)} placeholder="Ej.: solicitar al personal de recepción" /></label>
      <label className="dea-field"><span>Verificación de la ubicación</span><select value={form.verification} onChange={e => change('verification',e.target.value)}><option value="unverified">Sin verificar</option><option value="verified">Verificado por GRCP</option></select></label>
      <label className="dea-field"><span>Fecha de verificación {form.verification === 'verified' ? '*' : ''}</span><input type="date" disabled={form.verification !== 'verified'} required={form.verification === 'verified'} max={new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())} value={form.verified_at} onChange={e => change('verified_at',e.target.value)} /></label>
      <label className="dea-field dea-span-two"><span>Notas públicas</span><textarea rows={3} maxLength={3000} value={form.notes} onChange={e => change('notes',e.target.value)} /><small>Esta información será visible en el mapa. Evitá datos personales o información interna.</small></label>
      <label className="dea-checkbox dea-span-two"><input type="checkbox" checked={form.published} onChange={e => change('published',e.target.checked)} />Publicar esta ubicación en el mapa</label>
    </div></fieldset>{error && <p className="dea-error" role="alert">{error}</p>}<div className="dea-dialog-actions"><button type="button" className="grcp-button grcp-button-secondary" disabled={busy} onClick={unsaved.requestClose}>Cancelar</button><button type="submit" className="grcp-button grcp-button-primary" disabled={busy}><Save size={17} />{busy ? 'Guardando…' : 'Guardar ubicación'}</button></div></form>
    {unsaved.confirmDiscard && <UnsavedChangesPrompt onKeep={() => unsaved.setConfirmDiscard(false)} onDiscard={unsaved.discard} />}
  </dialog>;
}
DeaEditor.propTypes = { record: PropTypes.object, records: PropTypes.arrayOf(PropTypes.object), initialCoordinates: PropTypes.shape({ latitude: PropTypes.number, longitude: PropTypes.number }), onClose: PropTypes.func.isRequired, onSave: PropTypes.func.isRequired };
