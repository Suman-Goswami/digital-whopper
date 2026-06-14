import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BLOG_DETAILS = {
  'Meta Andromeda Update: Breaking Down the Buzz': {
    type: 'meta',
    externalUrl: 'https://digitalwhopper.com/meta-andromeda-update-breaking-down-the-buzz',
    content: [
      'Meta Andromeda is Meta’s machine-learning system for Facebook and Instagram ad recommendations. It helps shortlist and push ads toward audiences who are more likely to engage.',
      'The update shifts campaign success toward creative testing. Advertisers should use diverse creative assets, UGC, testimonials, and AI-assisted variations instead of over-managing narrow targeting settings.',
      'Digital Whopper recommends focusing on creative diversity, clear persona-desire-awareness messaging, and patient campaign testing before making major optimisation changes.'
    ]
  },
  'Top 10 Tips to Build Your Social Media Brand in 2026': {
    type: 'social-blog',
    externalUrl: 'https://digitalwhopper.com/top-10-tips-to-build-your-social-media-brand-in-2026-the-core-social-media-marketing-strategies',
    content: [
      'Building a social media brand starts with a clear vision, the right platform, and an optimised profile that reflects the long-term identity you want people to remember.',
      'The article highlights consistency, content calendars, community engagement, AI tools, influencer collaboration, and analytics as core parts of social media marketing.',
      'The main takeaway is that brand growth does not happen overnight. It comes from authentic content, regular engagement, and continuous learning from performance data.'
    ]
  },
  'E-commerce Marketing in 2026: Top 5 Proven Strategies': {
    type: 'ecom-blog',
    externalUrl: 'https://digitalwhopper.com/e-commerce-marketing-in-2026-top-5-simple-proven-strategies-to-boost-your-sales',
    content: [
      'The post explains why e-commerce stores lose sales: stronger competitors, outdated trends, slow websites, weak product presentation, and poor mobile experiences.',
      'Digital Whopper’s recommended fixes include an intuitive mobile-friendly website, funnel optimisation, SEO, A/B testing, and cart recovery flows.',
      'The core message is simple: ads alone are not enough. Stores need trust, speed, search visibility, retention, and a smoother path from landing page to checkout.'
    ]
  }
};

export default function Blogs({ blogs }) {
  const [active, setActive] = useState(null);
  const displayBlogs = blogs.slice(0, 3).map((blog) => ({ ...BLOG_DETAILS[blog.title], ...blog }));

  return (
    <section id="blog" className="blogs-section">
      <div className="container">
        <motion.div
          className="blogs-head"
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <h2>Our Latest Blogs</h2>
        </motion.div>

        <div className="blogs-grid">
          {displayBlogs.map((b, i) => (
            <motion.button
              key={b.title}
              type="button"
              className={`blog-card ${b.type || ''}`}
              onClick={() => setActive(b)}
              initial={{ opacity: 0, y: 40, rotate: i === 1 ? -1 : 1 }}
              whileInView={{ opacity: 1, y: 0, rotate: i === 1 ? -1 : 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.09 }}
            >
              <span className="blog-badge">Digital Whopper</span>
              <span className="blog-image" aria-hidden="true"><i /><i /><i /></span>
              <span className="blog-body">
                <strong>{b.title}</strong>
                <span>{b.excerpt}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="blog-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.article
              className="blog-modal-card"
              initial={{ y: 34, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 34, scale: 0.96 }}
              transition={{ duration: 0.28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="blog-modal-close" type="button" onClick={() => setActive(null)} aria-label="Close blog">
                x
              </button>
              <span className="blog-badge">Digital Whopper</span>
              <h3>{active.title}</h3>
              {(active.content || [active.excerpt]).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
