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
  const [data, setData] = useState(FALLBACK);
  const [bootLoading, setBootLoading] = useState(false);
  const [homeLoading, setHomeLoading] = useState(false);

  const location = useLocation();

  const isBrowser = typeof window !== 'undefined';

  /* Smooth scrolling */
  useEffect(() => {
    if (!isBrowser) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.075,
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.15,
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
  }, [isBrowser]);

  /* Scroll to top on route change */
  useEffect(() => {
    if (!isBrowser) return;

    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [isBrowser, location.pathname]);

  /* Home page loader */
  useEffect(() => {
    if (!isBrowser) return;

    if (location.pathname !== '/') {
      setHomeLoading(false);
      return;
    }

    setHomeLoading(true);

    const timer = window.setTimeout(() => {
      setHomeLoading(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [isBrowser, location.pathname, location.key]);

  /* Load all content from API */
  useEffect(() => {
    if (!isBrowser) return;

    let alive = true;

    setBootLoading(true);

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
  }, [isBrowser]);

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