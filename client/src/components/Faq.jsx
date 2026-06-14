import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Faq({ faqs }) {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title">
            Frequently asked <span className="grad">questions</span>
          </h2>
        </motion.div>

        <div className="faq-list">
          {faqs.map((f, i) => {
            const open = openIdx === i;
            return (
              <div className={`faq-item ${open ? 'open' : ''}`} key={f.question}>
                <button
                  className="faq-q"
                  aria-expanded={open}
                  onClick={() => setOpenIdx(open ? -1 : i)}
                >
                  {f.question}
                  <span className="plus">+</span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      className="faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p>{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
