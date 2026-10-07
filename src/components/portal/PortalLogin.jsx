import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  Eye,
  EyeOff,
  FileBadge,
  HeartPulse,
  LockKeyhole,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function PortalLogin({ recovery, onRecovered, onDemo }) {
  const [mode, setMode] = useState("login"),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const active = recovery ? "password" : mode;
  async function submit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!supabase) {
      setError("El portal necesita la conexión a Supabase.");
      return;
    }
    if (active === "password" && password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setBusy(true);
    try {
      const result =
        active === "login"
          ? await supabase.auth.signInWithPassword({
              email: email.trim(),
              password,
            })
          : active === "reset"
            ? await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/Portal`,
              })
            : await supabase.auth.updateUser({ password });
      if (result.error) throw result.error;
      if (active === "reset")
        setNotice(
          "Si ese correo tiene una cuenta, recibirá un enlace para recuperar el acceso.",
        );
      if (active === "password") {
        onRecovered();
        setNotice("Tu contraseña fue actualizada.");
      }
      setPassword("");
      setConfirm("");
    } catch {
      setError(
        active === "login"
          ? "No pudimos ingresar. Revisá tu correo, contraseña y confirmación de la cuenta."
          : "No pudimos completar la solicitud. Intentá nuevamente en unos minutos.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="portal-login">
      <div className="portal-login-story">
        <Link to="/" className="portal-brand">
          <HeartPulse />
          <strong>
            GRCP <span>Instituciones</span>
          </strong>
        </Link>
        <div>
          <span className="portal-eyebrow">PREPARACIÓN QUE CONTINÚA</span>
          <h1>
            Tu institución.
            <br />
            Su cuidado, <em>cada día.</em>
          </h1>
          <p>
            Un espacio compartido con GRCP para organizar la preparación, cuidar
            los equipos y tener cada documento a mano.
          </p>
          <ul>
            <li>
              <CalendarDays />
              <span>
                Capacitaciones y simulacros
                <strong>Un calendario para planificar juntos.</strong>
              </span>
            </li>
            <li>
              <ClipboardCheck />
              <span>
                Equipos y revisiones
                <strong>Historial, observaciones y próximos controles.</strong>
              </span>
            </li>
            <li>
              <FileBadge />
              <span>
                Certificados y protocolos
                <strong>La documentación de tu institución, disponible.</strong>
              </span>
            </li>
          </ul>
        </div>
        <small>GRCP Argentina · Preparación para cuidar.</small>
      </div>
      <div className="portal-login-form">
        <div className="portal-login-card">
          <span className="portal-icon-tile">
            <LockKeyhole />
          </span>
          <h2>
            {active === "password"
              ? "Prepará tu acceso"
              : active === "reset"
                ? "Recuperá tu contraseña"
                : "Bienvenido a tu portal"}
          </h2>
          <p>
            {active === "password"
              ? "Elegí una contraseña personal de al menos 12 caracteres."
              : "Ingresá con la cuenta que GRCP asignó a tu institución."}
          </p>
          <form onSubmit={submit}>
            {active !== "password" && (
              <label className="portal-field">
                Correo electrónico
                <input
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.nombre@institucion.com"
                />
              </label>
            )}
            {active !== "reset" && (
              <label className="portal-field">
                Contraseña
                <div className="portal-password">
                  <input
                    type={show ? "text" : "password"}
                    required
                    minLength={active === "password" ? 12 : 1}
                    autoComplete={
                      active === "password"
                        ? "new-password"
                        : "current-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={
                      show ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    onClick={() => setShow(!show)}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
            )}
            {active === "password" && (
              <label className="portal-field">
                Repetir contraseña
                <input
                  type={show ? "text" : "password"}
                  required
                  minLength={12}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </label>
            )}
            {error && (
              <p className="portal-alert error" role="alert">
                {error}
              </p>
            )}
            {notice && (
              <p className="portal-alert success" role="status">
                {notice}
              </p>
            )}
            <button
              className="portal-button primary"
              disabled={busy || !supabase}
            >
              {busy
                ? "Procesando…"
                : active === "login"
                  ? "Ingresar"
                  : active === "reset"
                    ? "Enviar enlace"
                    : "Guardar contraseña"}
              <ArrowRight size={18} />
            </button>
          </form>
          {!recovery && (
            <button
              className="portal-text-button"
              onClick={() => {
                setMode(mode === "login" ? "reset" : "login");
                setError("");
                setNotice("");
                setPassword("");
              }}
            >
              {mode === "login" ? "Olvidé mi contraseña" : "Volver al ingreso"}
            </button>
          )}
          <div className="portal-login-help">
            <p>
              ¿Todavía no tenés acceso?{" "}
              <Link to="/Contacto">Contactá a GRCP.</Link>
            </p>
            <button onClick={onDemo}>
              Explorar una demostración <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <Link className="portal-back-link" to="/">
          Volver al sitio de GRCP
        </Link>
      </div>
    </div>
  );
}
PortalLogin.propTypes = {
  recovery: PropTypes.bool,
  onRecovered: PropTypes.func.isRequired,
  onDemo: PropTypes.func.isRequired,
};
