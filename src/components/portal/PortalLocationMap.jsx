/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapPin, LocateFixed, ArrowUpRight, Pencil } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { coordinatesOf, groupNearbyLocations, institutionLocations } from "../../lib/portalLocations";

const center = [-31.5375, -68.5364];
const markerIcon = (rows, selected) => L.divIcon({
  className: `portal-location-pin ${rows.length > 1 ? 'cluster' : rows[0].entity === 'sites' ? 'site' : ''} ${selected ? 'selected' : ''}`,
  html: `<span aria-hidden="true">${rows.length > 1 ? rows.length : ''}</span>`,
  iconSize: [30, 30], iconAnchor: [15, 15],
});

function MapCanvas({ records, selected, onSelect, onPick, resetKey = 0 }) {
  const host = useRef(null), map = useRef(null), layer = useRef(null);
  const actions = useRef({ onSelect, onPick });
  actions.current = { onSelect, onPick };
  const [tileError, setTileError] = useState(false);
  useEffect(() => {
    const instance = L.map(host.current, { center, zoom: 12, scrollWheelZoom: false });
    map.current = instance;
    const tiles = L.tileLayer(import.meta.env.VITE_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
    }).addTo(instance);
    tiles.on("tileerror", () => setTileError(true));
    layer.current = L.layerGroup().addTo(instance);
    instance.on("click", (e) => actions.current.onPick?.({ latitude: Number(e.latlng.lat.toFixed(6)), longitude: Number(e.latlng.lng.toFixed(6)) }));
    const observer = new ResizeObserver(() => instance.invalidateSize());
    observer.observe(host.current);
    return () => { observer.disconnect(); instance.remove(); map.current = null; };
  }, []);
  useEffect(() => {
    const instance = map.current;
    layer.current.clearLayers();
    for (const group of groupNearbyLocations(records)) {
      const row = group.rows[0];
      const clustered = group.rows.length > 1;
      const title = clustered ? `${group.rows.length} ubicaciones cercanas` : row.name || 'Ubicación seleccionada';
      const marker = L.marker([group.latitude, group.longitude], {
        icon: markerIcon(group.rows, group.rows.some((item) => item.mapId === selected?.mapId)),
        draggable: Boolean(onPick) && !clustered, title,
        alt: title, riseOnHover: true,
      }).addTo(layer.current);
      if (clustered) {
        const popup = document.createElement('div');
        popup.className = 'portal-map-cluster-list';
        const heading = document.createElement('strong');
        heading.textContent = `${group.rows.length} ubicaciones cercanas`;
        popup.append(heading);
        for (const item of group.rows) {
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = `${item.entity === 'sites' ? 'Sede' : 'Institución'} · ${item.name}`;
          button.addEventListener('click', () => {
            actions.current.onSelect?.(item);
            marker.closePopup();
          });
          popup.append(button);
        }
        marker.bindPopup(popup);
      } else {
        const tooltip = document.createElement('span');
        tooltip.textContent = title;
        marker.bindTooltip(tooltip);
        marker.on('click', () => actions.current.onSelect?.(row));
      }
      marker.on("dragend", () => {
        const p = marker.getLatLng();
        actions.current.onPick?.({ latitude: Number(p.lat.toFixed(6)), longitude: Number(p.lng.toFixed(6)) });
      });
      if (selected?.mapId === row.mapId && !clustered) marker.openTooltip();
    }
    const points = records.map(coordinatesOf).filter(Boolean);
    if (points.length && !onPick) instance.fitBounds(points.map((p) => [p.latitude, p.longitude]), { padding: [35, 35], maxZoom: 14, animate: false });
  }, [records, onPick, resetKey, selected?.mapId]);
  useEffect(() => {
    const point = selected && coordinatesOf(selected);
    if (point) map.current.setView([point.latitude, point.longitude], 16, { animate: false });
  }, [selected]);
  return <div className="portal-map-canvas-wrap">
    <div ref={host} className="portal-map-canvas" role="region" aria-label={onPick ? "Elegir ubicación en el mapa. También se pueden ingresar coordenadas." : "Mapa de instituciones y sedes. Selección disponible en la lista."} />
    {tileError && <p className="portal-form-hint" role="status">No se pudieron cargar algunas imágenes. La lista y las coordenadas siguen disponibles.</p>}
  </div>;
}

export function LocationPicker({ values, onChange }) {
  const selected = useMemo(() => {
    const point = coordinatesOf({ latitude: values.latitude, longitude: values.longitude });
    return point ? { ...point, mapId: "selected", name: "Ubicación seleccionada" } : null;
  }, [values.latitude, values.longitude]);
  const records = useMemo(() => selected ? [selected] : [], [selected]);
  return <section className="portal-location-picker wide">
    <strong><MapPin size={17} /> Ubicación en el mapa</strong>
    <p className="portal-form-hint">Tocá el lugar o arrastrá el marcador. También podés ingresar las coordenadas. La dirección escrita no coloca el punto automáticamente.</p>
    <MapCanvas records={records} selected={selected} onPick={onChange} />
    <div className="portal-location-inputs">
      <label className="portal-field">Latitud<input type="number" step="any" min="-90" max="90" placeholder="-31.5375" value={values.latitude ?? ""} onChange={(e) => onChange({ latitude: e.target.value })} /></label>
      <label className="portal-field">Longitud<input type="number" step="any" min="-180" max="180" placeholder="-68.5364" value={values.longitude ?? ""} onChange={(e) => onChange({ longitude: e.target.value })} /></label>
    </div>
    <button type="button" className="portal-text-button" onClick={() => onChange({ latitude: "", longitude: "" })}>Quitar ubicación</button>
  </section>;
}

export default function InstitutionMap({ institutions, sites, search, onEdit, onOpen }) {
  const [selectedId, setSelectedId] = useState(null), [resetKey, setResetKey] = useState(0), [onlyPending, setOnlyPending] = useState(false);
  const all = useMemo(() => institutionLocations(institutions, sites), [institutions, sites]);
  const rows = useMemo(() => all.filter((row) =>
    (!onlyPending || !coordinatesOf(row)) && [row.name, row.institutionName, row.address, row.city, row.province].join(" ").toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es"))), [all, search, onlyPending]);
  const selected = rows.find((row) => row.mapId === selectedId);
  const located = rows.filter(coordinatesOf).length;
  return <section className="portal-institution-map">
    <div className="portal-map-toolbar">
      <p><strong>{located}</strong> {located === 1 ? "ubicación" : "ubicaciones"} en el mapa · <strong>{rows.length - located}</strong> {rows.length - located === 1 ? "pendiente" : "pendientes"}<small> Los números agrupan puntos cercanos.</small></p>
      <label><input type="checkbox" checked={onlyPending} onChange={(e) => setOnlyPending(e.target.checked)} /> Solo pendientes de ubicar</label>
      <button className="portal-button" onClick={() => { setSelectedId(null); setResetKey((key) => key + 1); }}><LocateFixed size={16} /> Ver todas</button>
    </div>
    <div className="portal-map-layout">
      <MapCanvas records={rows} selected={selected} onSelect={(row) => setSelectedId(row.mapId)} resetKey={resetKey} />
      <div className="portal-map-list" aria-label="Instituciones y sedes">
        {rows.length === 0 && <p className="portal-muted">No hay ubicaciones para este filtro.</p>}
        {rows.map((row) => {
          const point = coordinatesOf(row);
          return <article className={`portal-map-place ${selectedId === row.mapId ? "selected" : ""}`} key={row.mapId}>
            <button className="portal-map-place-select" aria-pressed={selectedId === row.mapId} onClick={() => setSelectedId(row.mapId)}>
              <span className="portal-eyebrow">{row.entity === "sites" ? `SEDE · ${row.institutionName}` : "INSTITUCIÓN"}</span>
              <strong>{row.name}</strong>
              <span>{[row.address, row.city, row.province].filter(Boolean).join(", ") || "Dirección pendiente"}</span>
              {!point && <span className="portal-location-pending">Pendiente de ubicar</span>}
              {row.status === "paused" && <span className="portal-location-pending">Institución pausada</span>}
            </button>
            <div className="portal-row-actions">
              <button className="portal-text-button" onClick={() => onEdit(row.entity, row)}><Pencil size={14} /> {point ? "Editar" : "Ubicar"}</button>
              <button className="portal-text-button" onClick={() => onOpen(row)}>{row.entity === 'sites' ? 'Ver sede' : 'Abrir institución'} <ArrowUpRight size={14} /></button>
              {point && <a className="portal-text-button" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`}>Cómo llegar</a>}
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
