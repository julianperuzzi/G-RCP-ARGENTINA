/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileBadge,
  FileText,
  GraduationCap,
  HeartPulse,
  History,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
  Archive,
  RotateCcw,
} from "lucide-react";
import usePortal from "../hooks/usePortal";
import { supabase } from "../lib/supabase";
import {
  assetAlerts,
  dueState,
  formatDate,
  label,
  localDate,
  portalError,
} from "../lib/portal";
import { downloadPortalDocument, invitePortalMember } from "../lib/portalApi";
import {
  downloadPortalExport,
  portalCalendarIcs,
  portalCsv,
} from "../lib/portalExports";
import PortalLogin from "../components/portal/PortalLogin";
import PortalEditor from "../components/portal/PortalEditor";
import "./portal.css";

const MODULES = [
  ["resumen", "Resumen", LayoutDashboard],
  ["instituciones", "Instituciones", Building2, "admin"],
  ["calendario", "Calendario", CalendarDays],
  ["sedes", "Sedes", MapPin],
  ["equipamiento", "Equipamiento", HeartPulse],
  ["revisiones", "Revisiones", ClipboardCheck],
  ["capacitaciones", "Capacitaciones", GraduationCap],
  ["documentos", "Documentos", FileBadge],
  ["solicitudes", "Solicitudes", MessageSquare],
  ["accesos", "Accesos", Users, "admin"],
  ["historial", "Historial", History, "admin"],
];
const DESCRIPTIONS = {
  resumen: "Un panorama de tu preparación y lo que viene.",
  instituciones: "Cada institución, con su información y seguimiento.",
  calendario: "Organizá capacitaciones, revisiones y simulacros.",
  sedes: "Los espacios que forman parte de esta institución.",
  equipamiento: "Equipos y elementos, con sus fechas y estado registrado.",
  revisiones: "Controles realizados, evidencias y acciones pendientes.",
  capacitaciones: "Jornadas, participantes y asistencia registrada.",
  documentos: "Certificados, protocolos e informes en un solo lugar.",
  solicitudes: "Un canal de seguimiento compartido con GRCP.",
  accesos: "Asigná y administrá los permisos de esta institución.",
  historial: "Trazabilidad de los cambios realizados en el portal.",
};
const ENTITY = {
  instituciones: "institutions",
  calendario: "activities",
  sedes: "sites",
  equipamiento: "assets",
  revisiones: "inspections",
  capacitaciones: "activities",
  documentos: "documents",
  solicitudes: "requests",
  accesos: "memberships",
};
const ADD_LABEL = {
  instituciones: "Nueva institución",
  calendario: "Nueva actividad",
  sedes: "Nueva sede",
  equipamiento: "Agregar equipo",
  revisiones: "Registrar revisión",
  capacitaciones: "Nueva capacitación",
  documentos: "Cargar documento",
  solicitudes: "Nueva solicitud",
  accesos: "Asignar acceso",
};
const activeRows = (rows) => (rows || []).filter((row) => !row.archived_at);
const matchSearch = (rows, search) =>
  rows.filter((row) =>
    Object.values(row)
      .filter((value) => typeof value === "string")
      .join(" ")
      .toLocaleLowerCase("es")
      .includes(search.toLocaleLowerCase("es")),
  );

function Badge({ value }) {
  return <span className={`portal-badge ${value}`}>{label(value)}</span>;
}
function Empty({ text = "Todavía no hay registros.", children }) {
  return (
    <div className="portal-empty">
      <ClipboardCheck size={30} />
      <strong>{text}</strong>
      <p>
        La información aparecerá aquí a medida que se registre el seguimiento.
      </p>
      {children}
    </div>
  );
}
function EditButton({ onClick, title = "Editar" }) {
  return (
    <button
      className="portal-icon-button"
      title={title}
      aria-label={title}
      onClick={onClick}
    >
      <Pencil size={16} />
    </button>
  );
}
function ArchiveButton({ record, onClick }) {
  return (
    <button
      className="portal-icon-button"
      title={record.archived_at ? "Restaurar registro" : "Archivar registro"}
      aria-label={
        record.archived_at ? "Restaurar registro" : "Archivar registro"
      }
      onClick={onClick}
    >
      {record.archived_at ? <RotateCcw size={16} /> : <Archive size={16} />}
    </button>
  );
}

function Detail({ item, data, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const node = dialog.current;
    node.showModal();
    return () => node.close();
  }, []);
  const inspections = data.inspections
    .filter((r) => r.asset_id === item.id)
    .sort((a, b) => b.checked_on.localeCompare(a.checked_on));
  return (
    <dialog
      className="portal-dialog"
      ref={dialog}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-labelledby="portal-detail-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="portal-dialog-inner">
        <header>
          <div>
            <span className="portal-eyebrow">HISTORIAL Y DETALLES</span>
            <h2 id="portal-detail-title">{item.name || item.title}</h2>
          </div>
          <button
            className="portal-icon-button"
            aria-label="Cerrar detalles"
            onClick={onClose}
          >
            <X />
          </button>
        </header>
        <div className="portal-detail-body">
          <Badge value={item.status || item.kind} />
          <p>{item.location || item.address}</p>
          {item.serial_number && (
            <p>
              Serie: {item.serial_number} ·{" "}
              {[item.manufacturer, item.model].filter(Boolean).join(" ")}
            </p>
          )}
          {item.notes && <p>{item.notes}</p>}
          {item.report && <div className="portal-alert">{item.report}</div>}
          {item.starts_at && (
            <p>
              {formatDate(item.starts_at, true)} ·{" "}
              {item.responsible || "Responsable por asignar"}
            </p>
          )}
          {item.kind &&
            ["dea", "kit", "exit", "extinguisher", "other"].includes(
              item.kind,
            ) && (
              <>
                <h3>Revisiones realizadas</h3>
                {!inspections.length ? (
                  <Empty text="Sin revisiones registradas." />
                ) : (
                  inspections.map((row) => (
                    <article key={row.id} className="portal-review">
                      <div>
                        <strong>{formatDate(row.checked_on)}</strong>
                        <Badge value={row.result} />
                      </div>
                      <p>{row.checked_by}</p>
                      <ul>
                        {(row.checklist || []).map((check, index) => (
                          <li key={index}>
                            {check.ok ? <Check size={15} /> : <X size={15} />}{" "}
                            {check.text}
                          </li>
                        ))}
                      </ul>
                      <p>{row.notes}</p>
                      <small>
                        Próxima revisión: {formatDate(row.next_review_on)}
                      </small>
                    </article>
                  ))
                )}
              </>
            )}
        </div>
      </div>
    </dialog>
  );
}

function Summary({ data, institution, onGo, onDetail, isAdmin }) {
  const assets = activeRows(data.assets),
    activities = activeRows(data.activities),
    documents = activeRows(data.documents);
  const alerts = assets.flatMap((asset) =>
    assetAlerts(asset).map((alert) => ({ ...alert, asset })),
  );
  const upcoming = activities
    .filter((r) => ["planned", "confirmed"].includes(r.status))
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  const attention = assets.filter(
    (a) =>
      a.status !== "operational" ||
      assetAlerts(a).some((alert) => alert.state === "overdue"),
  );
  const stats = [
    ["Próximas actividades", upcoming.length, CalendarDays, "calendario"],
    ["Equipos registrados", assets.length, HeartPulse, "equipamiento"],
    ["Requieren seguimiento", attention.length, ClipboardCheck, "equipamiento"],
    [
      "Certificados disponibles",
      documents.filter((d) => d.kind === "certificate").length,
      FileBadge,
      "documentos",
    ],
  ];
  return (
    <>
      <div className="portal-welcome">
        <div>
          <span className="portal-eyebrow">
            {isAdmin ? "ACOMPAÑAMIENTO GRCP" : "TU ESPACIO CON GRCP"}
          </span>
          <h2>
            Prepararnos es
            <br />
            <em>un trabajo compartido.</em>
          </h2>
          <p>
            {institution?.name ||
              "Comenzá registrando una institución para organizar su seguimiento."}
          </p>
        </div>
        <div className="portal-welcome-symbol">
          <ShieldCheck size={60} />
          <span>Planificar. Practicar. Cuidar.</span>
        </div>
      </div>
      <div className="portal-stats">
        {stats.map(([title, value, Icon, target]) => (
          <button key={title} onClick={() => onGo(target)}>
            <span>
              <Icon size={19} />
              <ArrowRight size={15} />
            </span>
            <strong>{value}</strong>
            <small>{title}</small>
          </button>
        ))}
      </div>
      <div className="portal-summary-grid">
        <section className="portal-card">
          <div className="portal-card-heading">
            <div>
              <span className="portal-eyebrow">EN AGENDA</span>
              <h3>Próximos pasos</h3>
            </div>
            <button
              onClick={() => onGo("calendario")}
              className="portal-text-button"
            >
              Ver calendario <ArrowRight size={15} />
            </button>
          </div>
          {upcoming.length ? (
            upcoming.slice(0, 4).map((row) => (
              <button
                className="portal-agenda-row"
                key={row.id}
                onClick={() => onDetail(row)}
              >
                <span className="portal-date-box">
                  <b>{new Date(row.starts_at).getDate()}</b>
                  <small>
                    {new Intl.DateTimeFormat("es-AR", {
                      month: "short",
                    }).format(new Date(row.starts_at))}
                  </small>
                </span>
                <span>
                  <strong>{row.title}</strong>
                  <small>
                    {label(row.kind)} · {formatDate(row.starts_at, true)}
                  </small>
                </span>
                <Badge value={row.status} />
              </button>
            ))
          ) : (
            <Empty text="Sin próximas actividades." />
          )}
        </section>
        <section className="portal-card">
          <div className="portal-card-heading">
            <div>
              <span className="portal-eyebrow">SEGUIMIENTO</span>
              <h3>Fechas que cuidar</h3>
            </div>
            <Bell size={20} />
          </div>
          <p className="portal-muted">
            Revisiones y vencimientos registrados para los próximos 30 días o ya
            vencidos.
          </p>
          {alerts.length ? (
            <div className="portal-alert-list">
              {alerts.slice(0, 5).map((row) => (
                <button
                  key={`${row.asset.id}-${row.key}`}
                  onClick={() => onDetail(row.asset)}
                >
                  <span className={`portal-alert-dot ${row.state}`} />
                  <span>
                    <strong>{row.asset.name}</strong>
                    <small>
                      {row.name} · {formatDate(row.date)}
                    </small>
                  </span>
                  <span className={`portal-badge ${row.state}`}>
                    {row.state === "overdue" ? "Vencido" : "Próximo"}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="portal-clear">
              <Check size={18} />
              Sin fechas pendientes en este período.
            </p>
          )}
        </section>
      </div>
      <div className="portal-summary-grid">
        <section className="portal-card">
          <div className="portal-card-heading">
            <h3>Tu institución</h3>
            <Building2 size={19} />
          </div>
          <dl className="portal-profile">
            <div>
              <dt>Contacto</dt>
              <dd>{institution?.contact_name || "Sin registrar"}</dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd>{institution?.contact_email || "Sin registrar"}</dd>
            </div>
            <div>
              <dt>Ubicación</dt>
              <dd>
                {[institution?.city, institution?.province]
                  .filter(Boolean)
                  .join(", ") || "Sin registrar"}
              </dd>
            </div>
            <div>
              <dt>Sedes</dt>
              <dd>{activeRows(data.sites).length}</dd>
            </div>
          </dl>
        </section>
        <section className="portal-card portal-contact-card">
          <MessageSquare size={25} />
          <h3>Seguimos en contacto</h3>
          <p>
            Solicitá una capacitación, coordiná una revisión o compartí una
            observación con GRCP.
          </p>
          <button className="portal-button" onClick={() => onGo("solicitudes")}>
            Ver solicitudes <ArrowRight size={16} />
          </button>
        </section>
      </div>
    </>
  );
}

function Calendar({ rows, isAdmin, onEdit, onDetail, onArchive }) {
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selected, setSelected] = useState(""),
    [mode, setMode] = useState("month");
  const start = new Date(month);
  start.setDate(1 - ((start.getDay() + 6) % 7));
  const days = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });
  const inMonth = rows.filter(
    (row) =>
      new Date(row.starts_at).getMonth() === month.getMonth() &&
      new Date(row.starts_at).getFullYear() === month.getFullYear(),
  );
  const visible = (
    selected
      ? rows.filter((row) => localDate(new Date(row.starts_at)) === selected)
      : inMonth
  ).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  return (
    <>
      <div className="portal-calendar-toolbar">
        <div>
          <button
            className="portal-icon-button"
            aria-label="Mes anterior"
            onClick={() => {
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
              setSelected("");
            }}
          >
            <ChevronLeft />
          </button>
          <h2>
            {new Intl.DateTimeFormat("es-AR", {
              month: "long",
              year: "numeric",
            }).format(month)}
          </h2>
          <button
            className="portal-icon-button"
            aria-label="Mes siguiente"
            onClick={() => {
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
              setSelected("");
            }}
          >
            <ChevronRight />
          </button>
        </div>
        <div>
          <button
            className="portal-button"
            onClick={() => {
              setMonth(
                new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              );
              setSelected("");
            }}
          >
            Este mes
          </button>
          <button
            className="portal-button"
            onClick={() => setMode(mode === "month" ? "agenda" : "month")}
          >
            {mode === "month" ? "Ver agenda" : "Ver mes"}
          </button>
        </div>
      </div>
      {mode === "month" && (
        <div className="portal-calendar">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
            <span className="portal-calendar-weekday" key={day}>
              {day}
            </span>
          ))}
          {days.map((day) => {
            const key = localDate(day),
              items = rows.filter(
                (row) => localDate(new Date(row.starts_at)) === key,
              );
            return (
              <button
                key={key}
                className={`portal-calendar-day ${day.getMonth() !== month.getMonth() ? "outside" : ""} ${selected === key ? "selected" : ""} ${key === localDate() ? "today" : ""}`}
                aria-label={`${formatDate(key)}: ${items.length} actividades`}
                aria-pressed={selected === key}
                onClick={() => setSelected(selected === key ? "" : key)}
              >
                <b>{day.getDate()}</b>
                {items.slice(0, 2).map((row) => (
                  <span className={row.kind} key={row.id}>
                    {row.title}
                  </span>
                ))}
                {items.length > 2 && <small>+{items.length - 2} más</small>}
              </button>
            );
          })}
        </div>
      )}
      <div className="portal-section-label">
        <h3>{selected ? formatDate(selected) : "Actividades del mes"}</h3>
        {selected && (
          <button
            onClick={() => setSelected("")}
            className="portal-text-button"
          >
            Ver todo el mes
          </button>
        )}
      </div>
      {visible.length ? (
        <div className="portal-activity-list">
          {visible.map((row) => (
            <article
              className={`portal-card portal-activity ${row.archived_at ? "archived" : ""}`}
              key={row.id}
            >
              <span className={`portal-type-icon ${row.kind}`}>
                <CalendarDays size={22} />
              </span>
              <div>
                <div className="portal-row-heading">
                  <h3>{row.title}</h3>
                  <Badge value={row.status} />
                </div>
                <p>
                  {formatDate(row.starts_at, true)}
                  {row.ends_at
                    ? ` · hasta ${new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" }).format(new Date(row.ends_at))}`
                    : ""}
                </p>
                <small>
                  {label(row.kind)} ·{" "}
                  {row.responsible || "Responsable por asignar"}
                  {row.repeat_months
                    ? ` · Cada ${row.repeat_months} meses`
                    : ""}
                </small>
              </div>
              <div className="portal-row-actions">
                <button
                  className="portal-text-button"
                  onClick={() => onDetail(row)}
                >
                  Detalles
                </button>
                {isAdmin && (
                  <>
                    <EditButton
                      title={`Editar ${row.title}`}
                      onClick={() => onEdit("activities", row)}
                    />
                    <ArchiveButton
                      record={row}
                      onClick={() => onArchive("activities", row)}
                    />
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty text="Sin actividades en este período." />
      )}
    </>
  );
}

function Training({ data, isAdmin, onEdit, onGo }) {
  const courses = activeRows(data.activities)
    .filter((row) => row.kind === "training")
    .sort((a, b) => b.starts_at.localeCompare(a.starts_at));
  const [chosen, setChosen] = useState("");
  const current = courses.find((row) => row.id === chosen) || courses[0];
  const people = data.participants.filter(
    (row) => row.activity_id === current?.id,
  );
  return !courses.length ? (
    <Empty text="Todavía no hay capacitaciones." />
  ) : (
    <>
      <div className="portal-training-grid">
        <section className="portal-card">
          <h3>Jornadas de capacitación</h3>
          <div className="portal-course-list">
            {courses.map((row) => (
              <button
                key={row.id}
                className={current?.id === row.id ? "selected" : ""}
                onClick={() => setChosen(row.id)}
              >
                <GraduationCap size={20} />
                <span>
                  <strong>{row.title}</strong>
                  <small>{formatDate(row.starts_at)}</small>
                </span>
                <Badge value={row.status} />
              </button>
            ))}
          </div>
        </section>
        <section className="portal-card">
          <div className="portal-card-heading">
            <div>
              <span className="portal-eyebrow">CAPACITACIÓN SELECCIONADA</span>
              <h3>{current.title}</h3>
            </div>
            {isAdmin && (
              <EditButton onClick={() => onEdit("activities", current)} />
            )}
          </div>
          <p>
            {formatDate(current.starts_at, true)} ·{" "}
            {current.responsible || "Responsable por asignar"}
          </p>
          <p className="portal-muted">
            {current.notes || "Sin detalles adicionales."}
          </p>
          <div className="portal-training-stats">
            <span>
              <strong>{people.length}</strong> participantes
            </span>
            <span>
              <strong>
                {people.filter((p) => p.attendance === "attended").length}
              </strong>{" "}
              asistencias
            </span>
            <span>
              <strong>
                {
                  activeRows(data.documents).filter(
                    (d) =>
                      d.activity_id === current.id && d.kind === "certificate",
                  ).length
                }
              </strong>{" "}
              certificados
            </span>
          </div>
          <div className="portal-row-actions">
            {isAdmin && (
              <button
                className="portal-button"
                onClick={() =>
                  onEdit("participants", { activity_id: current.id })
                }
              >
                <Plus size={16} />
                Agregar participante
              </button>
            )}
            <button
              className="portal-text-button"
              onClick={() => onGo("documentos")}
            >
              Ver documentos <ArrowRight size={15} />
            </button>
          </div>
        </section>
      </div>
      <section className="portal-card">
        <div className="portal-card-heading">
          <h3>Participantes y asistencia</h3>
          <span className="portal-muted">{people.length} personas</span>
        </div>
        {people.length ? (
          <div className="portal-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Participante</th>
                  <th>Correo</th>
                  <th>Asistencia</th>
                  {isAdmin && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {people.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.full_name}</strong>
                    </td>
                    <td>{row.email || "—"}</td>
                    <td>
                      <Badge value={row.attendance} />
                    </td>
                    {isAdmin && (
                      <td>
                        <EditButton
                          title={`Editar ${row.full_name}`}
                          onClick={() => onEdit("participants", row)}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty text="Sin participantes registrados." />
        )}
      </section>
    </>
  );
}

export default function Portal() {
  const [params, setParams] = useSearchParams();
  const demo = params.get("demo") === "1";
  const navigate = useNavigate(),
    { "*": section } = useParams();
  const portal = usePortal(demo);
  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);
  const [compact, setCompact] = useState(
    () => window.matchMedia("(max-width: 950px)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(max-width: 950px)");
    const change = () => setCompact(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  const [institutionId, setInstitutionId] = useState(""),
    [search, setSearch] = useState(""),
    [archived, setArchived] = useState(false),
    [editor, setEditor] = useState(null),
    [detail, setDetail] = useState(null),
    [menu, setMenu] = useState(false),
    [notice, setNotice] = useState(""),
    [failure, setFailure] = useState(""),
    [busy, setBusy] = useState(false),
    [documentKind, setDocumentKind] = useState("all");
  const isAdmin = Boolean(portal.context?.is_admin);
  const institutions = useMemo(
    () =>
      portal.data?.institutions.filter(
        (row) =>
          isAdmin ||
          (!row.archived_at &&
            row.status === "active" &&
            (!demo || row.id === "demo-school")),
      ) || [],
    [portal.data, isAdmin, demo],
  );
  const institution =
    institutions.find((row) => row.id === institutionId) ||
    institutions.find((row) => !row.archived_at) ||
    institutions[0];
  const tenant = institution?.id;
  const data = useMemo(
    () =>
      portal.data
        ? Object.fromEntries(
            Object.entries(portal.data).map(([key, rows]) => [
              key,
              key === "institutions"
                ? rows
                : rows.filter((row) => row.institution_id === tenant),
            ]),
          )
        : null,
    [portal.data, tenant],
  );
  const module =
    MODULES.find(
      (row) => row[0] === (section || "resumen") && (!row[3] || isAdmin),
    ) || MODULES[0];
  const tab = module[0];
  const membership = data?.memberships.find(
    (row) => row.email === portal.context?.email && row.active,
  );
  const canRequest = isAdmin || membership?.role === "manager" || demo;
  useEffect(() => {
    setSearch("");
    setMenu(false);
    setArchived(false);
    setFailure("");
    setNotice("");
    setDetail(null);
    setEditor(null);
  }, [section, tenant, demo, isAdmin]);
  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebarRef.current?.querySelector("nav a.active")?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setMenu(false);
        return;
      }
      if (event.key !== "Tab") return;
      const controls = [
        ...sidebarRef.current.querySelectorAll("a,button"),
      ].filter((node) => node.getClientRects().length && !node.disabled);
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const media = window.matchMedia("(min-width: 951px)");
    const handleResize = () => {
      if (media.matches) setMenu(false);
    };
    document.addEventListener("keydown", handleKey);
    media.addEventListener("change", handleResize);
    const button = menuButtonRef.current;
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handleKey);
      media.removeEventListener("change", handleResize);
      button?.focus();
    };
  }, [menu]);
  const go = (key) => navigate(`/Portal/${key}${demo ? "?demo=1" : ""}`);
  async function perform(operation, message) {
    setFailure("");
    setNotice("");
    setBusy(true);
    try {
      await operation();
      setNotice(message);
    } catch (error) {
      setFailure(portalError(error));
    } finally {
      setBusy(false);
    }
  }
  function edit(entity, record) {
    setEditor({ entity, record: record || {} });
  }
  async function archive(entity, record) {
    await perform(
      () =>
        portal.save(
          entity,
          { archived_at: record.archived_at ? null : new Date().toISOString() },
          record.id,
        ),
      record.archived_at
        ? "Registro restaurado."
        : "Registro archivado. Podés restaurarlo desde la vista de archivados.",
    );
  }
  async function download(document) {
    if (demo && !document.demoFile) {
      setNotice(
        "Este certificado es un ejemplo. Los archivos reales se descargan al cargar documentos en el portal.",
      );
      return;
    }
    await perform(async () => {
      if (demo) {
        const url = URL.createObjectURL(document.demoFile);
        const a = window.document.createElement("a");
        a.href = url;
        a.download = document.file_name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else await downloadPortalDocument(document);
    }, "Documento descargado.");
  }
  if (!demo && (!portal.session || portal.recovery))
    return (
      <PortalLogin
        recovery={portal.recovery}
        onRecovered={() => portal.setRecovery(false)}
        onDemo={() => setParams({ demo: "1" })}
      />
    );
  if (!portal.data || !portal.context)
    return (
      <div className="portal-state-page">
        <HeartPulse size={38} />
        <h1>
          {portal.loading
            ? "Abriendo tu portal…"
            : "El portal necesita activarse"}
        </h1>
        <p role={portal.error ? "alert" : "status"}>
          {portal.error ||
            "Estamos consultando tus permisos y la información disponible."}
        </p>
        {!portal.loading && (
          <div className="portal-row-actions">
            <button className="portal-button" onClick={portal.reload}>
              Reintentar
            </button>
            <button
              className="portal-button"
              onClick={() => setParams({ demo: "1" })}
            >
              Ver demostración
            </button>
            <button
              className="portal-text-button"
              onClick={() => supabase?.auth.signOut()}
            >
              Cerrar sesión
            </button>
          </div>
        )}
        <Link to="/">Volver al sitio</Link>
      </div>
    );
  const list = (key) =>
    matchSearch(
      (key === "institutions" ? institutions : data[key] || []).filter((row) =>
        archived ? Boolean(row.archived_at) : !row.archived_at,
      ),
      search,
    );
  const hasArchive = [
    "instituciones",
    "calendario",
    "sedes",
    "equipamiento",
    "documentos",
  ].includes(tab);
  const allowAdd =
    (isAdmin && Boolean(ENTITY[tab]) && (tab === "instituciones" || tenant)) ||
    (tab === "solicitudes" && canRequest && tenant);
  const scopedForEditor = {
    ...data,
    sites: activeRows(data.sites),
    assets: activeRows(data.assets),
    activities: activeRows(data.activities),
  };
  function exportData(calendar = false) {
    const entity = ENTITY[tab];
    const rows = list(entity).filter(
      (row) =>
        tab !== "documentos" ||
        documentKind === "all" ||
        row.kind === documentKind,
    );
    downloadPortalExport(
      calendar ? portalCalendarIcs(rows) : portalCsv(entity, rows, data),
      calendar ? "calendario-grcp.ics" : `${entity}-grcp.csv`,
      calendar ? "text/calendar;charset=utf-8" : undefined,
    );
    setNotice(
      calendar
        ? "Calendario exportado para importar en tu agenda."
        : "Archivo CSV exportado.",
    );
  }
  return (
    <div className="portal-app">
      {menu && (
        <button
          className="portal-sidebar-backdrop"
          aria-label="Cerrar navegación del portal"
          onClick={() => setMenu(false)}
        />
      )}
      <aside
        ref={sidebarRef}
        id="portal-navigation"
        role={menu ? "dialog" : undefined}
        aria-modal={menu || undefined}
        aria-hidden={(compact && !menu) || undefined}
        inert={compact && !menu ? "" : undefined}
        aria-label="Navegación institucional"
        className={`portal-sidebar ${menu ? "open" : ""}`}
      >
        <Link to={`/Portal${demo ? "?demo=1" : ""}`} className="portal-brand">
          <HeartPulse />
          <strong>
            GRCP <span>Instituciones</span>
          </strong>
        </Link>
        <button
          className="portal-sidebar-close portal-icon-button"
          aria-label="Cerrar menú"
          onClick={() => setMenu(false)}
        >
          <X />
        </button>
        <div className="portal-workspace">
          <span>{isAdmin ? "GESTIÓN GRCP" : "ESPACIO INSTITUCIONAL"}</span>
          <strong>{institution?.name || "Sin instituciones"}</strong>
          <small>
            <span className="portal-online-dot" />
            {demo
              ? "Demostración"
              : isAdmin
                ? "Administrador general"
                : "Acceso privado"}
          </small>
        </div>
        <nav aria-label="Navegación del portal">
          {MODULES.filter((row) => !row[3] || isAdmin).map(
            ([key, title, Icon]) => (
              <NavLink
                key={key}
                to={`/Portal/${key}${demo ? "?demo=1" : ""}`}
                className={tab === key ? "active" : ""}
                onClick={() => setMenu(false)}
              >
                <Icon size={18} />
                {title}
                {key === "solicitudes" &&
                  data.requests.some((row) => row.status !== "resolved") && (
                    <span className="portal-nav-count">
                      {
                        data.requests.filter((row) => row.status !== "resolved")
                          .length
                      }
                    </span>
                  )}
              </NavLink>
            ),
          )}
        </nav>
        <div className="portal-sidebar-bottom">
          <Link to="/">
            <ArrowLeft size={16} />
            Volver al sitio
          </Link>
          {isAdmin && (
            <Link to="/PanelDEA">
              <MapPin size={16} />
              Gestionar mapa DEA
            </Link>
          )}
          <button
            disabled={busy}
            onClick={() =>
              demo
                ? setParams({})
                : perform(() => supabase.auth.signOut(), "Sesión cerrada.")
            }
          >
            <LogOut size={16} />
            {demo ? "Salir de la demostración" : "Cerrar sesión"}
          </button>
          <small>GRCP Argentina · Preparación para cuidar.</small>
        </div>
      </aside>
      <div className="portal-main" inert={menu ? "" : undefined}>
        <header className="portal-topbar">
          <div>
            <button
              className="portal-mobile-menu portal-icon-button"
              ref={menuButtonRef}
              aria-label="Abrir navegación del portal"
              aria-controls="portal-navigation"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <Menu />
            </button>
            <span>
              Portal institucional <ChevronRight size={14} />
              <strong>{module[1]}</strong>
            </span>
          </div>
          <div>
            {institutions.length > 0 && (
              <label className="portal-institution-select">
                <Building2 size={16} />
                <select
                  aria-label="Institución seleccionada"
                  value={tenant || ""}
                  onChange={(e) => setInstitutionId(e.target.value)}
                >
                  {institutions.map((row) => (
                    <option value={row.id} key={row.id}>
                      {row.name}
                      {row.archived_at ? " · Archivada" : ""}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <button
              className="portal-icon-button"
              aria-label="Actualizar información"
              disabled={busy || portal.loading || demo}
              onClick={portal.reload}
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </header>
        {demo && (
          <div className="portal-demo-banner">
            <span>
              <ShieldCheck size={16} />
              <strong>Demostración</strong> · Datos ficticios. Los cambios duran
              esta visita.
            </span>
            <button onClick={() => portal.setDemoAdmin(!portal.demoAdmin)}>
              {isAdmin ? "Ver como institución" : "Ver como GRCP"}
              <ArrowRight size={14} />
            </button>
          </div>
        )}
        <div className="portal-content">
          <div className="portal-page-heading">
            <div>
              <span className="portal-eyebrow">
                {isAdmin
                  ? "GESTIÓN Y ACOMPAÑAMIENTO"
                  : institution?.name || "INSTITUCIÓN"}
              </span>
              <h1>{module[1]}</h1>
              <p>{DESCRIPTIONS[tab]}</p>
            </div>
            {allowAdd && (
              <button
                className="portal-button primary"
                disabled={busy}
                onClick={() =>
                  edit(
                    ENTITY[tab],
                    tab === "capacitaciones" ? { kind: "training" } : {},
                  )
                }
              >
                <Plus size={18} />
                {ADD_LABEL[tab]}
              </button>
            )}
          </div>
          {ENTITY[tab] &&
            tab !== "accesos" &&
            tab !== "capacitaciones" &&
            tenant && (
              <div className="portal-export-actions">
                <button
                  className="portal-text-button"
                  onClick={() => exportData()}
                >
                  <Download size={14} />
                  Exportar CSV
                </button>
                {tab === "calendario" && (
                  <button
                    className="portal-text-button"
                    onClick={() => exportData(true)}
                  >
                    <CalendarDays size={14} />
                    Descargar calendario
                  </button>
                )}
              </div>
            )}
          {failure && (
            <p className="portal-alert error" role="alert">
              {failure}
            </p>
          )}
          {notice && (
            <p className="portal-alert success" role="status">
              {notice}
            </p>
          )}
          {portal.error && (
            <p className="portal-alert error" role="alert">
              {portal.error}
            </p>
          )}
          {institution?.archived_at && (
            <p className="portal-alert">
              Esta institución está archivada. Su historial se conserva y sus
              usuarios no tienen acceso.
            </p>
          )}
          {!tenant && tab !== "instituciones" ? (
            <Empty
              text={
                isAdmin
                  ? "Registrá tu primera institución."
                  : "Tu cuenta todavía no tiene una institución asignada."
              }
            >
              {isAdmin ? (
                <button
                  className="portal-button primary"
                  onClick={() => edit("institutions", {})}
                >
                  Crear institución <Plus size={16} />
                </button>
              ) : (
                <Link to="/Contacto" className="portal-button">
                  Contactar a GRCP
                </Link>
              )}
            </Empty>
          ) : (
            <>
              {!["resumen", "historial", "capacitaciones"].includes(tab) && (
                <div className="portal-list-toolbar">
                  <label className="portal-search">
                    <Search size={17} />
                    <input
                      aria-label={`Buscar en ${module[1]}`}
                      placeholder={`Buscar ${module[1].toLowerCase()}…`}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </label>
                  {tab === "documentos" && (
                    <select
                      aria-label="Tipo de documento"
                      value={documentKind}
                      onChange={(e) => setDocumentKind(e.target.value)}
                    >
                      <option value="all">Todos los documentos</option>
                      {["certificate", "protocol", "report", "other"].map(
                        (value) => (
                          <option key={value} value={value}>
                            {label(value)}
                          </option>
                        ),
                      )}
                    </select>
                  )}
                  {isAdmin && hasArchive && (
                    <label className="portal-archive-filter">
                      <input
                        type="checkbox"
                        checked={archived}
                        onChange={(e) => setArchived(e.target.checked)}
                      />
                      Archivados
                    </label>
                  )}
                </div>
              )}
              {tab === "resumen" && (
                <Summary
                  data={data}
                  institution={institution}
                  isAdmin={isAdmin}
                  onGo={go}
                  onDetail={setDetail}
                />
              )}
              {tab === "instituciones" &&
                (list("institutions").length ? (
                  <div className="portal-institution-grid">
                    {list("institutions").map((row) => (
                      <article key={row.id} className="portal-card">
                        <div className="portal-card-heading">
                          <span className="portal-icon-tile">
                            <Building2 size={22} />
                          </span>
                          <div className="portal-row-actions">
                            <EditButton
                              title={`Editar ${row.name}`}
                              onClick={() => edit("institutions", row)}
                            />
                            <ArchiveButton
                              record={row}
                              onClick={() => archive("institutions", row)}
                            />
                          </div>
                        </div>
                        <Badge value={row.status} />
                        <h3>{row.name}</h3>
                        <p>
                          {label(row.kind)} ·{" "}
                          {row.city || "Localidad sin registrar"}
                        </p>
                        <p className="portal-muted">
                          {row.contact_name || "Sin contacto asignado"}
                        </p>
                        <button
                          className="portal-text-button"
                          onClick={() => {
                            setInstitutionId(row.id);
                            go("resumen");
                          }}
                        >
                          Abrir institución <ArrowRight size={16} />
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <Empty text="Sin instituciones para mostrar." />
                ))}
              {tab === "sedes" &&
                (list("sites").length ? (
                  <div className="portal-institution-grid">
                    {list("sites").map((row) => (
                      <article className="portal-card" key={row.id}>
                        <div className="portal-card-heading">
                          <MapPin size={23} />
                          {isAdmin && (
                            <div className="portal-row-actions">
                              <EditButton onClick={() => edit("sites", row)} />
                              <ArchiveButton
                                record={row}
                                onClick={() => archive("sites", row)}
                              />
                            </div>
                          )}
                        </div>
                        <h3>{row.name}</h3>
                        <p>
                          {[row.address, row.city].filter(Boolean).join(", ") ||
                            "Dirección sin registrar"}
                        </p>
                        <p className="portal-muted">{row.notes}</p>
                        <span className="portal-badge">
                          {
                            activeRows(data.assets).filter(
                              (a) => a.site_id === row.id,
                            ).length
                          }{" "}
                          equipos o elementos
                        </span>
                      </article>
                    ))}
                  </div>
                ) : (
                  <Empty text="Sin sedes registradas." />
                ))}
              {tab === "calendario" && (
                <Calendar
                  rows={list("activities")}
                  isAdmin={isAdmin}
                  onEdit={edit}
                  onDetail={setDetail}
                  onArchive={archive}
                />
              )}
              {tab === "equipamiento" &&
                (list("assets").length ? (
                  <div className="portal-asset-grid">
                    {list("assets").map((row) => (
                      <article className="portal-card" key={row.id}>
                        <div className="portal-card-heading">
                          <span className="portal-type-icon">
                            <HeartPulse size={24} />
                          </span>
                          <Badge value={row.status} />
                        </div>
                        <small className="portal-eyebrow">
                          {label(row.kind)}
                        </small>
                        <h3>{row.name}</h3>
                        <p>
                          {data.sites.find((s) => s.id === row.site_id)?.name ||
                            "Sin sede asignada"}
                          {row.location ? ` · ${row.location}` : ""}
                        </p>
                        <div className="portal-asset-deadline">
                          <ClipboardCheck size={17} />
                          <span>
                            Próxima revisión
                            <strong>{formatDate(row.next_review_on)}</strong>
                          </span>
                          <span
                            className={`portal-alert-dot ${dueState(row.next_review_on)}`}
                          />
                        </div>
                        {assetAlerts(row)
                          .filter((a) => a.key !== "next_review_on")
                          .map((a) => (
                            <p
                              className={`portal-expiry ${a.state}`}
                              key={a.key}
                            >
                              {a.name}: {formatDate(a.date)}
                            </p>
                          ))}
                        <div className="portal-row-actions">
                          <button
                            className="portal-text-button"
                            onClick={() => setDetail(row)}
                          >
                            Ver historial <ArrowRight size={15} />
                          </button>
                          {isAdmin && (
                            <>
                              <EditButton
                                title={`Editar ${row.name}`}
                                onClick={() => edit("assets", row)}
                              />
                              <ArchiveButton
                                record={row}
                                onClick={() => archive("assets", row)}
                              />
                            </>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <Empty text="Sin equipos o elementos registrados." />
                ))}
              {tab === "revisiones" &&
                (list("inspections").length ? (
                  <div className="portal-activity-list">
                    {list("inspections")
                      .sort((a, b) => b.checked_on.localeCompare(a.checked_on))
                      .map((row) => (
                        <article
                          className="portal-card portal-review"
                          key={row.id}
                        >
                          <div className="portal-row-heading">
                            <h3>
                              {data.assets.find((a) => a.id === row.asset_id)
                                ?.name || "Equipo"}
                            </h3>
                            <Badge value={row.result} />
                          </div>
                          <p>
                            {formatDate(row.checked_on)} · {row.checked_by}
                          </p>
                          <ul>
                            {(row.checklist || []).map((check, i) => (
                              <li key={i}>
                                {check.ok ? (
                                  <Check size={16} />
                                ) : (
                                  <X size={16} />
                                )}{" "}
                                {check.text}
                              </li>
                            ))}
                          </ul>
                          <p>{row.notes || "Sin observaciones adicionales."}</p>
                          <div className="portal-row-actions">
                            <small>
                              Próxima revisión: {formatDate(row.next_review_on)}
                            </small>
                            {isAdmin && (
                              <button
                                className="portal-text-button"
                                onClick={() =>
                                  edit("documents", {
                                    kind: "report",
                                    inspection_id: row.id,
                                  })
                                }
                              >
                                Adjuntar informe <Plus size={15} />
                              </button>
                            )}
                          </div>
                        </article>
                      ))}
                  </div>
                ) : (
                  <Empty text="Sin revisiones realizadas." />
                ))}
              {tab === "capacitaciones" && (
                <Training
                  data={data}
                  isAdmin={isAdmin}
                  onEdit={edit}
                  onGo={go}
                />
              )}
              {tab === "documentos" &&
                (list("documents").filter(
                  (d) => documentKind === "all" || d.kind === documentKind,
                ).length ? (
                  <div className="portal-card portal-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Documento</th>
                          <th>Asociado a</th>
                          <th>Emisión</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list("documents")
                          .filter(
                            (d) =>
                              documentKind === "all" || d.kind === documentKind,
                          )
                          .map((row) => (
                            <tr key={row.id}>
                              <td>
                                <div className="portal-document-name">
                                  <FileText size={22} />
                                  <span>
                                    <strong>{row.title}</strong>
                                    <small>
                                      {label(row.kind)} · v{row.version} ·{" "}
                                      {row.file_name}
                                    </small>
                                  </span>
                                </div>
                              </td>
                              <td>
                                {data.participants.find(
                                  (p) => p.id === row.participant_id,
                                )?.full_name ||
                                  data.activities.find(
                                    (a) => a.id === row.activity_id,
                                  )?.title ||
                                  "Institución"}
                              </td>
                              <td>
                                {formatDate(row.issued_on)}
                                {row.expires_on && (
                                  <small>
                                    Vence: {formatDate(row.expires_on)}
                                  </small>
                                )}
                              </td>
                              <td>
                                <div className="portal-row-actions">
                                  <button
                                    className="portal-icon-button"
                                    title="Descargar documento"
                                    aria-label={`Descargar ${row.title}`}
                                    disabled={busy || Boolean(row.archived_at)}
                                    onClick={() => download(row)}
                                  >
                                    <Download size={17} />
                                  </button>
                                  {isAdmin && (
                                    <ArchiveButton
                                      record={row}
                                      onClick={() => archive("documents", row)}
                                    />
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Empty text="Sin documentos para mostrar." />
                ))}
              {tab === "solicitudes" && (
                <>
                  {!canRequest && (
                    <p className="portal-alert">
                      Tu cuenta tiene permiso de consulta. El responsable de la
                      institución puede crear solicitudes.
                    </p>
                  )}
                  {list("requests").length ? (
                    <div className="portal-activity-list">
                      {list("requests")
                        .sort((a, b) =>
                          b.created_at.localeCompare(a.created_at),
                        )
                        .map((row) => (
                          <article
                            className="portal-card portal-request"
                            key={row.id}
                          >
                            <div className="portal-row-heading">
                              <h3>{row.title}</h3>
                              <Badge value={row.status} />
                            </div>
                            <small>
                              {label(row.kind)} ·{" "}
                              {formatDate(row.created_at, true)}
                            </small>
                            <p>{row.body}</p>
                            {row.response && (
                              <div className="portal-response">
                                <strong>Respuesta de GRCP</strong>
                                <p>{row.response}</p>
                              </div>
                            )}
                            {isAdmin && (
                              <button
                                className="portal-text-button"
                                onClick={() => edit("requests", row)}
                              >
                                Responder y actualizar <Pencil size={15} />
                              </button>
                            )}
                          </article>
                        ))}
                    </div>
                  ) : (
                    <Empty text="Todavía no hay solicitudes." />
                  )}
                </>
              )}
              {tab === "accesos" && (
                <>
                  <p className="portal-alert">
                    Los responsables pueden consultar información y crear
                    solicitudes. Las cuentas de consulta solo pueden leer y
                    descargar documentos. GRCP administra las revisiones y los
                    certificados.
                  </p>
                  {list("memberships").length ? (
                    <div className="portal-card portal-table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Correo</th>
                            <th>Permiso</th>
                            <th>Acceso</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {list("memberships").map((row) => (
                            <tr key={row.id}>
                              <td>{row.email}</td>
                              <td>{label(row.role)}</td>
                              <td>
                                <span
                                  className={`portal-badge ${row.active ? "active" : "paused"}`}
                                >
                                  {row.active ? "Habilitado" : "Deshabilitado"}
                                </span>
                              </td>
                              <td>
                                <div className="portal-row-actions">
                                  <EditButton
                                    title={`Editar acceso de ${row.email}`}
                                    onClick={() => edit("memberships", row)}
                                  />
                                  <button
                                    className="portal-text-button"
                                    disabled={busy || !row.active}
                                    onClick={() =>
                                      demo
                                        ? setNotice(
                                            "En la demostración no se envían correos.",
                                          )
                                        : perform(
                                            () => invitePortalMember(row.id),
                                            "Invitación enviada. La persona podrá elegir su contraseña.",
                                          )
                                    }
                                  >
                                    Enviar invitación <ArrowRight size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <Empty text="Sin usuarios asignados." />
                  )}
                  <p className="portal-muted portal-access-help">
                    Después de asignar el correo, enviá la invitación para que
                    la persona prepare su contraseña. También podés crear o
                    invitar la cuenta desde Supabase Auth. El enlace de acceso
                    debe apuntar a /Portal.
                  </p>
                </>
              )}
              {tab === "historial" &&
                (data.audit.length ? (
                  <div className="portal-card portal-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Registro</th>
                          <th>Acción</th>
                          <th>Responsable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.audit.map((row) => (
                          <tr key={row.id}>
                            <td>{formatDate(row.happened_at, true)}</td>
                            <td>
                              <strong>
                                {row.after_data?.name ||
                                  row.after_data?.title ||
                                  row.after_data?.full_name ||
                                  row.after_data?.email ||
                                  "Registro"}
                              </strong>
                              <small>{row.entity.replace("portal_", "")}</small>
                            </td>
                            <td>
                              {row.action === "INSERT"
                                ? "Creación"
                                : "Actualización"}
                            </td>
                            <td>
                              {row.actor_id
                                ? `${row.actor_id.slice(0, 8)}…`
                                : "Sistema"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Empty text="Todavía no hay cambios registrados." />
                ))}
            </>
          )}
          <footer className="portal-content-footer">
            <span>
              <ShieldCheck size={14} />
              Información privada de la institución.
            </span>
            <span>
              El estado de los equipos refleja los registros cargados y requiere
              seguimiento del responsable.
            </span>
          </footer>
        </div>
      </div>
      {editor && (
        <PortalEditor
          key={`${editor.entity}-${editor.record?.id || "new"}`}
          entity={editor.entity}
          record={editor.record}
          data={scopedForEditor}
          institutionId={tenant}
          onClose={() => setEditor(null)}
          onSave={async (...args) => {
            await portal.save(...args);
            setNotice(
              demo
                ? "Registro actualizado en la demostración."
                : "Registro guardado.",
            );
          }}
        />
      )}
      {detail && (
        <Detail item={detail} data={data} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}
