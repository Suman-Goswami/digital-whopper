import { motion } from 'framer-motion';

export default function Milestones({ milestones }) {
  return (
    <section id="milestones">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="eyebrow">Our journey</span>
          <h2 className="section-title">
            Driven by passion — our milestones show{' '}
            <span className="grad">how far we've come</span>
          </h2>
        </motion.div>

        <div className="timeline">
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              className="tl-item"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="tl-card">
                <span className="tl-year">{m.year}</span>
                <h3>{m.title}</h3>
                <p>{m.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
