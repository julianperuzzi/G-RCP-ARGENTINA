/* eslint-disable react/prop-types */
import './unsaved-changes.css';

export default function UnsavedChangesPrompt({ onKeep, onDiscard }) {
  return <div className="portal-unsaved-prompt" role="alertdialog" aria-label="Cambios sin guardar" aria-modal="true">
    <div><strong>Hay cambios sin guardar</strong><p>Si salís ahora, se perderán los datos que acabás de ingresar.</p>
      <div><button type="button" className="portal-button" onClick={onKeep}>Seguir editando</button><button type="button" className="portal-button primary" onClick={onDiscard}>Descartar cambios</button></div>
    </div>
  </div>;
}
