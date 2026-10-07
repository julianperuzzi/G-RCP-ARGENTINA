import { useSyncExternalStore } from 'react';
import { deaLocation } from '../lib/deaLocation';

export default function useDeaLocation() {
  const snapshot = useSyncExternalStore(deaLocation.subscribe, deaLocation.getSnapshot, deaLocation.getSnapshot);
  return { ...snapshot, requestLocation: deaLocation.requestLocation, setOrigin: deaLocation.setOrigin, clearOrigin: deaLocation.clearOrigin };
}
