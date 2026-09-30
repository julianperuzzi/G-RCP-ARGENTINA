import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function DeaMap({ records, selected, onSelect, origin, route, resetKey = 0, onPick, initialView }) {
  const hostRef = useRef(null), mapRef = useRef(null), layerRef = useRef(null), originRef = useRef(null), fitted = useRef(false);
  const selectRef = useRef(onSelect), pickRef = useRef(onPick);
  const recordsRef = useRef(records);
  const routeLayerRef = useRef(null);
  const initialViewRef = useRef(initialView);
  const selectedId = selected?.id, selectedLat = selected?.latitude, selectedLng = selected?.longitude;
  const [tileError, setTileError] = useState(false);
  selectRef.current = onSelect; pickRef.current = onPick; recordsRef.current = records;
  useEffect(() => {
    const map = L.map(hostRef.current, { center: initialViewRef.current?.center || [-38.4, -64.2], zoom: initialViewRef.current?.zoom ?? 4, scrollWheelZoom: false, preferCanvas: true });
    mapRef.current = map;
    const tiles = L.tileLayer(import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>' }).addTo(map);
    tiles.on('tileerror', () => setTileError(true));
    layerRef.current = L.layerGroup().addTo(map);
    map.on('click', event => pickRef.current?.({ latitude: Number(event.latlng.lat.toFixed(6)), longitude: Number(event.latlng.lng.toFixed(6)) }));
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
      const bounds = routeLayerRef.current?.getBounds();
      if (bounds?.isValid()) map.fitBounds(bounds, { padding: [35, 35], maxZoom: 17 });
    }); observer.observe(hostRef.current);
    return () => { observer.disconnect(); map.remove(); mapRef.current = null; originRef.current = null; routeLayerRef.current = null; fitted.current = false; };
  }, []);
  useEffect(() => {
    const map = mapRef.current, layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    for (const record of records) {
      const active = selected?.id === record.id;
      const marker = L.circleMarker([record.latitude, record.longitude], { radius: active ? 10 : 7, color: active ? '#142232' : '#fff', weight: active ? 3 : 2, fillColor: record.availability === 'unavailable' ? '#84909a' : '#c74712', fillOpacity: .95 }).addTo(layer);
      const tooltip = document.createElement('span'); tooltip.textContent = record.name; marker.bindTooltip(tooltip);
      marker.on('click', () => selectRef.current?.(record));
    }
    if (!fitted.current && records.length) {
      if (!initialViewRef.current) map.fitBounds(records.map(r => [r.latitude, r.longitude]), { padding: [35, 35], maxZoom: 13 });
      fitted.current = true;
    }
  }, [records, selected?.id]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedId == null) return;
    map.flyTo([selectedLat, selectedLng], 16, { duration: .5 });
  }, [selectedId, selectedLat, selectedLng]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (originRef.current) map.removeLayer(originRef.current);
    if (origin) {
      originRef.current = L.layerGroup([
        L.circle([origin.latitude, origin.longitude], { radius: origin.accuracy || 20, color: '#257aa7', weight: 1, fillOpacity: .08 }),
        L.circleMarker([origin.latitude, origin.longitude], { radius: 7, color: '#fff', weight: 2, fillColor: '#257aa7', fillOpacity: 1 }).bindTooltip('Tu ubicación aproximada'),
      ]).addTo(map);
    }
  }, [origin]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (routeLayerRef.current) { map.removeLayer(routeLayerRef.current); routeLayerRef.current = null; }
    if (!route?.coordinates?.length) return;
    const outline = L.polyline(route.coordinates, { color: '#fff', weight: 9, opacity: .95, interactive: false });
    const line = L.polyline(route.coordinates, { color: '#257aa7', weight: 5, opacity: .95, interactive: false });
    const end = L.circleMarker(route.coordinates.at(-1), { radius: 5, color: '#fff', weight: 2, fillColor: '#257aa7', fillOpacity: 1 }).bindTooltip('Fin de la vía calculada');
    routeLayerRef.current = L.featureGroup([outline, line, end]).addTo(map);
    map.fitBounds(line.getBounds(), { padding: [35, 35], maxZoom: 17 });
  }, [route]);
  useEffect(() => {
    if (resetKey && recordsRef.current.length) mapRef.current?.fitBounds(recordsRef.current.map(r => [r.latitude, r.longitude]), { padding: [35, 35], maxZoom: 13 });
  }, [resetKey]); // Reset is an explicit user action, not a response to every search.
  return <div className="dea-map-shell"><div ref={hostRef} className="dea-leaflet-map" role="region" aria-label={onPick ? 'Mapa para elegir coordenadas del DEA' : 'Mapa de ubicaciones de DEA. También podés elegir un lugar en la lista.'} />{tileError && <p className="dea-tile-warning" role="status">Algunas imágenes del mapa no cargaron. Podés seguir consultando los lugares en la lista.</p>}</div>;
}
DeaMap.propTypes = {
  records: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.shape({ id: PropTypes.string, latitude: PropTypes.number, longitude: PropTypes.number }),
  onSelect: PropTypes.func,
  origin: PropTypes.shape({ latitude: PropTypes.number, longitude: PropTypes.number, accuracy: PropTypes.number }),
  resetKey: PropTypes.number,
  onPick: PropTypes.func,
  route: PropTypes.shape({ coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)) }),
  initialView: PropTypes.shape({ center: PropTypes.arrayOf(PropTypes.number).isRequired, zoom: PropTypes.number.isRequired }),
};
