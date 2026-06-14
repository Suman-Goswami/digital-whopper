import { motion } from 'framer-motion';
import Contact from '../components/Contact';

export default function ContactPage({ data: d }) {
  return (
    <main className="page">
      <section className="page-hero compact">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="eyebrow">Contact</span>
            <h1 className="page-title">
              Let's build your <span className="grad">brand whopper</span>
            </h1>
            <p className="section-sub">
              Walk in, call, WhatsApp Whoppy, or drop the form — whatever suits
              you. We reply within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <Contact site={d.site} services={d.services} />

      <section className="map-section">
        <div className="container">
          <motion.div
            className="map-frame"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
          >
            <iframe
              title="Digital Whopper office, Malviya Nagar, Jaipur"
              src={d.site?.mapEmbed || 'https://www.google.com/maps?q=Malviya+Nagar+Jaipur&output=embed'}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
