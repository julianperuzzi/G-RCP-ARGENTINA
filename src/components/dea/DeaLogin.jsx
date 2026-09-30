import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function DeaLogin({ recovery = false, onRecovered }) {
  const [mode, setMode] = useState('login'), [email,setEmail] = useState('gruporcpsa@gmail.com'), [password,setPassword] = useState(''), [confirm,setConfirm] = useState('');
  const [busy,setBusy] = useState(false), [error,setError] = useState(''), [notice,setNotice] = useState(''), [show,setShow] = useState(false);
  const activeMode = recovery ? 'password' : mode;
  async function submit(event) {
    event.preventDefault(); setError(''); setNotice('');
    if (!supabase) { setError('El proyecto Supabase de GRCP todavía no está conectado.'); return; }
    if (activeMode === 'password' && password !== confirm) { setError('Las contraseñas no coinciden.'); return; }
    setBusy(true);
    try {
      let result;
      if (activeMode === 'login') result = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (activeMode === 'reset') result = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/PanelDEA` });
      if (activeMode === 'password') result = await supabase.auth.updateUser({ password });
      if (result.error) throw result.error;
      if (activeMode === 'reset') setNotice('Si existe una cuenta para ese email, recibirás un enlace para restablecer la contraseña.');
      if (activeMode === 'password') { setNotice('Contraseña actualizada.'); onRecovered?.(); }
      setPassword(''); setConfirm('');
    } catch (err) {
      setError(activeMode === 'login' ? 'No pudimos ingresar. Revisá tu email, contraseña y la confirmación de tu cuenta.' : err.status === 429 ? 'Demasiados intentos. Esperá unos minutos antes de volver a intentar.' : 'No pudimos completar la solicitud. Revisá los datos e intentá nuevamente.');
    } finally { setBusy(false); }
  }
  function changeMode(next) { setMode(next); setError(''); setNotice(''); setPassword(''); setConfirm(''); }
  return <section className="dea-login-page grcp-container"><div className="dea-login-intro"><p className="grcp-eyebrow">GESTIÓN DE LA RED DEA</p><h1>Un registro cuidado.<br /><span>Una comunidad preparada.</span></h1><p>La cuenta oficial de GRCP puede actualizar ubicaciones, revisar su disponibilidad y mantener la información del mapa.</p><Link to="/MapaDEA" className="dea-text-button">Volver al mapa público <ArrowRight size={17} /></Link></div><div className="dea-login-card"><span className="dea-login-icon"><LockKeyhole size={24} /></span><h2>{activeMode === 'password' ? 'Elegí una nueva contraseña' : activeMode === 'reset' ? 'Recuperar acceso' : 'Ingresá al panel'}</h2><p>Acceso reservado a gruporcpsa@gmail.com.</p>{!supabase && <p className="dea-notice">Conexión pendiente al proyecto GRCP. El acceso se habilitará al configurar Supabase.</p>}<form onSubmit={submit}>
      {activeMode !== 'password' && <label className="dea-field"><span><Mail size={14} />Email</span><input type="email" required autoComplete="email" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} /></label>}
      {activeMode !== 'reset' && <label className="dea-field"><span>Contraseña</span><div className="dea-password-field"><input type={show ? 'text' : 'password'} required minLength={activeMode === 'login' ? 1 : 12} autoComplete={activeMode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} /><button type="button" aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{activeMode !== 'login' && <small>Usá al menos 12 caracteres.</small>}</label>}
      {activeMode === 'password' && <label className="dea-field"><span>Repetir contraseña</span><input type={show ? 'text' : 'password'} required minLength={12} autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} /></label>}
      {error && <p className="dea-error" role="alert">{error}</p>}{notice && <p className="dea-success" role="status">{notice}</p>}
      <button className="grcp-button grcp-button-primary" disabled={busy || !supabase}>{busy ? 'Procesando…' : activeMode === 'login' ? 'Ingresar' : activeMode === 'reset' ? 'Enviar enlace de recuperación' : 'Actualizar contraseña'}<ArrowRight size={17} /></button>
    </form>{!recovery && <div className="dea-login-links"><button onClick={() => changeMode(mode === 'login' ? 'reset' : 'login')}>{mode === 'login' ? 'Olvidé mi contraseña' : 'Volver al ingreso'}</button></div>}</div></section>;
}
DeaLogin.propTypes = { recovery: PropTypes.bool, onRecovered: PropTypes.func };
