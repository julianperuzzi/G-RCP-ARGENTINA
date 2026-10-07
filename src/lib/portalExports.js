import { label } from "./portal.js";
function cell(value) {
  const text = String(value ?? "");
  // Evita fórmulas al abrir CSV de texto ingresado por usuarios en una planilla.
  const safe = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}
export function portalCsv(key, rows, data) {
  const asset = (id) => data.assets?.find((r) => r.id === id)?.name || "";
  const course = (id) => data.activities?.find((r) => r.id === id)?.title || "";
  const columns = {
    institutions: [
      ["name", "Institución"],
      ["kind", "Tipo", label],
      ["city", "Localidad"],
      ["contact_email", "Correo"],
      ["status", "Estado", label],
    ],
    sites: [
      ["name", "Sede"],
      ["address", "Dirección"],
      ["city", "Localidad"],
    ],
    assets: [
      ["name", "Equipo"],
      ["kind", "Tipo", label],
      ["serial_number", "Serie"],
      ["location", "Ubicación"],
      ["status", "Estado registrado", label],
      ["next_review_on", "Próxima revisión"],
      ["battery_expires_on", "Vence batería"],
      ["pads_expires_on", "Vencen electrodos"],
      ["expires_on", "Vencimiento"],
    ],
    activities: [
      ["title", "Actividad"],
      ["kind", "Tipo", label],
      ["starts_at", "Inicio (ISO)"],
      ["status", "Estado", label],
      ["responsible", "Responsable"],
      ["report", "Resultado"],
    ],
    inspections: [
      ["asset_id", "Equipo", asset],
      ["checked_on", "Fecha"],
      ["checked_by", "Realizada por"],
      ["result", "Resultado", label],
      ["next_review_on", "Próxima revisión"],
      ["notes", "Observaciones"],
    ],
    documents: [
      ["title", "Documento"],
      ["kind", "Tipo", label],
      ["activity_id", "Actividad", course],
      ["issued_on", "Emisión"],
      ["expires_on", "Vencimiento"],
      ["version", "Versión"],
    ],
    requests: [
      ["title", "Asunto"],
      ["kind", "Tipo", label],
      ["status", "Estado", label],
      ["body", "Solicitud"],
      ["response", "Respuesta GRCP"],
    ],
    participants: [
      ["full_name", "Participante"],
      ["email", "Correo"],
      ["attendance", "Asistencia", label],
    ],
  }[key];
  if (!columns) throw new Error("Exportación no disponible");
  return (
    "\ufeff" +
    [
      columns.map(([, title]) => cell(title)).join(";"),
      ...rows.map((row) =>
        columns
          .map(([field, , transform]) =>
            cell(transform ? transform(row[field]) : row[field]),
          )
          .join(";"),
      ),
    ].join("\r\n")
  );
}
const escapeIcs = (value) =>
  String(value || "")
    .replaceAll("\\", "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,");
const stamp = (value) =>
  new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
function foldIcs(line) {
  const pieces = [];
  let current = "";
  for (const char of line) {
    if (new TextEncoder().encode(current + char).length > 73) {
      pieces.push(current);
      current = " " + char;
    } else current += char;
  }
  pieces.push(current);
  return pieces.join("\r\n");
}
export function portalCalendarIcs(activities, now = new Date()) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GRCP Argentina//Portal Institucional//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  for (const row of activities.filter(
    (r) => !r.archived_at && r.status !== "cancelled",
  ))
    lines.push(
      "BEGIN:VEVENT",
      `UID:${row.id}@grcp-arg.com`,
      `DTSTAMP:${stamp(now)}`,
      `DTSTART:${stamp(row.starts_at)}`,
      ...(row.ends_at ? [`DTEND:${stamp(row.ends_at)}`] : []),
      `SUMMARY:${escapeIcs(row.title)}`,
      `DESCRIPTION:${escapeIcs(row.notes)}`,
      `LOCATION:${escapeIcs(row.location)}`,
      "END:VEVENT",
    );
  lines.push("END:VCALENDAR");
  return lines.map(foldIcs).join("\r\n") + "\r\n";
}
export function downloadPortalExport(
  content,
  name,
  type = "text/csv;charset=utf-8",
) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
