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
  const [bootLoading, setBootLoading] = useState(true);
  const [homeLoading, setHomeLoading] = useState(true);
  const location = useLocation();

  /* Buttery smooth scrolling — instance exposed for cinematic mode */
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  /* Scroll to top on route change */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setHomeLoading(false);
      return undefined;
    }

    setHomeLoading(true);
    const timer = window.setTimeout(() => setHomeLoading(false), 2200);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.key]);

  /* Load all content from the MongoDB-backed API */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = await fetchAll();
        if (alive) setData(all);
      } catch {
        if (alive) setData(FALLBACK);
      } finally {
        setTimeout(() => alive && setBootLoading(false), 2200);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const d = data || FALLBACK;
  const showLoader = bootLoading || homeLoading;

  return (
    <>
      <ScrollProgress />
      <ParticleField />
      <CustomCursor />
      <AnimatePresence>{showLoader && <Preloader key={`loader-${location.key}`} />}</AnimatePresence>

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
