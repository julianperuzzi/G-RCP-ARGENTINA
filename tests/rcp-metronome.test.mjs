import test from 'node:test';
import assert from 'node:assert/strict';
import { RcpMetronome, formatPracticeTime } from '../src/lib/rcpMetronome.js';

function rig({ audioUnavailable = false, resumeBlocked = false } = {}) {
  let time = 0, id = 0, releaseResume;
  const jobs = new Map(), tones = [], gainValues = [];
  const enqueue = (callback, delay) => { const key = ++id; jobs.set(key, { at: time + delay / 1000, callback }); return key; };
  const parameter = { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime(value) { gainValues.push(value); } };
  const context = {
    get currentTime() { return time; }, state: 'suspended', destination: {},
    createGain: () => ({ gain: parameter, connect() {}, disconnect() {} }),
    createOscillator() {
      let endJob;
      const voice = {
        frequency: parameter, connect() {}, disconnect() {},
        start(at) { tones.push({ at, voice }); },
        stop(at) { jobs.delete(endJob); if (at === undefined) { voice.cancelled = true; voice.onended?.(); } else endJob = enqueue(() => voice.onended?.(), (at - time) * 1000); },
      };
      return voice;
    },
    async resume() { if (resumeBlocked) await new Promise(resolve => { releaseResume = resolve; }); context.state = 'running'; },
    async close() { context.state = 'closed'; },
  };
  let creations = 0;
  const metronome = new RcpMetronome({
    createAudioContext() { creations++; if (audioUnavailable) throw new Error('unsupported'); return context; },
    now: () => time, setTimer: enqueue, clearTimer: key => jobs.delete(key),
    requestFrame: callback => enqueue(callback, 1000 / 60), cancelFrame: key => jobs.delete(key),
  });
  function advance(target) {
    while (jobs.size) {
      const [key, job] = [...jobs].sort((a, b) => a[1].at - b[1].at)[0];
      if (job.at > target) break;
      time = job.at; jobs.delete(key); job.callback();
    }
    time = target;
  }
  return { metronome, advance, tones, gainValues, context, jobs, get creations() { return creations; }, releaseResume: () => releaseResume?.() };
}

test('audio is created only on start; all supported cadences schedule exact intervals and finish at the duration', async () => {
  for (const bpm of [100, 110, 120]) {
    const r = rig();
    assert.equal(r.creations, 0);
    r.metronome.configure({ bpm, duration: 60 });
    await r.metronome.start();
    assert.equal(r.metronome.getSnapshot().status, 'countdown');
    r.advance(2.99);
    assert.equal(r.metronome.getSnapshot().beatCount, 0);
    r.advance(63.1);
    assert.equal(r.metronome.getSnapshot().status, 'complete');
    assert.equal(r.metronome.getSnapshot().beatCount, bpm);
    assert.equal(r.metronome.getSnapshot().elapsed, 60);
    assert.equal(r.tones.length, bpm);
    for (let i = 1; i < r.tones.length; i++) assert.ok(Math.abs(r.tones[i].at - r.tones[i - 1].at - 60 / bpm) < 1e-9);
    assert.equal(r.jobs.size, 0);
    r.metronome.dispose();
  }
});

test('pause preserves progress, cancels scheduled tones and resumes with one scheduling loop', async () => {
  const r = rig();
  await r.metronome.start(); r.advance(8);
  r.metronome.pause();
  const paused = r.metronome.getSnapshot();
  assert.equal(paused.status, 'paused');
  assert.equal(paused.elapsed, 5);
  assert.ok(paused.beatCount > 0);
  assert.equal(paused.flash, false);
  assert.equal(r.jobs.size, 0);
  r.advance(20);
  assert.equal(r.metronome.getSnapshot().beatCount, paused.beatCount);
  await Promise.all([r.metronome.start(), r.metronome.start()]);
  assert.equal(r.creations, 1);
  r.advance(21.2);
  assert.equal(r.metronome.getSnapshot().elapsed, 6);
  assert.ok(r.metronome.getSnapshot().beatCount - paused.beatCount <= 3);
  r.metronome.reset();
  assert.equal(r.metronome.getSnapshot().beatCount, 0);
  assert.equal(r.metronome.getSnapshot().elapsed, 0);
  assert.equal(r.jobs.size, 0);
  r.metronome.dispose(); assert.equal(r.context.state, 'closed');
});

test('tempo changes remove future beats, respect bounds and do not produce double cues', async () => {
  const r = rig(); r.metronome.configure({ bpm: 120 });
  await r.metronome.start(); r.advance(3.45);
  const future = r.tones.find(tone => tone.at > 3.45);
  assert.ok(future);
  r.metronome.configure({ bpm: 100 });
  assert.equal(future.voice.cancelled, true);
  r.advance(4.9);
  const heard = r.tones.filter(tone => !tone.voice.cancelled && tone.at <= 4.9);
  assert.deepEqual(heard.map(tone => Number(tone.at.toFixed(2))), [3, 3.6, 4.2, 4.8]);
  r.metronome.configure({ bpm: 500, volume: -5, duration: 300 });
  assert.equal(r.metronome.getSnapshot().bpm, 120);
  assert.equal(r.metronome.getSnapshot().volume, 0);
  assert.equal(r.metronome.getSnapshot().duration, 120);
  r.metronome.dispose();
});

test('mute changes gain immediately and disabling both cues pauses; unsupported audio retains light practice', async () => {
  const r = rig(); await r.metronome.start(); r.advance(4);
  r.metronome.configure({ sound: false });
  assert.equal(r.gainValues.at(-1), 0);
  assert.equal(r.metronome.getSnapshot().status, 'playing');
  r.metronome.configure({ light: false });
  assert.equal(r.metronome.getSnapshot().status, 'paused');
  assert.equal(r.jobs.size, 0); r.metronome.dispose();
  const fallback = rig({ audioUnavailable: true });
  await fallback.metronome.start(); fallback.advance(4);
  assert.equal(fallback.metronome.getSnapshot().audioAvailable, false);
  assert.ok(fallback.metronome.getSnapshot().beatCount > 0);
  assert.equal(fallback.tones.length, 0);
  fallback.metronome.dispose();
});

test('reset or leaving the page during audio unlock cannot start a late session', async () => {
  for (const cancel of ['reset', 'dispose']) {
    const r = rig({ resumeBlocked: true });
    const starting = r.metronome.start();
    assert.equal(r.metronome.getSnapshot().status, 'starting');
    r.metronome[cancel](); r.releaseResume(); await starting; r.advance(10);
    assert.equal(r.jobs.size, 0); assert.equal(r.tones.length, 0);
  }
});

test('light cues follow the scheduled sound clock and can be disabled independently', async () => {
  const r = rig(); await r.metronome.start();
  r.advance(3.05);
  assert.equal(r.metronome.getSnapshot().beatCount, 1);
  assert.equal(r.metronome.getSnapshot().flash, true);
  r.advance(3.25);
  assert.equal(r.metronome.getSnapshot().flash, false);
  r.advance(3.59);
  assert.equal(r.metronome.getSnapshot().beatCount, 2);
  assert.equal(r.metronome.getSnapshot().flash, true);
  r.metronome.configure({ light: false });
  assert.equal(r.metronome.getSnapshot().flash, false);
  assert.equal(r.metronome.getSnapshot().status, 'playing');
  r.metronome.dispose();
});

test('an audio interruption pauses with progress intact and cancels pending work', async () => {
  const r = rig(); await r.metronome.start(); r.advance(8);
  r.context.state = 'suspended'; r.context.onstatechange();
  assert.equal(r.metronome.getSnapshot().status, 'paused');
  assert.equal(r.metronome.getSnapshot().elapsed, 5);
  assert.equal(r.jobs.size, 0);
  assert.match(r.metronome.getSnapshot().message, /interrumpió/);
  r.metronome.dispose();
});

test('free practice continues beyond preset times; clock formatting is consistent', async () => {
  const r = rig(); r.metronome.configure({ duration: 0 });
  await r.metronome.start(); r.advance(310);
  assert.equal(r.metronome.getSnapshot().status, 'playing');
  assert.equal(r.metronome.getSnapshot().elapsed, 306);
  r.metronome.dispose();
  assert.equal(formatPracticeTime(0), '00:00');
  assert.equal(formatPracticeTime(125.8), '02:05');
});
