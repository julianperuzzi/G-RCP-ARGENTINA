import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { X, Plus, Trash2, Upload, Save } from "lucide-react";
import { LocationPicker } from "./PortalLocationMap";
import UnsavedChangesPrompt from './UnsavedChangesPrompt';
import useUnsavedForm from '../../hooks/useUnsavedForm';
import { locationPayload } from "../../lib/portalLocations";
import { preparePortalDocument } from "../../lib/portalFinanceFile";
import {
  label,
  localDate,
  portalError,
  toLocalInput,
  validateDocument,
} from "../../lib/portal";

const text = (key, title, required = false, type = "text") => ({
  key,
  title,
  required,
  type,
});
const options = (key, title, values, required = true) => ({
  key,
  title,
  required,
  type: "select",
  options: values.map((value) => [value, label(value)]),
});
function fieldsFor(key, record, data, values, replacing = false) {
  const sites = {
    key: "site_id",
    title: "Sede",
    type: "select",
    options: data.sites
      .filter((r) => !r.archived_at)
      .map((r) => [r.id, r.name]),
  };
  const assets = {
    key: "asset_id",
    title: "Equipo o elemento",
    type: "select",
    options: data.assets
      .filter((r) => !r.archived_at)
      .map((r) => [r.id, r.name]),
  };
  const activities = {
    key: "activity_id",
    title: "Capacitación o actividad",
    type: "select",
    required: key === "participants" || values.kind === "certificate",
    options: data.activities
      .filter(
        (r) =>
          !r.archived_at &&
          (key === "participants"
            ? r.kind === "training"
            : values.kind !== "certificate" ||
              (r.kind === "training" && r.status === "completed")),
      )
      .map((r) => [r.id, r.title]),
  };
  switch (key) {
    case "institutions":
      return [
        text("name", "Nombre de la institución", true),
        options("kind", "Tipo", ["company", "school", "institution", "other"]),
        text("contact_name", "Persona de contacto"),
        text("contact_email", "Correo de contacto", false, "email"),
        text("contact_phone", "Teléfono"),
        text("address", "Dirección"),
        text("city", "Localidad"),
        text("province", "Provincia"),
        options("status", "Estado", ["active", "paused"]),
        text("notes", "Notas compartidas", false, "textarea"),
      ];
    case "sites":
      return [
        text("name", "Nombre de la sede", true),
        text("address", "Dirección"),
        text("city", "Localidad"),
        text("notes", "Observaciones", false, "textarea"),
      ];
    case "memberships":
      return [
        text("email", "Correo de la cuenta", true, "email"),
        options("role", "Permiso", ["manager", "viewer"]),
        { key: "active", title: "Acceso habilitado", type: "checkbox" },
      ];
    case "assets":
      return [
        text("name", "Nombre del equipo o elemento", true),
        options("kind", "Tipo", [
          "dea",
          "kit",
          "trauma_kit",
          "spine_board",
          "oxygen_kit",
          "bvm",
          "splint_kit",
          "evacuation_chair",
          "exit",
          "extinguisher",
          "other",
        ]),
        sites,
        text("location", "Ubicación dentro de la sede"),
        text("manufacturer", "Fabricante"),
        text("model", "Modelo"),
        text("serial_number", "Número de serie o referencia"),
        options("status", "Estado registrado", [
          "unknown",
          "operational",
          "attention",
          "out_of_service",
        ]),
        text("next_review_on", "Próxima revisión", false, "date"),
        ...(values.kind === "dea"
          ? [
              text(
                "battery_expires_on",
                "Vencimiento de batería",
                false,
                "date",
              ),
              text(
                "pads_expires_on",
                "Vencimiento de electrodos",
                false,
                "date",
              ),
            ]
          : [text("expires_on", "Vencimiento", false, "date")]),
        text(
          "notes",
          "Observaciones e inventario de insumos",
          false,
          "textarea",
        ),
      ];
    case "activities":
      return [
        text("title", "Nombre de la actividad", true),
        options("kind", "Tipo", ["training", "inspection", "drill"]),
        text("starts_at", "Inicio", true, "datetime-local"),
        text("ends_at", "Finalización", false, "datetime-local"),
        sites,
        assets,
        text("responsible", "Responsable"),
        text("location", "Lugar"),
        options("status", "Estado", [
          "planned",
          "confirmed",
          "completed",
          "cancelled",
        ]),
        options(
          "repeat_months",
          "Repetición en meses",
          [0, 1, 3, 6, 12].map(String),
        ),
        text("notes", "Detalles para la institución", false, "textarea"),
        text(
          "report",
          "Resultado y acciones pendientes",
          values.status === "completed" && values.kind !== "training",
          "textarea",
        ),
      ];
    case "inspections":
      return [
        { ...assets, required: true },
        text("checked_on", "Fecha de revisión", true, "date"),
        text("checked_by", "Realizada por", true),
        options("result", "Resultado", ["pass", "attention", "fail"]),
        text("next_review_on", "Próxima revisión", false, "date"),
        text("notes", "Observaciones y acciones pendientes", false, "textarea"),
      ];
    case "participants":
      return [
        ...(record?.id ? [] : [activities]),
        text("full_name", "Nombre y apellido", true),
        text("email", "Correo electrónico", false, "email"),
        options("attendance", "Asistencia", ["pending", "attended", "absent"]),
      ];
    case "documents":
      return replacing ? [
        text("title", "Título de la nueva versión", true),
        text("issued_on", "Fecha de emisión", true, "date"),
        text("expires_on", "Vencimiento, si corresponde", false, "date"),
      ] : record?.id ? [
        text("title", "Título del documento", true),
        text("issued_on", "Fecha de emisión", true, "date"),
        text("expires_on", "Vencimiento, si corresponde", false, "date"),
        text("version", "Versión", true, "number"),
      ] : [
        text("title", "Título del documento", true),
        options("kind", "Tipo", ["certificate", "protocol", "report", "photo", "manual", "other"]),
        ...(values.kind === "certificate"
          ? [
              activities,
              {
                key: "participant_id",
                title: "Participante con asistencia registrada",
                type: "select",
                required: true,
                options: data.participants
                  .filter(
                    (p) =>
                      p.activity_id === values.activity_id &&
                      p.attendance === "attended",
                  )
                  .map((p) => [p.id, p.full_name]),
              },
            ]
          : [
              { ...assets, required: ['photo', 'manual'].includes(values.kind) },
              ...(['photo', 'manual'].includes(values.kind) ? [] : [activities]),
              ...(['photo', 'manual'].includes(values.kind) ? [] : [{
                key: "inspection_id",
                title: "Revisión relacionada",
                type: "select",
                options: data.inspections.map((r) => [
                  r.id,
                  `${data.assets.find((a) => a.id === r.asset_id)?.name || "Equipo"} · ${r.checked_on}`,
                ]),
              }]),
            ]),
        text("issued_on", "Fecha de emisión", true, "date"),
        text("expires_on", "Vencimiento, si corresponde", false, "date"),
        text("version", "Versión", true, "number"),
      ];
    case "requests":
      return record?.id
        ? [
            options("status", "Estado", ["open", "in_progress", "resolved"]),
            text(
              "response",
              "Respuesta de GRCP",
              values.status === "resolved",
              "textarea",
            ),
          ]
        : [
            text("title", "Asunto", true),
            options("kind", "Tipo", [
              "training",
              "inspection",
              "drill",
              "question",
              "problem",
            ]),
            assets,
            text("body", "Contanos qué necesitás", true, "textarea"),
          ];
    default:
      return [];
  }
}
PortalEditor.propTypes = {
  entity: PropTypes.string.isRequired,
  record: PropTypes.object,
  data: PropTypes.object.isRequired,
  institutionId: PropTypes.string,
  replacing: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
const TITLES = {
  institutions: "institución",
  sites: "sede",
  memberships: "acceso",
  assets: "equipo o elemento",
  activities: "actividad",
  inspections: "revisión",
  participants: "participante",
  documents: "documento",
  requests: "solicitud",
};
const DEFAULTS = {
  institutions: { kind: "institution", status: "active" },
  memberships: { role: "manager", active: true },
  assets: { kind: "dea", status: "unknown" },
  activities: { kind: "training", status: "planned", repeat_months: "0" },
  inspections: {
    checked_on: localDate(),
    result: "pass",
    checked_by: "Equipo GRCP",
    checklist: [],
  },
  participants: { attendance: "pending" },
  documents: { kind: "certificate", issued_on: localDate(), version: 1 },
  requests: { kind: "question" },
};

export default function PortalEditor({
  entity,
  record,
  data,
  institutionId,
  replacing = false,
  onSave,
  onClose,
}) {
  const dialog = useRef(null);
  const [values, setValues] = useState(() => {
    const result = { ...DEFAULTS[entity], ...record };
    if (entity === "activities") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      result.starts_at = toLocalInput(
        result.starts_at || tomorrow.toISOString(),
      );
      result.ends_at = toLocalInput(result.ends_at);
    }
    return result;
  });
  const [file, setFile] = useState(null),
    [assetFiles, setAssetFiles] = useState([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [fieldError, setFieldError] = useState(null),
    [checkText, setCheckText] = useState("");
  const unsaved = useUnsavedForm(values, file || (assetFiles.length ? assetFiles : null), busy, onClose);
  const fields = fieldsFor(entity, record, data, values, replacing);
  const similarParticipant = entity === 'participants' && !record?.id && values.full_name?.trim() &&
    data.participants.find((row) => row.activity_id === values.activity_id &&
      row.full_name.trim().localeCompare(values.full_name.trim(), 'es', { sensitivity: 'base' }) === 0);
  useEffect(() => {
    const node = dialog.current;
    node.showModal();
    return () => node.close();
  }, []);
  function change(key, value) {
    if (fieldError?.key === key) setFieldError(null);
    setValues((old) => ({
      ...old,
      [key]: value,
      ...(key === "activity_id" ? { participant_id: "" } : {}),
      ...(key === "kind" && entity === "documents"
        ? { activity_id: "", participant_id: "", inspection_id: "", asset_id: value === 'certificate' ? '' : old.asset_id }
        : {}),
    }));
  }
  async function submit(event) {
    event.preventDefault();
    setError("");
    setFieldError(null);
    setBusy(true);
    try {
      const invalidField = (key, message) => { setFieldError({ key, message }); throw new Error(message); };
      const payload = Object.fromEntries(
        fields.map((field) => {
          let value = values[field.key] ?? "";
          if (field.type === "datetime-local")
            value = value ? new Date(value).toISOString() : null;
          if (field.type === "date" || field.key.endsWith("_id"))
            value = value || null;
          if (field.type === "number" || field.key === "repeat_months")
            value = Number(value);
          if (field.type === "checkbox") value = Boolean(value);
          if (typeof value === "string") value = value.trim();
          return [field.key, value];
        }),
      );
      if (entity === "memberships") payload.email = payload.email.toLowerCase();
      if (entity === 'participants' && !record?.id && payload.email && data.participants.some((row) => row.activity_id === payload.activity_id && row.email?.toLowerCase() === payload.email.toLowerCase()))
        invalidField('email', 'Ya existe un participante con ese correo en esta capacitación. Revisá la lista antes de guardar.');
      if (["institutions", "sites"].includes(entity)) Object.assign(payload, locationPayload(values));
      if (entity === "inspections") payload.checklist = values.checklist || [];
      if (entity === "assets") {
        if (values.kind === "dea") payload.expires_on = null;
        else {
          payload.battery_expires_on = null;
          payload.pads_expires_on = null;
        }
      }
      if (
        entity === "activities" &&
        payload.ends_at &&
        payload.ends_at <= payload.starts_at
      )
        invalidField('ends_at', "La finalización debe ser posterior al inicio.");
      if (entity === "inspections" && payload.checked_on > localDate())
        invalidField('checked_on', "Una revisión realizada no puede tener fecha futura.");
      if (
        entity === "inspections" &&
        payload.next_review_on &&
        payload.next_review_on <= payload.checked_on
      )
        invalidField('next_review_on',
          "La próxima revisión debe ser posterior a la revisión realizada.",
        );
      let uploadFile = file;
      if (entity === "documents" && (!record?.id || replacing)) {
        uploadFile = await preparePortalDocument(file);
        validateDocument(uploadFile);
        if (values.kind === 'photo' && !['image/jpeg', 'image/png'].includes(uploadFile.type))
          invalidField('file', 'Para una foto seleccioná un archivo JPG o PNG.');
      }
      if (!record?.id && entity !== "institutions")
        payload.institution_id = institutionId;
      await onSave(entity, payload, record?.id, entity === 'assets' ? assetFiles : uploadFile);
      unsaved.closeAfterSave();
    } catch (failure) {
      setError(
        failure.code
          ? portalError(failure)
          : failure.message || "No pudimos guardar.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      className="portal-dialog"
      onCancel={(e) => {
        e.preventDefault();
        if (unsaved.confirmDiscard) unsaved.setConfirmDiscard(false);
        else unsaved.requestClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) unsaved.requestClose();
      }}
      aria-labelledby="portal-editor-title"
    >
      <div className="portal-dialog-inner">
        <header>
          <div>
            <span className="portal-eyebrow">
              {entity === "inspections"
                ? "HISTORIAL DE EQUIPAMIENTO"
                : "PORTAL GRCP"}
            </span>
            <h2 id="portal-editor-title">
              {replacing ? "Reemplazar" : record?.id ? "Editar" : "Registrar"} {TITLES[entity]}
            </h2>
          </div>
          <button
            className="portal-icon-button"
            aria-label="Cerrar formulario"
            onClick={unsaved.requestClose}
            disabled={busy}
          >
            <X />
          </button>
        </header>
        {entity === 'sites' && (
          <p className="portal-form-hint">Esta sede {record?.id ? 'está' : 'quedará'} vinculada a <strong>{data.institutions.find((row) => row.id === institutionId)?.name || 'la institución seleccionada'}</strong>. Podés registrar otras sedes después.</p>
        )}
        {entity === "memberships" && (
          <p className="portal-alert">
            Asigná el correo que usará esta persona. Después de guardar, usá
            Enviar invitación para que elija su contraseña. Guardar el permiso
            no envía un correo.
          </p>
        )}
        {entity === "activities" && (
          <p className="portal-form-hint">
            Al marcar una actividad repetitiva como realizada, se programa la
            siguiente. Las revisiones de equipos se registran por separado en
            Revisiones.
          </p>
        )}
        {entity === "requests" && record?.id && (
          <div className="portal-request-preview">
            <strong>{record.title}</strong>
            <p>{record.body}</p>
          </div>
        )}
        {similarParticipant && <p className="portal-alert" role="status">Ya figura una persona con ese nombre en esta capacitación. Comprobá que no sea una carga duplicada.</p>}
        <form onSubmit={submit}>
          <fieldset disabled={busy} className="portal-form-grid">
            {fields.map((field) => (
              <label
                className={`portal-field ${field.type === "textarea" ? "wide" : ""}`}
                key={field.key}
              >
                {field.title}
                {field.required ? " *" : ""}
                {field.type === "select" ? (
                  <select
                    name={field.key}
                    aria-invalid={fieldError?.key === field.key}
                    required={field.required}
                    value={values[field.key] ?? ""}
                    onChange={(e) => change(field.key, e.target.value)}
                  >
                    <option value="">
                      {field.required ? "Seleccioná una opción" : "Sin asignar"}
                    </option>
                    {field.options.map(([id, title]) => (
                      <option key={id} value={id}>
                        {field.key === "repeat_months"
                          ? id === "0"
                            ? "No repetir"
                            : `Cada ${id} ${id === "1" ? "mes" : "meses"}`
                          : title}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    name={field.key}
                    aria-invalid={fieldError?.key === field.key}
                    rows={4}
                    maxLength={
                      entity === "activities" && field.key === "report"
                        ? 10000
                        : 5000
                    }
                    required={field.required}
                    value={values[field.key] ?? ""}
                    onChange={(e) => change(field.key, e.target.value)}
                  />
                ) : field.type === "checkbox" ? (
                  <input
                    name={field.key}
                    aria-invalid={fieldError?.key === field.key}
                    type="checkbox"
                    checked={Boolean(values[field.key])}
                    onChange={(e) => change(field.key, e.target.checked)}
                  />
                ) : (
                  <input
                    name={field.key}
                    aria-invalid={fieldError?.key === field.key}
                    type={field.type}
                    required={field.required}
                    value={values[field.key] ?? ""}
                    maxLength={
                      field.type === "email"
                        ? 254
                        : field.key === "address" || field.key === "location"
                          ? 300
                          : 200
                    }
                    min={field.type === "number" ? 1 : undefined}
                    max={
                      field.type === "number"
                        ? 10000
                        : field.key === "checked_on"
                          ? localDate()
                          : undefined
                    }
                    onChange={(e) => change(field.key, e.target.value)}
                  />
                )}
                {fieldError?.key === field.key && <small className="portal-field-error" role="alert">{fieldError.message}</small>}
              </label>
            ))}
            {["institutions", "sites"].includes(entity) && (
              <LocationPicker values={values} onChange={(point) => setValues((old) => ({ ...old, ...point }))} />
            )}
            {entity === "inspections" && (
              <div className="wide portal-check-builder">
                <strong>Puntos de control</strong>
                <p>
                  Definí los controles que corresponden al equipo y marcá los
                  que se verificaron.
                </p>
                {(values.checklist || []).map((check, i) => (
                  <div key={i}>
                    <label>
                      <input
                        type="checkbox"
                        checked={check.ok}
                        onChange={(e) =>
                          change(
                            "checklist",
                            values.checklist.map((item, j) =>
                              j === i
                                ? { ...item, ok: e.target.checked }
                                : item,
                            ),
                          )
                        }
                      />
                      {check.text}
                    </label>
                    <button
                      type="button"
                      aria-label={`Quitar ${check.text}`}
                      onClick={() =>
                        change(
                          "checklist",
                          values.checklist.filter((_, j) => j !== i),
                        )
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <div>
                  <input
                    aria-label="Nuevo punto de control"
                    placeholder="Ej.: electrodos dentro de fecha"
                    maxLength={200}
                    value={checkText}
                    onChange={(e) => setCheckText(e.target.value)}
                  />
                  <button
                    type="button"
                    className="portal-icon-button"
                    aria-label="Agregar punto de control"
                    disabled={
                      !checkText.trim() ||
                      (values.checklist || []).length >= 100
                    }
                    onClick={() => {
                      change("checklist", [
                        ...(values.checklist || []),
                        { text: checkText.trim(), ok: false },
                      ]);
                      setCheckText("");
                    }}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            )}
            {entity === 'assets' && !record?.id && (
              <div className="portal-field wide portal-file-field">
                <Upload size={23} aria-hidden="true" />
                <label htmlFor="portal-asset-files"><strong>Fotos y adjuntos iniciales</strong></label>
                <span>Hasta 8 archivos PDF, JPG o PNG. Las fotos grandes se comprimen antes de guardarse. Podés agregar más desde la ficha del equipo.</span>
                <input id="portal-asset-files" type="file" multiple accept="application/pdf,image/jpeg,image/png"
                  onChange={(event) => {
                    const selected = Array.from(event.target.files || []);
                    if (selected.length > 8) setError('Seleccioná hasta 8 archivos por carga.');
                    else { setError(''); setAssetFiles(selected); }
                  }} />
                {assetFiles.length > 0 && <ul className="portal-selected-files">{assetFiles.map((attachment, index) => <li key={`${attachment.name}-${index}`}><span>{attachment.name}</span><button type="button" className="portal-icon-button" aria-label={`Quitar ${attachment.name}`} onClick={() => setAssetFiles((old) => old.filter((_, position) => position !== index))}><Trash2 size={15} /></button></li>)}</ul>}
              </div>
            )}
            {entity === "documents" && (!record?.id || replacing) && (
              <label className="portal-field wide portal-file-field">
                <Upload size={23} />
                <strong>Archivo PDF, JPG o PNG</strong>
                <span>
                  PDF hasta 10 MB. Las fotos grandes se comprimen antes de guardarse. Los archivos quedan privados para esta institución.
                </span>
                <input
                  type="file"
                  required
                  accept={values.kind === 'photo' ? 'image/jpeg,image/png' : 'application/pdf,image/jpeg,image/png'}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {fieldError?.key === 'file' && <small className="portal-field-error" role="alert">{fieldError.message}</small>}
              </label>
            )}
          </fieldset>
          {error && (
            <p className="portal-alert error" role="alert">
              {error}
            </p>
          )}
          <footer>
            <button
              type="button"
              className="portal-button"
              disabled={busy}
              onClick={unsaved.requestClose}
            >
              Cancelar
            </button>
            <button className="portal-button primary" disabled={busy}>
              {busy ? "Guardando…" : "Guardar"}
              <Save size={17} />
            </button>
          </footer>
        </form>
      </div>
      {unsaved.confirmDiscard && <UnsavedChangesPrompt onKeep={() => unsaved.setConfirmDiscard(false)} onDiscard={unsaved.discard} />}
    </dialog>
  );
}
