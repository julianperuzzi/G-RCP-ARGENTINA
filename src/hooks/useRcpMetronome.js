import { useEffect, useState, useSyncExternalStore } from 'react';
import { RcpMetronome } from '../lib/rcpMetronome';

export default function useRcpMetronome() {
  const [metronome] = useState(() => new RcpMetronome());
  const state = useSyncExternalStore(metronome.subscribe, metronome.getSnapshot);
  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) metronome.pause('Pausamos la práctica al salir de la pestaña. Reanudala cuando vuelvas.');
    };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => { document.removeEventListener('visibilitychange', pauseWhenHidden); metronome.dispose(); };
  }, [metronome]);
  return { state, metronome };
}
