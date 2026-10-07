const defaults = { bpm: 110, duration: 120, sound: true, light: true, volume: 60 };
const activeStatuses = new Set(['countdown', 'playing']);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function formatPracticeTime(seconds) {
  const whole = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
}

// Schedule audio ahead against the audio clock; draw light cues from the same queue.
// The counters describe emitted cues, not measured chest compressions.
export class RcpMetronome {
  constructor({
    createAudioContext = () => {
      const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!Audio) throw new Error('Audio unavailable');
      return new Audio();
    },
    now = () => performance.now() / 1000,
    setTimer = (callback, delay) => setTimeout(callback, delay),
    clearTimer = id => clearTimeout(id),
    requestFrame = callback => requestAnimationFrame(callback),
    cancelFrame = id => cancelAnimationFrame(id),
  } = {}) {
    Object.assign(this, { createAudioContext, now, setTimer, clearTimer, requestFrame, cancelFrame });
    this.snapshot = { ...defaults, status: 'idle', elapsed: 0, beatCount: 0, flash: false, countdown: null, message: '', audioAvailable: true };
    this.listeners = new Set();
    this.voices = new Set();
    this.queue = [];
    this.version = 0;
    this.elapsedBefore = 0;
    this.lastBeatTime = null;
    this.context = null;
  }

  getSnapshot = () => this.snapshot;
  subscribe = listener => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  emit(values) {
    if (Object.entries(values).every(([key, value]) => this.snapshot[key] === value)) return;
    this.snapshot = { ...this.snapshot, ...values };
    this.listeners.forEach(listener => listener());
  }
  clock() { return this.context ? this.context.currentTime : this.now(); }
  isActive() { return activeStatuses.has(this.snapshot.status); }
  hasCue() { return this.snapshot.light || (this.snapshot.sound && this.snapshot.volume > 0 && this.snapshot.audioAvailable); }

  configure(values) {
    const next = { ...values };
    if ('bpm' in next) next.bpm = Number.isFinite(next.bpm) ? clamp(Math.round(next.bpm), 100, 120) : this.snapshot.bpm;
    if ('volume' in next) next.volume = Number.isFinite(next.volume) ? clamp(Math.round(next.volume), 0, 100) : this.snapshot.volume;
    if ('duration' in next && (this.isActive() || this.snapshot.status === 'starting' || this.snapshot.status === 'paused')) delete next.duration;
    if ('duration' in next && ![0, 60, 120, 300].includes(next.duration)) delete next.duration;
    const tempoChanged = 'bpm' in next && next.bpm !== this.snapshot.bpm;
    this.emit({ ...next, ...('light' in next && !next.light ? { flash: false } : {}) });
    this.updateGain();
    if (tempoChanged && this.isActive()) {
      const current = this.clock();
      // Remove only future cues, so changing cadence cannot double a beat.
      this.queue = this.queue.filter(cue => {
        if (cue.time <= current) return true;
        if (cue.voice) this.stopVoice(cue.voice);
        return false;
      });
      const lastDue = this.queue.at(-1)?.time ?? this.lastBeatTime;
      this.nextBeatTime = this.snapshot.status === 'countdown' ? this.startTime : Math.max(current + .025, (lastDue ?? current) + 60 / this.snapshot.bpm);
    }
    if (this.isActive() && !this.hasCue()) this.pause('Activá la luz o el sonido para continuar.');
  }

  updateGain() {
    if (this.master && this.context) {
      const gain = this.snapshot.sound ? this.snapshot.volume / 100 * .5 : 0;
      this.master.gain.setTargetAtTime(gain, this.context.currentTime, .015);
    }
  }

  async start() {
    if (this.isActive() || this.snapshot.status === 'starting' || !this.hasCue()) return;
    if (this.snapshot.status === 'complete') this.reset();
    const version = ++this.version;
    this.emit({ status: 'starting', message: '' });
    try {
      if (!this.context) {
        this.context = this.createAudioContext();
        this.master = this.context.createGain();
        this.master.connect(this.context.destination);
        this.context.onstatechange = () => {
          if (this.context && this.context.state !== 'running' && this.isActive()) this.pause('El navegador interrumpió la práctica. Podés reanudarla cuando estés listo.');
        };
      }
      if (this.context.state !== 'running') await this.context.resume();
      if (version !== this.version) return;
      if (this.context.state !== 'running') throw new Error('Audio suspended');
      this.emit({ audioAvailable: true });
      this.updateGain();
    } catch {
      if (version !== this.version) return;
      this.closeAudio();
      this.emit({ audioAvailable: false, message: 'No pudimos activar el sonido. Podés continuar con la señal de luz.' });
    }
    if (version !== this.version) return;
    if (!this.hasCue()) { this.emit({ status: 'paused' }); return; }
    const prepare = this.elapsedBefore === 0 && this.snapshot.beatCount === 0;
    this.startTime = this.clock() + (prepare ? 3 : .08);
    this.nextBeatTime = this.startTime;
    this.endTime = this.snapshot.duration ? this.startTime + this.snapshot.duration - this.elapsedBefore : Infinity;
    this.emit({ status: prepare ? 'countdown' : 'playing', countdown: prepare ? 3 : null });
    this.schedule(version);
    this.draw(version);
  }

  schedule(version) {
    if (version !== this.version || !this.isActive()) return;
    const current = this.clock();
    // After a delayed callback, skip missed cues instead of playing a burst.
    if (this.nextBeatTime < current - .1) this.nextBeatTime = current + .025;
    while (this.nextBeatTime < current + .1 && this.nextBeatTime < this.endTime - 1e-7) {
      const cue = { time: this.nextBeatTime, voice: null };
      if (this.context) {
        const voice = this.context.createOscillator();
        const envelope = this.context.createGain();
        // One sustained, clearly defined beep per cue, with a short release.
        voice.type = 'triangle';
        voice.frequency.setValueAtTime(880, cue.time);
        envelope.gain.setValueAtTime(.0001, cue.time);
        envelope.gain.linearRampToValueAtTime(1, cue.time + .003);
        envelope.gain.setValueAtTime(1, cue.time + .085);
        envelope.gain.exponentialRampToValueAtTime(.0001, cue.time + .12);
        voice.connect(envelope); envelope.connect(this.master);
        voice.onended = () => { this.voices.delete(voice); voice.disconnect(); envelope.disconnect(); };
        this.voices.add(voice);
        voice.start(cue.time); voice.stop(cue.time + .13);
        cue.voice = voice;
      }
      this.queue.push(cue);
      this.nextBeatTime += 60 / this.snapshot.bpm;
    }
    this.timer = this.setTimer(() => this.schedule(version), 25);
  }

  collect(current) {
    let count = this.snapshot.beatCount;
    while (this.queue.length && this.queue[0].time <= current) {
      this.lastBeatTime = this.queue.shift().time;
      count++;
    }
    return count;
  }
  draw(version) {
    if (version !== this.version || !this.isActive()) return;
    const current = this.clock();
    const beatCount = this.collect(current);
    if (current >= this.endTime) {
      this.cancelWork();
      this.elapsedBefore = this.snapshot.duration;
      this.emit({ status: 'complete', elapsed: this.snapshot.duration, beatCount, flash: false, countdown: null, message: 'Práctica finalizada. Podés volver a empezar cuando quieras.' });
      return;
    }
    const preparing = current < this.startTime && this.snapshot.status === 'countdown';
    const elapsed = this.elapsedBefore + Math.max(0, current - this.startTime);
    this.emit({
      status: preparing ? 'countdown' : 'playing',
      countdown: preparing ? Math.ceil(this.startTime - current) : null,
      elapsed: Math.floor(elapsed), beatCount,
      flash: this.snapshot.light && this.lastBeatTime !== null && current - this.lastBeatTime < .18,
    });
    this.frame = this.requestFrame(() => this.draw(version));
  }

  stopVoice(voice) { try { voice.stop(); } catch { /* Already ended. */ } }
  cancelWork() {
    this.version++;
    this.clearTimer(this.timer); this.cancelFrame(this.frame);
    this.timer = null; this.frame = null;
    this.voices.forEach(voice => this.stopVoice(voice));
    this.voices.clear(); this.queue = []; this.lastBeatTime = null;
  }
  pause(message = '') {
    if (!this.isActive() && this.snapshot.status !== 'starting') return;
    const current = this.clock();
    const beatCount = this.isActive() ? this.collect(current) : this.snapshot.beatCount;
    if (this.snapshot.status === 'playing') this.elapsedBefore += Math.max(0, current - this.startTime);
    if (this.snapshot.duration) this.elapsedBefore = Math.min(this.elapsedBefore, this.snapshot.duration);
    this.cancelWork();
    this.emit({ status: 'paused', elapsed: Math.floor(this.elapsedBefore), beatCount, flash: false, countdown: null, message });
  }
  reset() {
    this.cancelWork(); this.elapsedBefore = 0;
    this.emit({ status: 'idle', elapsed: 0, beatCount: 0, flash: false, countdown: null, message: '', audioAvailable: true });
  }
  closeAudio() {
    const context = this.context;
    this.context = null; this.master = null;
    if (context) {
      context.onstatechange = null;
      try { context.close()?.catch(() => {}); } catch { /* The context may already be closed. */ }
    }
  }
  dispose() { this.cancelWork(); this.closeAudio(); }
}
