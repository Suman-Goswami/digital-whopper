import { motion } from 'framer-motion';

export default function About({ site }) {
  return (
    <section id="about" className="about">
      <div className="container about-inner">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">Build your own brand whopper with us</span>
          <h2 className="big">
            Let’s <span className="grad">whoop</span> your business
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
         <p className="about-body">
  {site && site.aboutBody}
</p>
          <a className="btn btn-primary" href="contact">
            Know us better ✦
          </a>
        </motion.div>
      </div>
    </section>
  );
}
