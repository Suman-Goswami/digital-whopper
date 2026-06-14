import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * "Click Here For Better Experience"
 * Starts a cinematic auto-scroll down the page with letterbox movie
 * bars and an upbeat synth loop generated live with the Web Audio API.
 * Any tap / click / key press stops the experience.
 */

/* ---- upbeat site music (Web Audio, fully generated) ---- */
function createAmbience() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();
  ctx.resume?.();

  const master = ctx.createGain();
  master.gain.value = 0;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.knee.value = 18;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.006;
  compressor.release.value = 0.18;

  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 6800;
  tone.Q.value = 0.5;
  master.connect(compressor).connect(tone).connect(ctx.destination);

  const timers = [];
  const nodes = [];
  const tempo = 118;
  const beat = 60 / tempo;
  const root = 246.94;
  const scale = [0, 2, 4, 7, 9, 11, 12, 14, 16, 19].map((semi) => root * 2 ** (semi / 12));
  let bar = 0;

  const playTone = (freq, time, length, type, level) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(level, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
    osc.connect(gain).connect(master);
    osc.start(time);
    osc.stop(time + length + 0.04);
    nodes.push(osc);
  };

  const playChord = (freqs, time, length) => {
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = i % 2 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      osc.detune.value = (i - 1) * 4;
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1700, time);
      filter.frequency.exponentialRampToValueAtTime(4200, time + 0.12);
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.052, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
      osc.connect(filter).connect(gain).connect(master);
      osc.start(time);
      osc.stop(time + length + 0.05);
      nodes.push(osc);
    });
  };

  const playKick = (time) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(46, time + 0.18);
    gain.gain.setValueAtTime(0.28, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);
    osc.connect(gain).connect(master);
    osc.start(time);
    osc.stop(time + 0.22);
    nodes.push(osc);
  };

  const playNoiseHit = (time, length, level, highpass) => {
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * length), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    filter.type = 'highpass';
    filter.frequency.value = highpass;
    gain.gain.setValueAtTime(level, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
    src.buffer = buffer;
    src.connect(filter).connect(gain).connect(master);
    src.start(time);
    nodes.push(src);
  };

  const scheduleBar = () => {
    const now = ctx.currentTime + 0.1;
    const melodies = [
      [4, 7, 9, 7, 4, 2, 4, 7],
      [7, 9, 7, 4, 2, 0, 2, 4],
      [9, 7, 4, 7, 9, 8, 9, 7],
      [4, 2, 0, 2, 4, 7, 4, 2]
    ];
    const chords = [
      [0, 4, 7, 9],
      [2, 4, 7, 9],
      [4, 7, 8, 9],
      [0, 2, 7, 9]
    ];
    const bass = [0, 2, 4, 0];
    const melody = melodies[bar % melodies.length];
    const chord = chords[bar % chords.length];

    for (let i = 0; i < 8; i++) {
      const time = now + i * beat * 0.5;
      if (i === 0 || i === 4) playKick(time);
      if (i === 2 || i === 6) playNoiseHit(time, 0.11, 0.14, 1500);
      playNoiseHit(time + beat * 0.25, 0.035, i % 2 ? 0.045 : 0.065, 7000);
      playTone(scale[melody[i]], time, beat * 0.28, i % 3 ? 'triangle' : 'square', 0.052);
      if (i % 2 === 0) playTone(scale[bass[i / 2]] / 2, time, beat * 0.72, 'sine', 0.075);
      if (i === 0 || i === 4) playChord(chord.map((n) => scale[n]), time + 0.02, beat * 1.45);
    }
    bar += 1;
  };

  scheduleBar();
  timers.push(setInterval(scheduleBar, beat * 4 * 1000));
  master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.6);

  return {
    stop() {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 0.7);
      timers.forEach(clearInterval);
      setTimeout(() => {
        nodes.forEach((node) => { try { node.stop(); } catch {} });
        ctx.close();
      }, 900);
    }
  };
}

export default function CinematicScroll() {
  const [playing, setPlaying] = useState(false);
  const stateRef = useRef({ raf: 0, doneTimer: 0, audio: null, startedAt: 0, startY: 0, target: 0 });

  const stop = () => {
    const s = stateRef.current;
    cancelAnimationFrame(s.raf);
    clearTimeout(s.doneTimer);
    s.audio?.stop();
    s.audio = null;
    window.__lenis?.start?.();
    window.dispatchEvent(new CustomEvent('cinematic-scroll-state', { detail: false }));
    setPlaying(false);
  };

  const start = () => {
    if (playing) return;

    setPlaying(true);
    window.dispatchEvent(new CustomEvent('cinematic-scroll-state', { detail: true }));
    const s = stateRef.current;
    try {
      s.audio = createAmbience();
    } catch (err) {
      console.error('Preview music failed to start:', err);
      s.audio = null;
    }

    requestAnimationFrame(() => requestAnimationFrame(() => {
      const footer = document.querySelector('.footer');
      const pageMax = document.documentElement.scrollHeight - window.innerHeight;
      const footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : pageMax;
      const target = Math.min(Math.max(footerTop, 0), pageMax);

      s.startY = window.scrollY;
      s.target = target;
      s.startedAt = performance.now();

      const SPEED = 230;
      const distance = Math.max(s.target - s.startY, 0);
      const durationMs = Math.max(distance / SPEED * 1000, 700);

      if (window.__lenis?.scrollTo) {
        window.__lenis.start?.();
        window.__lenis.scrollTo(s.target, {
          duration: durationMs / 1000,
          easing: (t) => t,
          force: true,
          lock: false,
          onComplete: stop
        });
        s.doneTimer = window.setTimeout(stop, durationMs + 600);
        return;
      }

      const step = (now) => {
        const progress = Math.min((now - s.startedAt) / durationMs, 1);
        const next = s.startY + distance * progress;
        window.scrollTo({ top: next, behavior: 'auto' });
        if (progress >= 1 || next >= s.target - 2) { stop(); return; }
        s.raf = requestAnimationFrame(step);
      };
      s.raf = requestAnimationFrame(step);
    }));
  };

  useEffect(() => {
    if (!playing) return undefined;
    const cancel = () => stop();
    const id = setTimeout(() => {
      window.addEventListener('pointerdown', cancel);
      window.addEventListener('keydown', cancel);
    }, 350);

    return () => {
      clearTimeout(id);
      window.removeEventListener('pointerdown', cancel);
      window.removeEventListener('keydown', cancel);
    };
  }, [playing]);

  useEffect(() => () => stop(), []);

  return (
    <>
      <motion.button
        className="cinematic-cta"
        onClick={start}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.1, duration: 0.8 }}
        aria-label="Start cinematic scrolling experience"
      >
        <span>Click Here For Better Experience</span>
        <span className="chevrons" aria-hidden="true">
          <i /><i /><i />
        </span>
      </motion.button>

      <AnimatePresence>
        {playing && (
          <>
            <motion.div
              className="letterbox top"
              initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="letterbox bottom"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="cinematic-hint"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ delay: 1 }}
            >
              Now playing - tap anywhere to exit the experience
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
