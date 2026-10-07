import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { X, Plus, Trash2, Upload, Save } from "lucide-react";
import { LocationPicker } from "./PortalLocationMap";
import { locationPayload } from "../../lib/portalLocations";
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
function fieldsFor(key, record, data, values) {
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
      return [
        text("title", "Título del documento", true),
        options("kind", "Tipo", ["certificate", "protocol", "report", "other"]),
        activities,
        ...(values.kind === "certificate"
          ? [
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
              {
                key: "inspection_id",
                title: "Revisión relacionada",
                type: "select",
                options: data.inspections.map((r) => [
                  r.id,
                  `${data.assets.find((a) => a.id === r.asset_id)?.name || "Equipo"} · ${r.checked_on}`,
                ]),
              },
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
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [checkText, setCheckText] = useState("");
  const fields = fieldsFor(entity, record, data, values);
  useEffect(() => {
    const node = dialog.current;
    node.showModal();
    return () => node.close();
  }, []);
  function change(key, value) {
    setValues((old) => ({
      ...old,
      [key]: value,
      ...(key === "activity_id" ? { participant_id: "" } : {}),
      ...(key === "kind" && entity === "documents"
        ? { activity_id: "", participant_id: "", inspection_id: "" }
        : {}),
    }));
  }
  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
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
        throw new Error("La finalización debe ser posterior al inicio.");
      if (entity === "inspections" && payload.checked_on > localDate())
        throw new Error("Una revisión realizada no puede tener fecha futura.");
      if (
        entity === "inspections" &&
        payload.next_review_on &&
        payload.next_review_on <= payload.checked_on
      )
        throw new Error(
          "La próxima revisión debe ser posterior a la revisión realizada.",
        );
      if (entity === "documents") validateDocument(file);
      if (!record?.id && entity !== "institutions")
        payload.institution_id = institutionId;
      await onSave(entity, payload, record?.id, file);
      onClose();
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
        if (!busy) onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
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
              {record?.id ? "Editar" : "Registrar"} {TITLES[entity]}
            </h2>
          </div>
          <button
            className="portal-icon-button"
            aria-label="Cerrar formulario"
            onClick={onClose}
            disabled={busy}
          >
            <X />
          </button>
        </header>
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
                    type="checkbox"
                    checked={Boolean(values[field.key])}
                    onChange={(e) => change(field.key, e.target.checked)}
                  />
                ) : (
                  <input
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
            {entity === "documents" && (
              <label className="portal-field wide portal-file-field">
                <Upload size={23} />
                <strong>Archivo PDF, JPG o PNG</strong>
                <span>
                  Hasta 10 MB. Los archivos quedan privados para esta
                  institución.
                </span>
                <input
                  type="file"
                  required
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
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
              onClick={onClose}
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
    </dialog>
  );
}
