import { motion } from 'framer-motion';

export default function Whoppy({ site }) {
  return (
    <motion.div
      className="whoppy"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3, duration: 0.6 }}
    >
      <div className="whoppy-bubble">
        Hey! Whoppy here 🤖 Looking for a service? Give me a ping!
      </div>
      <a
        className="whoppy-btn"
        href={site?.whatsapp || '#contact'}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        🤖
      </a>
    </motion.div>
  );
}
