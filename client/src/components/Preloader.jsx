import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/* Space-themed loader: twinkling starfield, mini robot head waking
   up, brand wordmark and a counting progress bar. */
const STARS = Array.from({ length: 46 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  s: Math.random() * 2.2 + 0.6,
  d: Math.random() * 3
}));

export default function Preloader() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / 2000, 1);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      className="preloader space"
      exit={{
        clipPath: 'inset(0 0 100% 0)',
        transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
      }}
    >
      {STARS.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            animationDelay: `${s.d}s`
          }}
        />
      ))}

      <div className="preloader-inner">
        <motion.div
          className="loader-robo"
          initial={{ y: 26, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="lr-head">
            <i className="lr-eye" />
            <i className="lr-eye" />
          </div>
        </motion.div>

        <motion.div
          className="preloader-word"
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          Digital Whopper ✦
        </motion.div>

        <div className="preloader-bar">
          <motion.i
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>
        <div className="preloader-pct">{pct}%</div>
      </div>
    </motion.div>
  );
}
