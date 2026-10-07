import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, HeartPulse, Lightbulb, LightbulbOff, Maximize2, Minimize2, Minus, Pause, Play, Plus, RotateCcw, Timer, Volume2, VolumeX } from 'lucide-react';
import useRcpMetronome from '../hooks/useRcpMetronome';
import { formatPracticeTime } from '../lib/rcpMetronome';
import './rcp-practice.css';

const durations = [{ value: 60, label: '1 min' }, { value: 120, label: '2 min' }, { value: 300, label: '5 min' }, { value: 0, label: 'Libre' }];
const statusLabels = { idle: 'Listo para empezar', starting: 'Preparando sonido…', countdown: 'Preparate', playing: 'Práctica en curso', paused: 'Práctica pausada', complete: 'Práctica finalizada' };

export default function RCPPractice() {
  const { state, metronome } = useRcpMetronome();
  const [focused, setFocused] = useState(false);
  const workspaceRef = useRef(null), focusButtonRef = useRef(null);
  const active = state.status === 'playing' || state.status === 'countdown';
  const preparing = state.status === 'countdown';
  const noCue = !state.light && (!state.sound || !state.volume || !state.audioAvailable);
  const startLabel = state.status === 'starting' ? 'Preparando…' : preparing ? 'Cancelar cuenta regresiva' : active ? 'Pausar práctica' : state.status === 'paused' ? 'Reanudar práctica' : state.status === 'complete' ? 'Practicar otra vez' : 'Iniciar práctica';
  const help = preparing ? 'El ritmo comienza en tres segundos. Prepará tu posición.' : active ? 'Una marca, una compresión. Seguí una cadencia constante.' : state.status === 'paused' ? 'Tu avance está guardado. Reanudá cuando estés listo.' : state.status === 'complete' ? 'Buen momento para descansar y revisar la técnica.' : 'Prepará el maniquí. Al iniciar, tendrás tres segundos para acomodarte.';
  function togglePractice() { if (active) metronome.pause(); else metronome.start(); }

  useEffect(() => {
    if (!focused) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    focusButtonRef.current?.focus();
    const handleKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); setFocused(false); }
      if (event.key !== 'Tab') return;
      const controls = [...workspaceRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), [tabindex="0"]')].filter(el => el.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleKey); if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true }); };
  }, [focused]);

  return <div className="grcp-practice">
    <div className="grcp-container rcp-practice-container">
      <header className="rcp-practice-intro">
        <div><p className="grcp-eyebrow"><span />PRÁCTICA GUIADA · RCP EN ADULTOS</p><h1>Encontrá el ritmo.<br /><span>Practicá con confianza.</span></h1><p>Un metrónomo con luz y sonido para acompañar tus prácticas de compresiones.</p></div>
        <Link to="/rcp" className="rcp-practice-back"><ArrowLeft size={16} aria-hidden="true" />Repasar la guía de RCP</Link>
      </header>

      <section ref={workspaceRef} className={`rcp-practice-workspace${focused ? ' is-focused' : ''}`} role={focused ? 'dialog' : 'region'} aria-modal={focused || undefined} aria-label="Metrónomo de práctica de RCP">
        <div className="rcp-practice-trainer">
          <div className="rcp-practice-stage" tabIndex={0} aria-label="Indicador de ritmo. Presioná espacio para iniciar o pausar." onKeyDown={event => { if (event.code === 'Space' && event.target === event.currentTarget) { event.preventDefault(); if (state.status !== 'starting' && !noCue) togglePractice(); } }}>
            <div className="rcp-practice-stage-top"><p className={`rcp-practice-status${active ? ' is-active' : ''}`}><span />{statusLabels[state.status]}</p><button ref={focusButtonRef} className="rcp-practice-focus" onClick={() => setFocused(value => !value)} aria-label={focused ? 'Salir del modo enfoque' : 'Abrir modo enfoque'}>{focused ? <Minimize2 size={18} aria-hidden="true" /> : <Maximize2 size={18} aria-hidden="true" />}<span>{focused ? 'Salir del enfoque' : 'Modo enfoque'}</span></button></div>
            <div className="rcp-practice-pulse-area" aria-hidden="true"><div className={`rcp-practice-pulse${state.flash ? ' is-lit' : ''}${preparing ? ' is-counting' : ''}`}><HeartPulse size={24} /><strong>{preparing ? state.countdown : state.bpm}</strong><span>{preparing ? 'PREPARATE' : 'MARCAS / MIN'}</span></div></div>
            <p className="rcp-practice-cue" role="status">{preparing ? 'En unos segundos comenzamos.' : state.status === 'playing' ? state.light && state.sound && state.volume > 0 && state.audioAvailable ? 'Seguí la luz y el sonido.' : state.light ? 'Seguí la señal de luz.' : 'Seguí el sonido.' : state.status === 'complete' ? 'Sesión completa.' : 'Cada señal marca el ritmo.'}</p>
            <dl className="rcp-practice-stats"><div><dt>Tiempo activo</dt><dd>{formatPracticeTime(state.elapsed)}</dd></div><div><dt>Marcas emitidas</dt><dd>{state.beatCount}</dd></div><div><dt>Duración</dt><dd>{state.duration ? formatPracticeTime(state.duration) : 'Libre'}</dd></div></dl>
          </div>
          <div className="rcp-practice-session-controls"><button className="grcp-button grcp-button-primary rcp-practice-start" onClick={togglePractice} disabled={state.status === 'starting' || (noCue && !active)}>{active ? <Pause size={19} aria-hidden="true" /> : <Play size={19} aria-hidden="true" />}{startLabel}</button><button className="rcp-practice-reset" onClick={() => metronome.reset()} disabled={state.status === 'idle'} aria-label="Reiniciar práctica"><RotateCcw size={17} aria-hidden="true" /><span>Reiniciar</span></button></div>
          {state.duration > 0 && <div className="rcp-practice-progress"><div role="progressbar" aria-label="Avance de la práctica" aria-valuemin={0} aria-valuemax={state.duration} aria-valuenow={Math.min(state.elapsed, state.duration)} aria-valuetext={`${formatPracticeTime(state.elapsed)} de ${formatPracticeTime(state.duration)}`}><span style={{ width: `${Math.min(100, state.elapsed / state.duration * 100)}%` }} /></div><span>{state.status === 'complete' ? 'Completada' : `${formatPracticeTime(Math.max(0, state.duration - state.elapsed))} restantes`}</span></div>}
          <p className="rcp-practice-help">{noCue ? 'Activá la luz o el sonido para comenzar.' : help}</p>
          {state.message && <p className="rcp-practice-message" role="status">{state.status === 'complete' && <Check size={16} aria-hidden="true" />}{state.message}</p>}
          {focused && <div className="rcp-practice-focus-tempo" role="group" aria-label="Ajustar ritmo en modo enfoque"><button onClick={() => metronome.configure({ bpm: state.bpm - 1 })} disabled={state.bpm === 100} aria-label="Reducir ritmo"><Minus size={17} /></button><span>{state.bpm} marcas/min</span><button onClick={() => metronome.configure({ bpm: state.bpm + 1 })} disabled={state.bpm === 120} aria-label="Aumentar ritmo"><Plus size={17} /></button></div>}
        </div>

        <aside className="rcp-practice-settings" aria-label="Configuración de la práctica">
          <div className="rcp-practice-setting-title"><HeartPulse size={18} aria-hidden="true" /><h2>Tu práctica, a tu ritmo.</h2></div>
          <div className="rcp-practice-setting-group"><label htmlFor="rcp-tempo">Ritmo objetivo <span>{state.bpm} marcas/min</span></label><div className="rcp-practice-tempo"><button onClick={() => metronome.configure({ bpm: state.bpm - 1 })} disabled={state.bpm === 100} aria-label="Reducir ritmo"><Minus size={17} aria-hidden="true" /></button><input id="rcp-tempo" type="range" min="100" max="120" step="1" value={state.bpm} onChange={event => metronome.configure({ bpm: Number(event.target.value) })} /><button onClick={() => metronome.configure({ bpm: state.bpm + 1 })} disabled={state.bpm === 120} aria-label="Aumentar ritmo"><Plus size={17} aria-hidden="true" /></button></div><div className="rcp-practice-presets" role="group" aria-label="Ritmos rápidos">{[100, 110, 120].map(bpm => <button key={bpm} aria-pressed={state.bpm === bpm} onClick={() => metronome.configure({ bpm })}>{bpm}<span>marcas/min</span></button>)}</div></div>
          <div className="rcp-practice-setting-group"><p className="rcp-practice-setting-label"><Timer size={15} aria-hidden="true" />Duración de la sesión</p><div className="rcp-practice-durations" role="group" aria-label="Duración de la sesión">{durations.map(({ value, label }) => <button key={value} disabled={active || state.status === 'starting' || state.status === 'paused'} aria-pressed={state.duration === value} onClick={() => metronome.configure({ duration: value })}>{label}</button>)}</div>{state.status === 'paused' && <p className="rcp-practice-setting-hint">Reiniciá para cambiar la duración.</p>}</div>
          <div className="rcp-practice-signals" role="group" aria-label="Señales del metrónomo"><button aria-pressed={state.sound} disabled={!state.audioAvailable} onClick={() => metronome.configure({ sound: !state.sound })}>{state.sound && state.volume > 0 ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}<span><strong>Sonido</strong><small>{!state.audioAvailable ? 'No disponible' : state.sound && state.volume > 0 ? 'Activado' : 'En silencio'}</small></span><i aria-hidden="true" /></button><button aria-pressed={state.light} onClick={() => metronome.configure({ light: !state.light })}>{state.light ? <Lightbulb size={20} aria-hidden="true" /> : <LightbulbOff size={20} aria-hidden="true" />}<span><strong>Luz</strong><small>{state.light ? 'Activada' : 'Desactivada'}</small></span><i aria-hidden="true" /></button></div>
          <div className="rcp-practice-setting-group rcp-practice-volume"><label htmlFor="rcp-volume">Volumen <span>{state.volume}%</span></label><input id="rcp-volume" type="range" min="0" max="100" step="5" value={state.volume} disabled={!state.sound || !state.audioAvailable} onChange={event => metronome.configure({ volume: Number(event.target.value) })} /></div>
          <p className="rcp-practice-reference">Cadencia para RCP en adultos: <strong>100–120 compresiones/min.</strong> <a href="https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-basic-life-support" target="_blank" rel="noopener noreferrer">Referencia AHA 2025 <ArrowRight size={12} aria-hidden="true" /></a></p>
        </aside>
      </section>

      <section className="rcp-practice-guide" aria-labelledby="practice-guide-title"><div><p className="grcp-eyebrow">APRENDER HACIENDO</p><h2 id="practice-guide-title">Prepará. Seguí. Repetí.</h2><p>Practicá sobre un maniquí, con acompañamiento de un instructor.</p></div><ol><li><span>01</span><div><h3>Elegí tus señales.</h3><p>Ajustá el ritmo, el volumen y la duración antes de comenzar.</p></div></li><li><span>02</span><div><h3>Encontrá la cadencia.</h3><p>Seguí las marcas de luz o sonido durante la práctica.</p></div></li><li><span>03</span><div><h3>Revisá y volvé a practicar.</h3><p>Pausá para ajustar y repetí para familiarizarte con el ritmo.</p></div></li></ol></section>
      <div className="rcp-practice-footer-note"><p>Las marcas indican el ritmo del metrónomo. Esta herramienta no mide la profundidad, la técnica ni las compresiones que realizás.</p><Link to="/Servicios">Practicar con GRCP <ArrowRight size={16} aria-hidden="true" /></Link></div>
    </div>
  </div>;
}
