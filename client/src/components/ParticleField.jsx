import { useEffect, useRef } from 'react';

/**
 * Constellation particle field — floating dots that connect with
 * lines when close, and react to the mouse. GPU-friendly canvas.
 */
export default function ParticleField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w, h, raf;
    const mouse = { x: -9999, y: -9999 };
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.width = window.innerWidth * DPR;
      h = canvas.height = window.innerHeight * DPR;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();

    const COUNT = Math.min(90, Math.floor(window.innerWidth / 16));
    const COLORS = ['255,77,141', '255,180,84', '139,92,246', '34,211,238'];
    const dots = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22 * DPR,
      vy: (Math.random() - 0.5) * 0.22 * DPR,
      r: (Math.random() * 1.6 + 0.6) * DPR,
      c: COLORS[(Math.random() * COLORS.length) | 0]
    }));

    const LINK = 130 * DPR;
    const MOUSE_R = 170 * DPR;

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        /* gentle mouse repulsion */
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_R && dist > 0.01) {
          const f = ((MOUSE_R - dist) / MOUSE_R) * 0.6;
          d.vx += (dx / dist) * f * 0.12;
          d.vy += (dy / dist) * f * 0.12;
        }

        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.985;
        d.vy *= 0.985;
        /* keep a baseline drift */
        if (Math.abs(d.vx) < 0.05) d.vx += (Math.random() - 0.5) * 0.05;
        if (Math.abs(d.vy) < 0.05) d.vy += (Math.random() - 0.5) * 0.05;

        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.c},0.7)`;
        ctx.fill();
      }

      /* connecting lines */
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            const o = (1 - dist / LINK) * 0.16;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${a.c},${o})`;
            ctx.lineWidth = DPR * 0.7;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      mouse.x = e.clientX * DPR;
      mouse.y = e.clientY * DPR;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      raf = requestAnimationFrame(tick);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseleave', onLeave);
      window.addEventListener('resize', resize);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
