import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import { fetchAll, FALLBACK } from './api/client';

import Preloader from './components/Preloader';
import ScrollProgress from './components/ScrollProgress';
import ParticleField from './components/ParticleField';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Whoppy from './components/Whoppy';
import Footer from './components/Footer';

import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AccountPage from './pages/AccountPage';

export default function App() {
  const [data, setData] = useState(null);

  const isPrerender =
    navigator.userAgent === 'ReactSnap' ||
    window.location.search.includes('react-snap');

  const [bootLoading, setBootLoading] = useState(!isPrerender);
  const [homeLoading, setHomeLoading] = useState(!isPrerender);

  const location = useLocation();

  /* Smooth scrolling — optimized RAF cleanup */
  useEffect(() => {
    if (navigator.userAgent === 'ReactSnap') {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      lerp: 0.075,
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.15
    });

    window.__lenis = lenis;

    let rafId = 0;

    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    const onVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  /* Scroll to top on route change */
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isPrerender) {
      setHomeLoading(false);
      return;
    }

    if (location.pathname !== '/') {
      setHomeLoading(false);
      return undefined;
    }

    setHomeLoading(true);
    const timer = window.setTimeout(() => setHomeLoading(false), 1800);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.key, isPrerender]);

  /* Load all content from the MongoDB-backed API */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const all = await fetchAll();

        if (alive) {
          setData(all);
        }
      } catch {
        if (alive) {
          setData(FALLBACK);
        }
      } finally {
        if (isPrerender) {
          if (alive) {
            setBootLoading(false);
          }
          return;
        }

        window.setTimeout(() => {
          if (alive) {
            setBootLoading(false);
          }
        }, 1600);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isPrerender]);

  const d = data || FALLBACK;
  const showLoader = bootLoading || homeLoading;

  return (
    <>
      <ScrollProgress />
      <ParticleField />
      <CustomCursor />

      <AnimatePresence mode="wait">
        {showLoader && <Preloader key={`loader-${location.key}`} />}
      </AnimatePresence>

      <Navbar site={d.site} />

      <Routes>
        <Route path="/" element={<Home data={d} />} />
        <Route path="/services" element={<ServicesPage data={d} />} />
        <Route path="/contact" element={<ContactPage data={d} />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<Home data={d} />} />
      </Routes>

      <Whoppy site={d.site} />
      <Footer site={d.site} services={d.services} />
    </>
  );
}