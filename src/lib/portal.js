export const PORTAL_ADMIN_EMAIL = "gruporcpsa@gmail.com";
export const PORTAL_BUCKET = "grcp-instituciones";
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const LABELS = {
  company: "Empresa",
  school: "Escuela",
  institution: "Institución",
  other: "Otro",
  active: "Activa",
  paused: "Pausada",
  manager: "Responsable",
  viewer: "Consulta",
  training: "Capacitación",
  inspection: "Revisión",
  drill: "Simulacro",
  planned: "Programada",
  confirmed: "Confirmada",
  completed: "Realizada",
  cancelled: "Cancelada",
  dea: "DEA",
  kit: "Botiquín",
  exit: "Salida de emergencia",
  extinguisher: "Extintor",
  unknown: "Sin verificar",
  operational: "Operativo",
  attention: "Requiere atención",
  out_of_service: "Fuera de servicio",
  pass: "Sin observaciones",
  fail: "No conforme",
  pending: "Pendiente",
  attended: "Asistió",
  absent: "No asistió",
  certificate: "Certificado",
  protocol: "Protocolo",
  report: "Informe",
  open: "Abierta",
  in_progress: "En seguimiento",
  resolved: "Resuelta",
  question: "Consulta",
  problem: "Incidencia",
};
export const label = (value) => LABELS[value] || value || "—";
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function formatDate(value, time = false) {
  if (!value) return "Sin fecha";
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  if (Number.isNaN(date.getTime())) return "Fecha inválida";
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}
export function dueState(value, today = localDate()) {
  if (!value) return "none";
  const deadline = value.slice(0, 10);
  if (deadline < today) return "overdue";
  const delta =
    (Date.parse(`${deadline}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) /
    86400000;
  return delta <= 30 ? "soon" : "ok";
}
export function assetAlerts(asset, today) {
  return [
    ["next_review_on", "Revisión"],
    ["battery_expires_on", "Batería"],
    ["pads_expires_on", "Electrodos"],
    ["expires_on", "Vencimiento"],
  ]
    .filter(([key]) =>
      ["overdue", "soon"].includes(dueState(asset[key], today)),
    )
    .map(([key, name]) => ({
      key,
      name,
      date: asset[key],
      state: dueState(asset[key], today),
    }));
}
export function nextOccurrence(activity) {
  if (!activity.repeat_months) return null;
  const start = new Date(activity.starts_at);
  const target = new Date(start);
  const day = target.getUTCDate();
  target.setUTCDate(1);
  target.setUTCMonth(target.getUTCMonth() + Number(activity.repeat_months));
  const last = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(day, last));
  const duration = activity.ends_at
    ? Date.parse(activity.ends_at) - start.getTime()
    : null;
  return {
    ...activity,
    starts_at: target.toISOString(),
    ends_at:
      duration === null
        ? null
        : new Date(target.getTime() + duration).toISOString(),
    status: "planned",
    report: "",
    completed_at: null,
    recurrence_source_id: activity.id,
  };
}
export function toLocalInput(value) {
  if (!value) return "";
  const date = new Date(value);
  return `${localDate(date)}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
export function validateDocument(file) {
  if (!file) throw new Error("Seleccioná un archivo.");
  if (!FILE_TYPES.includes(file.type))
    throw new Error("Usá un PDF o una imagen JPG o PNG.");
  if (!file.size || file.size > MAX_FILE_SIZE)
    throw new Error("El archivo debe pesar hasta 10 MB y no estar vacío.");
}
export function portalError(error) {
  if (error?.portalMessage) return error.portalMessage;
  if (["PGRST202", "PGRST205", "42P01", "42883"].includes(error?.code))
    return "El portal todavía está pendiente de activación. Contactá a GRCP para habilitar el acceso a la información.";
  if (error?.code === "23505")
    return "Ese registro ya existe. Revisá el email o el archivo asociado.";
  if (["42501", "PGRST301"].includes(error?.code))
    return "Tu cuenta no tiene permiso para realizar esta acción. Volvé a ingresar o consultá a GRCP.";
  if (["23503", "23514"].includes(error?.code))
    return [
      "Archivá el certificado",
      "La capacitación tiene certificados activos",
      "El certificado requiere",
      "Los participantes corresponden",
    ].some((text) => error.message?.startsWith(text))
      ? error.message
      : "Revisá los campos obligatorios, fechas y relaciones seleccionadas. Las sedes, equipos y actividades deben pertenecer a la misma institución.";
  return error?.message === "Failed to fetch"
    ? "No pudimos conectar. Revisá tu conexión y volvé a intentar."
    : "No pudimos completar la operación. Revisá los datos e intentá nuevamente.";
}
