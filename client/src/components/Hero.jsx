import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Counter from './Counter';
import RoboMascot from './RoboMascot';
import CinematicScroll from './CinematicScroll';

/* Letter-by-letter staggered headline */
function SplitText({ text, gradWords = [], baseDelay = 2.4 }) {
  let charIndex = 0;
  return (
    <>
      {text.split(' ').map((word, wi) => {
        const isGrad = gradWords.includes(word.replace(/[^a-zA-Z]/g, ''));
        return (
          <span className="split-word" key={wi}>
            {word.split('').map((ch, ci) => {
              const d = baseDelay + charIndex * 0.016;
              charIndex += 1;
              return (
                <motion.span
                  key={ci}
                  className={`split-char ${isGrad ? 'grad' : ''}`}
                  initial={{ y: '110%', rotate: 6, opacity: 0 }}
                  animate={{ y: '0%', rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch}
                </motion.span>
              );
            })}
            {'\u00A0'}
          </span>
        );
      })}
    </>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 36, filter: 'blur(6px)' },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: 2.8 + i * 0.14, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function Hero({ site }) {
  return (
    <section className="hero" id="home">
      <div className="hero-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="hero-grid-bg" aria-hidden="true" />

      <div className="container hero-inner">
        <div>
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.2 }}
          >
           {site && site.heroEyebrow}
          </motion.span>

          <h1>
            <SplitText
              text="Take your business online — and make it impossible to ignore."
              gradWords={['online', 'impossible']}
            />
          </h1>

          <motion.p className="hero-body" variants={fadeUp} initial="hidden" animate="show" custom={1}>
            {site && site.heroBody}
          </motion.p>

          <motion.div className="hero-ctas" variants={fadeUp} initial="hidden" animate="show" custom={2}>
            <Link className="btn btn-primary" to="/contact">Enquire now ✦</Link>
            <Link className="btn btn-ghost" to="/services">Explore services</Link>
          </motion.div>

          <motion.div className="hero-stats" variants={fadeUp} initial="hidden" animate="show" custom={3}>
          {((site && site.stats) || []).map((s) => (
  <div className="hero-stat" key={s.label}>
    <div className="v">
      <Counter value={s.value} />
    </div>
    <div className="l">{s.label}</div>
  </div>
))}
          </motion.div>
        </div>

        {/* Whoppy the robot — follows your cursor everywhere */}
        <div className="hero-visual">
          <RoboMascot />
          <div className="float-chip chip-a"><span className="ic">🚀</span> Performance Ads</div>
          <div className="float-chip chip-b"><span className="ic">🔍</span> SEO Growth</div>
          <div className="float-chip chip-c"><span className="ic">🛒</span> E-Commerce</div>
        </div>
      </div>

      {/* end of hero: cinematic experience trigger */}
      <div className="hero-cinematic">
        <CinematicScroll />
      </div>
    </section>
  );
}
