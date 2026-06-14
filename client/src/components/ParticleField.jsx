import { useEffect, useRef } from 'react';

/**
 * Constellation particle field — optimized for smooth scrolling.
 */
export default function ParticleField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    if (prefersReducedMotion || isTouchDevice) {
      return undefined;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;

    const mouse = { x: -9999, y: -9999 };
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const COLORS = ['255,77,141', '255,180,84', '139,92,246', '34,211,238'];

    let dots = [];

    const createDots = () => {
      const count = Math.min(54, Math.max(28, Math.floor(window.innerWidth / 28)));

      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18 * DPR,
        vy: (Math.random() - 0.5) * 0.18 * DPR,
        r: (Math.random() * 1.35 + 0.55) * DPR,
        c: COLORS[(Math.random() * COLORS.length) | 0]
      }));
    };

    const resize = () => {
      const nextW = window.innerWidth;
      const nextH = window.innerHeight;

      w = canvas.width = Math.floor(nextW * DPR);
      h = canvas.height = Math.floor(nextH * DPR);

      canvas.style.width = `${nextW}px`;
      canvas.style.height = `${nextH}px`;

      createDots();
    };

    resize();

    const LINK = 115 * DPR;
    const LINK_SQ = LINK * LINK;
    const MOUSE_R = 150 * DPR;
    const MOUSE_R_SQ = MOUSE_R * MOUSE_R;

    const tick = () => {
      if (!running) return;

      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < MOUSE_R_SQ && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const f = ((MOUSE_R - dist) / MOUSE_R) * 0.45;
          d.vx += (dx / dist) * f * 0.08;
          d.vy += (dy / dist) * f * 0.08;
        }

        d.x += d.vx;
        d.y += d.vy;

        d.vx *= 0.99;
        d.vy *= 0.99;

        if (Math.abs(d.vx) < 0.035) d.vx += (Math.random() - 0.5) * 0.035;
        if (Math.abs(d.vy) < 0.035) d.vy += (Math.random() - 0.5) * 0.035;

        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.c},0.62)`;
        ctx.fill();
      }

      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];

        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < LINK_SQ) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / LINK) * 0.12;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${a.c},${opacity})`;
            ctx.lineWidth = DPR * 0.55;
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

    let resizeTimer = 0;

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 160);
    };

    const onVisibilityChange = () => {
      running = !document.hidden;

      if (running) {
        raf = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}