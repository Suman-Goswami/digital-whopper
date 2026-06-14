import { useRef, useCallback } from 'react';

/**
 * useTilt — attaches 3D perspective tilt to any element.
 * Returns ref + mouse handlers. Cheap: pure transform updates.
 */
export default function useTilt(maxDeg = 8) {
  const ref = useRef(null);

  const onMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${px * maxDeg}deg) rotateX(${-py * maxDeg}deg) translateZ(0)`;
      el.style.transition = 'transform 0.08s linear';
    },
    [maxDeg]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
