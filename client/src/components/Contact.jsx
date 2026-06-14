import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { postEnquiry } from '../api/client';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_ADMIN_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
const EMAILJS_USER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Contact({ site, services = [] }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'General',
    message: ''
  });

  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const serviceRef = useRef(null);

  const serviceOptions = useMemo(() => {
    const dynamicServices = services.map((s) => s.title).filter(Boolean);
    return ['General', ...dynamicServices];
  }, [services]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (serviceRef.current && !serviceRef.current.contains(e.target)) {
        setServiceOpen(false);
      }
    };

    const closeOnEscape = (e) => {
      if (e.key === 'Escape') setServiceOpen(false);
    };

    document.addEventListener('mousedown', closeDropdown);
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeDropdown);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const selectService = (value) => {
    setForm((f) => ({ ...f, service: value }));
    setServiceOpen(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    try {
      if (
        !EMAILJS_SERVICE_ID ||
        !EMAILJS_ADMIN_TEMPLATE_ID ||
        !EMAILJS_USER_TEMPLATE_ID ||
        !EMAILJS_PUBLIC_KEY
      ) {
        throw new Error('EmailJS keys are missing. Please check frontend .env file.');
      }

      const cleanForm = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        service: form.service,
        message: form.message.trim()
      };

      const templateParams = {
        from_name: cleanForm.name,
        from_email: cleanForm.email,
        to_name: cleanForm.name,
        to_email: cleanForm.email,
        reply_to: cleanForm.email,
        phone: cleanForm.phone || 'Not provided',
        service: cleanForm.service,
        message: cleanForm.message
      };

      const dbRes = await postEnquiry(cleanForm);

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_ADMIN_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_USER_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setStatus({
        ok: true,
        msg: dbRes?.message || 'Thanks! Your enquiry has been sent successfully.'
      });

      setForm({
        name: '',
        email: '',
        phone: '',
        service: 'General',
        message: ''
      });
    } catch (err) {
      setStatus({
        ok: false,
        msg: err.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow">Get in touch</span>
          <h2 className="section-title">
            Ready to <span className="grad">whoop</span> your growth?
          </h2>
          <p className="section-sub">
            Increase ROI? Develop an app? Or any other service? Tell us what you
            want — let’s chat!
          </p>
        </motion.div>

        <div className="contact-inner">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
          >
            <div className="ci-row">
              <div className="ci-icon">📍</div>
              <div>
                <div className="t">Visit us</div>
                <div className="d">{site?.address}</div>
              </div>
            </div>

            <div className="ci-row">
              <div className="ci-icon">📞</div>
              <div>
                <div className="t">Call us</div>
                <div className="d">
                  <a href={`tel:${(site?.phone || '').replace(/\s/g, '')}`}>
                    {site?.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="ci-row">
              <div className="ci-icon">💬</div>
              <div>
                <div className="t">WhatsApp</div>
                <div className="d">
                  <a href={site?.whatsapp} target="_blank" rel="noreferrer">
                    Chat with Whoppy — we reply fast
                  </a>
                </div>
              </div>
            </div>

            <div className="ci-row">
              <div className="ci-icon">✉️</div>
              <div>
                <div className="t">Email</div>
                <div className="d">{site?.email}</div>
              </div>
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={submit}
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="form-row">
              <div className="field">
                <label htmlFor="cf-name">Name</label>
                <input
                  id="cf-name"
                  required
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Your full name"
                />
              </div>

              <div className="field">
                <label htmlFor="cf-email">Email</label>
                <input
                  id="cf-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="cf-phone">Phone (optional)</label>
                <input
                  id="cf-phone"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+91 …"
                />
              </div>

              <div className="field service-field" ref={serviceRef}>
                <label htmlFor="cf-service">Service</label>

                <button
                  id="cf-service"
                  type="button"
                  className={`service-select-trigger ${serviceOpen ? 'open' : ''}`}
                  onClick={() => setServiceOpen((o) => !o)}
                  aria-haspopup="listbox"
                  aria-expanded={serviceOpen}
                >
                  <span>{form.service}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

           {serviceOpen && (
  <div
    className="service-options"
    role="listbox"
    data-lenis-prevent
    onWheel={(e) => e.stopPropagation()}
    onTouchMove={(e) => e.stopPropagation()}
  >
    {serviceOptions.map((option) => (
      <button
        key={option}
        type="button"
        className={form.service === option ? 'selected' : ''}
        onClick={() => selectService(option)}
        role="option"
        aria-selected={form.service === option}
      >
        {option}
      </button>
    ))}
  </div>
)}
              </div>
            </div>

            <div className="field">
              <label htmlFor="cf-msg">Message</label>
              <textarea
                id="cf-msg"
                required
                value={form.message}
                onChange={set('message')}
                placeholder="Tell us about your project…"
              />
            </div>

            {status && (
              <div className={`form-status ${status.ok ? 'ok' : 'err'}`}>
                {status.msg}
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send enquiry ✦'}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}