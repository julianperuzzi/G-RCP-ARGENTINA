import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowRight, Plus, Save, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { invitePortalOperator } from '../../lib/portalApi';
import { formatDate } from '../../lib/portal';

const DEMO_OPERATORS = [{ id: 'demo-operator', email: 'operador@example.com', full_name: 'Equipo GRCP · Ejemplo', active: true, invite_count: 0, last_invited_at: null }];

export default function PortalOperators({ demo }) {
  const [operators, setOperators] = useState(demo ? DEMO_OPERATORS : []);
  const [activity, setActivity] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const reload = useCallback(async () => {
    if (demo) return;
    const [{ data, error: listError }, { data: activityData, error: activityError }] = await Promise.all([
      supabase.from('portal_operators').select('*').order('created_at', { ascending: false }),
      supabase.rpc('portal_operator_activity'),
    ]);
    if (listError || activityError) throw listError || activityError;
    setOperators(data || []);
    setActivity(activityData || []);
  }, [demo]);
  useEffect(() => { reload().catch(() => setError('La gestión de operadores todavía no está activada en la base de datos.')); }, [reload]);
  async function perform(operation, success) {
    setBusy(true); setError(''); setNotice('');
    try { const result = await operation(); await reload(); setNotice(result?.message || success); }
    catch (failure) { setError(failure.code === '23505' ? 'Ya existe un operador con ese correo.' :
      /^(La |El |Se |No )/.test(failure.message || '') ? failure.message : 'No pudimos completar la operación. Revisá los datos e intentá nuevamente.'); }
    finally { setBusy(false); }
  }
  function add(event) {
    event.preventDefault();
    const payload = { email: email.trim().toLowerCase(), full_name: name.trim(), active: true };
    perform(async () => {
      if (demo) setOperators((current) => [{ ...payload, id: crypto.randomUUID(), invite_count: 0 }, ...current]);
      else {
        const { error: failure } = await supabase.from('portal_operators').insert(payload);
        if (failure) throw failure;
      }
      setEmail(''); setName('');
    }, 'Operador agregado. Ahora podés enviarle la invitación.');
  }
  function toggle(row) {
    perform(async () => {
      if (demo) setOperators((current) => current.map((item) => item.id === row.id ? { ...item, active: !row.active } : item));
      else {
        const { error: failure } = await supabase.from('portal_operators').update({ active: !row.active }).eq('id', row.id);
        if (failure) throw failure;
      }
    }, row.active ? 'Acceso del operador deshabilitado.' : 'Acceso del operador reactivado.');
  }
  function invite(row) {
    perform(async () => {
      if (demo) setOperators((current) => current.map((item) => item.id === row.id ? { ...item, invite_count: item.invite_count + 1, last_invited_at: new Date().toISOString() } : item));
      else return invitePortalOperator(row.id);
    }, demo ? 'Invitación simulada en la demostración.' : 'Invitación enviada.');
  }
  const selected = operators.find((row) => row.id === selectedId);
  function select(row) {
    setSelectedId(row.id);
    setEditName(row.full_name || '');
    setEditEmail(row.email);
    setError(''); setNotice('');
  }
  function saveEdit(event) {
    event.preventDefault();
    const payload = { full_name: editName.trim(), email: editEmail.trim().toLowerCase() };
    perform(async () => {
      if (demo) setOperators((current) => current.map((item) => item.id === selectedId ? { ...item, ...payload,
        ...(item.email !== payload.email ? { last_invited_at: null, invite_count: 0 } : {}) } : item));
      else {
        const { error: failure } = await supabase.from('portal_operators').update(payload).eq('id', selectedId);
        if (failure) throw failure;
      }
    }, 'Datos del operador actualizados. Si corregiste el correo, enviá una nueva invitación.');
  }
  return <div className="portal-operator-page">
    <section className="portal-card portal-profile-card">
      <h2><Users size={20} /> Equipo operativo de GRCP</h2>
      <p className="portal-muted">Los operadores pueden trabajar con instituciones y sus registros. Tesorería, Accesos, altas de operadores y gestión DEA permanecen en la cuenta principal.</p>
      <form onSubmit={add} className="portal-operator-form">
        <label>Nombre<input value={name} onChange={(event) => setName(event.target.value)} maxLength={200} required placeholder="Nombre del operador" /></label>
        <label>Correo de acceso<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" maxLength={254} required placeholder="persona@grcp-arg.com" /></label>
        <button className="portal-button primary" disabled={busy}><Plus size={16} /> Agregar operador</button>
      </form>
    </section>
    {error && <p className="portal-alert error" role="alert">{error}</p>}
    {notice && <p className="portal-alert success" role="status">{notice}</p>}
    <div className="portal-card portal-table-wrap"><table><thead><tr><th>Operador</th><th>Acceso</th><th>Último ingreso</th><th>Acciones</th></tr></thead><tbody>
      {operators.map((row) => {
        const status = activity.find((item) => item.operator_id === row.id);
        return <tr key={row.id}><td><button className="portal-record-link" onClick={() => select(row)}>{row.full_name || row.email}</button><small>{row.email}</small></td>
          <td>{!row.active ? 'Deshabilitado' : status?.confirmed_at ? 'Cuenta activada' : row.invite_failed_at ? 'Error de invitación' : row.last_invited_at ? 'Invitación enviada' : 'Sin invitación'}<small>{row.last_invited_at ? `Última invitación: ${formatDate(row.last_invited_at, true)}` : ''}</small></td>
          <td>{status?.last_sign_in_at ? formatDate(status.last_sign_in_at, true) : 'Sin ingreso registrado'}</td>
          <td><div className="portal-row-actions"><button className="portal-text-button" disabled={busy || !row.active || Boolean(status?.confirmed_at)} onClick={() => invite(row)}>{row.last_invited_at ? 'Reenviar' : 'Invitar'} <ArrowRight size={14} /></button><button className="portal-text-button" disabled={busy} onClick={() => toggle(row)}>{row.active ? 'Deshabilitar' : 'Reactivar'}</button></div></td></tr>;
      })}
      {!operators.length && <tr><td colSpan={4}>Todavía no hay operadores GRCP.</td></tr>}
    </tbody></table></div>
    {selected && <section className="portal-card portal-profile-card" aria-label={`Detalle de ${selected.full_name || selected.email}`}>
      <h2>Detalle del operador</h2>
      <dl className="portal-detail-fields"><div><dt>Estado</dt><dd>{selected.active ? 'Activo' : 'Deshabilitado'}</dd></div><div><dt>Invitaciones</dt><dd>{selected.invite_count || 0}</dd></div><div><dt>Alta</dt><dd>{selected.created_at ? formatDate(selected.created_at, true) : 'Demostración'}</dd></div><div><dt>Última actualización</dt><dd>{selected.updated_at ? formatDate(selected.updated_at, true) : '—'}</dd></div></dl>
      <form className="portal-operator-form" onSubmit={saveEdit}>
        <label>Nombre<input value={editName} onChange={(event) => setEditName(event.target.value)} maxLength={200} required /></label>
        <label>Correo<input type="email" value={editEmail} onChange={(event) => setEditEmail(event.target.value)} maxLength={254} required /></label>
        <button className="portal-button primary" disabled={busy || (editName.trim() === selected.full_name && editEmail.trim().toLowerCase() === selected.email)}><Save size={16} /> Guardar cambios</button>
      </form>
      <p className="portal-muted">Corregir el correo quita el acceso a la dirección anterior. La nueva dirección necesita su propia invitación o una cuenta confirmada.</p>
    </section>}
  </div>;
}

PortalOperators.propTypes = { demo: PropTypes.bool.isRequired };
