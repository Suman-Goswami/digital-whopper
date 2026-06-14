import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Services from '../components/Services';
import Marquee from '../components/Marquee';

/* Category chips sourced from the service catalogue in MongoDB */
export default function ServicesPage({ data: d }) {
  return (
    <main className="page">
      <section className="page-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="eyebrow">Services</span>
            <h1 className="page-title">
              Everything your brand needs to <span className="grad">dominate online</span>
            </h1>
            <p className="section-sub">
              360° digital marketing — pick a category to see how we turn
              visibility into revenue.
            </p>
          </motion.div>

          <motion.div
            className="cat-chips"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            {d.services.map((s) => (
              <a key={s.slug || s.title} href="#services" className="cat-chip" style={{ '--c': s.accent }}>
                {s.title}
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      <Services services={d.services} />

      <Marquee
        items={['Amazon', 'Flipkart', 'Etsy', 'Shopify', 'Google Ads', 'Meta Ads', 'UI/UX']}
      />

      <section className="page-cta">
        <div className="container">
          <motion.div
            className="about-inner"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="big">
                Not sure which service <span className="grad">fits you?</span>
              </h2>
            </div>
            <div>
              <p className="about-body">
                Tell us your goal — more traffic, more sales, a new app — and
                we'll map the right mix for your budget.
              </p>
              <Link className="btn btn-primary" to="/contact">Get a free consultation ✦</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
