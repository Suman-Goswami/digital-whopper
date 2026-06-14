import { motion } from 'framer-motion';

export default function Strategy({ steps }) {
  return (
    <section id="strategy">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow">Our strategy</span>
          <h2 className="section-title">
            From spark to <span className="grad">scale</span>
          </h2>
        </motion.div>

        <div className="strategy-grid">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="strategy-cell"
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
            >
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
