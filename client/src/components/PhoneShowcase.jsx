import { memo, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const PROJECTS = [
  {
    title: 'D2C Storefront',
    meta: 'Shopify conversion build',
    type: 'store',
    tone: '#ff4d8d',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=760&q=68'
  },
  {
    title: 'Performance Ads',
    meta: 'Meta + Google funnels',
    type: 'ads',
    tone: '#ffb454',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=760&q=68'
  },
  {
    title: 'Analytics Hub',
    meta: 'SEO growth dashboard',
    type: 'analytics',
    tone: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=760&q=68'
  },
  {
    title: 'Social Launch',
    meta: 'Reels and creator content',
    type: 'social',
    tone: '#22d3ee',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=760&q=68'
  },
  {
    title: 'E-Commerce App',
    meta: 'Mobile-first shopping',
    type: 'commerce',
    tone: '#34d399',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=760&q=68'
  },
  {
    title: 'Brand System',
    meta: 'Identity and campaign kit',
    type: 'brand',
    tone: '#f472b6',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=760&q=68'
  },
  {
    title: 'Lead Engine',
    meta: 'Landing page + CRM flow',
    type: 'leads',
    tone: '#60a5fa',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=760&q=68'
  },
  {
    title: 'Mobile Checkout',
    meta: 'Fast cart experience',
    type: 'store',
    tone: '#fb7185',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=760&q=68'
  },
  {
    title: 'Creator Ads',
    meta: 'Short-form launch kit',
    type: 'social',
    tone: '#38bdf8',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=760&q=68'
  },
  {
    title: 'CRM Flow',
    meta: 'Lead nurture system',
    type: 'leads',
    tone: '#a78bfa',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=760&q=68'
  }
];

const RIGHT_PROJECTS = [...PROJECTS].reverse();

const fallbackImage =
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=760&q=68';

const ProjectTile = memo(function ProjectTile({ project }) {
  return (
    <div
      className={`project-wall-card ${project.type}`}
      style={{ '--th': project.tone }}
    >
      <div className="project-wall-screen">
        <img
          src={project.image}
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />
      </div>

      <div className="project-wall-copy">
        <b>{project.title}</b>
        <span>{project.meta}</span>
      </div>
    </div>
  );
});

export default function PhoneShowcase() {
  const reduceMotion = useReducedMotion();
  const [cinematicScrolling, setCinematicScrolling] = useState(false);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleResize();

    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleState = (event) => setCinematicScrolling(Boolean(event.detail));

    window.addEventListener('cinematic-scroll-state', handleState);

    return () => {
      window.removeEventListener('cinematic-scroll-state', handleState);
    };
  }, []);

  if (isMobile) return null;

  return (
    <section
      className={`showcase project-showcase${cinematicScrolling ? ' cinematic-lite' : ''}`}
      id="work"
    >
      {cinematicScrolling && (
        <style>{`
          .project-showcase.cinematic-lite,
          .project-showcase.cinematic-lite *,
          .project-showcase.cinematic-lite *::before,
          .project-showcase.cinematic-lite *::after {
            animation-play-state: paused !important;
            transition: none !important;
          }

          .project-showcase.cinematic-lite .hand-phone-video {
            visibility: hidden !important;
          }

          .project-showcase.cinematic-lite .hand-phone-stage {
            filter: none !important;
          }

          .project-showcase.cinematic-lite .project-wall-card {
            box-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          .project-showcase.cinematic-lite .project-wall-screen img,
          .project-showcase.cinematic-lite .hand-phone-img {
            filter: none !important;
          }
        `}</style>
      )}

      <div className="showcase-sticky project-showcase-inner">
        <div className="container showcase-head project-showcase-head">
          <span className="eyebrow">Our work</span>

          <h2 className="section-title">
            Projects that <span className="grad">whoop</span> in your hand
          </h2>
        </div>

        <motion.div
          className="project-showcase-layout"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="project-side-grid" aria-hidden="true">
            {PROJECTS.map((project) => (
              <ProjectTile key={`left-${project.title}`} project={project} />
            ))}
          </div>

          <div className="hand-phone-stage">
            <div className="hand-phone-motion">
              <img
                className="hand-phone-img"
                src="/assets/project-phone-hand.png"
                alt=""
                draggable="false"
                loading="lazy"
                decoding="async"
              />

              <div className="hand-phone-video" aria-hidden="true">
                <div className="video-grid" />
                <div className="video-core" />

                <div className="video-kpis">
                  <span>ROI 3.2x</span>
                  <span>SEO +184%</span>
                  <span>ADS LIVE</span>
                </div>

                <div className="video-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
          </div>

          <div className="project-side-grid" aria-hidden="true">
            {RIGHT_PROJECTS.map((project) => (
              <ProjectTile key={`right-${project.title}`} project={project} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}