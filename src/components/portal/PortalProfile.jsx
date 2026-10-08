import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { KeyRound, Save, UserRound } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function PortalProfile({ session, context, institutions, memberships, demo }) {
  const userId = session?.user?.id;
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    if (demo) return;
    let active = true;
    supabase.from('portal_user_profiles').select('user_id,display_name,phone').eq('user_id', userId).maybeSingle()
      .then(({ data, error: failure }) => {
        if (!active) return;
        if (failure) setError('El perfil personal todavía no está activado en la base de datos.');
        else { setProfile(data); setName(data?.display_name || ''); setPhone(data?.phone || ''); }
      });
    return () => { active = false; };
  }, [demo, userId]);
  const role = context?.is_admin ? 'Administrador principal GRCP' : context?.is_operator ? 'Operador GRCP' :
    memberships.some((item) => item.role === 'manager') ? 'Responsable institucional' : 'Usuario de consulta';
  const assigned = context?.is_admin || context?.is_operator ? [] : institutions.filter((item) => memberships.some((membership) =>
    membership.institution_id === item.id && membership.email === context?.email && membership.active));
  const accountEmail = demo ? context?.is_admin ? 'grcp@example.com' : 'responsable@example.com' : session?.user?.email || context?.email;
  async function saveProfile(event) {
    event.preventDefault();
    setError(''); setNotice(''); setBusy(true);
    try {
      if (demo) { setNotice('Perfil actualizado en la demostración.'); return; }
      const payload = { display_name: name.trim(), phone: phone.trim() };
      const query = profile ? supabase.from('portal_user_profiles').update(payload).eq('user_id', userId) :
        supabase.from('portal_user_profiles').insert({ user_id: userId, ...payload });
      const { data, error: failure } = await query.select('user_id,display_name,phone').single();
      if (failure) throw failure;
      setProfile(data);
      setNotice('Perfil guardado.');
    } catch {
      setError('No pudimos guardar el perfil. Revisá la conexión y volvé a intentar.');
    } finally { setBusy(false); }
  }
  async function changePassword(event) {
    event.preventDefault();
    setError(''); setNotice('');
    if (password !== confirm) { setError('Las contraseñas nuevas no coinciden.'); return; }
    if (password === currentPassword) { setError('Elegí una contraseña diferente a la actual.'); return; }
    setBusy(true);
    try {
      const { error: failure } = await supabase.auth.updateUser({ password, current_password: currentPassword });
      if (failure) throw failure;
      setCurrentPassword(''); setPassword(''); setConfirm('');
      setNotice('Contraseña actualizada.');
    } catch {
      setError('No pudimos actualizar la contraseña. Comprobá la contraseña actual e intentá nuevamente.');
    } finally { setBusy(false); }
  }
  return <div className="portal-profile-grid">
    <section className="portal-card portal-profile-card">
      <h2><UserRound size={20} /> Datos de tu cuenta</h2>
      <p className="portal-muted">Tu correo se administra desde la cuenta de acceso. Tu nombre y teléfono solo son visibles en este perfil.</p>
      <dl className="portal-detail-fields"><div><dt>Correo</dt><dd>{accountEmail || 'Cuenta de demostración'}</dd></div><div><dt>Permiso</dt><dd>{role}</dd></div></dl>
      {assigned.length > 0 && <p className="portal-muted">Instituciones asignadas: {assigned.map((item) => item.name).join(', ')}.</p>}
      <form onSubmit={saveProfile} className="portal-profile-form">
        <label>Nombre para mostrar<input value={name} maxLength={200} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label>
        <label>Teléfono de contacto<input value={phone} maxLength={60} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" /></label>
        <button className="portal-button primary" disabled={busy || (!demo && !userId)}><Save size={16} /> Guardar perfil</button>
      </form>
    </section>
    {!demo && <section className="portal-card portal-profile-card">
      <h2><KeyRound size={20} /> Cambiar contraseña</h2>
      <p className="portal-muted">Usá una contraseña nueva de al menos 12 caracteres. Si olvidaste la actual, cerrá sesión y elegí “Olvidé mi contraseña”.</p>
      <form onSubmit={changePassword} className="portal-profile-form">
        <label>Contraseña actual<input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
        <label>Nueva contraseña<input type="password" autoComplete="new-password" minLength={12} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <label>Repetir nueva contraseña<input type="password" autoComplete="new-password" minLength={12} required value={confirm} onChange={(event) => setConfirm(event.target.value)} /></label>
        <button className="portal-button primary" disabled={busy}><KeyRound size={16} /> Actualizar contraseña</button>
      </form>
    </section>}
    {(error || notice) && <p className={`portal-alert ${error ? 'error' : 'success'}`} role={error ? 'alert' : 'status'}>{error || notice}</p>}
  </div>;
}

PortalProfile.propTypes = {
  session: PropTypes.object,
  context: PropTypes.object,
  institutions: PropTypes.array.isRequired,
  memberships: PropTypes.array.isRequired,
  demo: PropTypes.bool.isRequired,
};
