import { motion } from 'framer-motion';

const initials = (name) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('');

export default function Testimonials({ testimonials }) {
  /* duplicate the list so the marquee loops seamlessly */
  const loop = [...testimonials, ...testimonials];

  return (
    <section id="testimonials">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="eyebrow">Testimonials</span>
          <h2 className="section-title">
            Results our clients <span className="grad">talk about</span>
          </h2>
          <p className="section-sub">
            We're not merely boasting — our clients have seen real transformation.
            Here's what they say about the results we delivered.
          </p>
        </motion.div>
      </div>

      {/* full-bleed auto-scrolling marquee, pauses on hover */}
      <div className="t-marquee">
        <div className="t-track">
          {loop.map((t, i) => (
            <figure className="t-card" key={`${t.name}-${i}`}>
              <div className="t-stars" aria-label={`Rated ${t.rating} out of 5`}>
                <span aria-hidden="true">{'★'.repeat(Math.round(t.rating))}</span>
                {t.rating}
              </div>
              <blockquote className="t-quote">"{t.quote}"</blockquote>
              <figcaption className="t-person">
                <div className="t-avatar">{initials(t.name)}</div>
                <div>
                  <div className="n">{t.name}</div>
                  <div className="r">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
