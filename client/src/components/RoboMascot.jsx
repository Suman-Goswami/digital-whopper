import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function RoboMascot() {
  const imageRef = useRef(null);
  const wrapRef = useRef(null);
  const eyesRef = useRef([]);

  useEffect(() => {
    const image = imageRef.current;
    const wrap = wrapRef.current;
    let raf;
    let tx = 0, ty = 0;
    let cx = 0, cy = 0;
    let idle = true;
    let t = 0;

    const onMove = (e) => {
      idle = false;
      const r = wrap.getBoundingClientRect();
      const ox = r.left + r.width / 2;
      const oy = r.top + r.height / 2;
      tx = Math.max(-1, Math.min(1, (e.clientX - ox) / (window.innerWidth / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - oy) / (window.innerHeight / 2)));
    };

    const loop = () => {
      t += 0.016;
      if (idle) {
        tx = Math.sin(t * 0.65) * 0.35;
        ty = Math.cos(t * 0.5) * 0.22;
      }

      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      image.style.transform = `rotateY(${cx * 10}deg) rotateX(${-cy * 8}deg) translateY(${Math.sin(t * 1.6) * 6}px)`;
      eyesRef.current.forEach((eye) => {
        if (eye) eye.style.transform = `translate(${cx * 12}px, ${cy * 8}px)`;
      });
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <motion.div
      className="robo-wrap hero-robo-wrap"
      ref={wrapRef}
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: 2.3, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <img
        ref={imageRef}
        className="hero-robo-img"
        src="/assets/hero-robo.png"
        alt=""
        draggable="false"
      />
      <span className="hero-robo-eye left" ref={(el) => (eyesRef.current[0] = el)} />
      <span className="hero-robo-eye right" ref={(el) => (eyesRef.current[1] = el)} />
      <div className="robo-shadow hero-robo-shadow" />
    </motion.div>
  );
}
