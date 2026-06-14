import { motion } from 'framer-motion';

const PROJECTS = [
  {
    title: 'D2C Storefront',
    meta: 'Shopify conversion build',
    type: 'store',
    tone: '#ff4d8d',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'Performance Ads',
    meta: 'Meta + Google funnels',
    type: 'ads',
    tone: '#ffb454',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'Analytics Hub',
    meta: 'SEO growth dashboard',
    type: 'analytics',
    tone: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'Social Launch',
    meta: 'Reels and creator content',
    type: 'social',
    tone: '#22d3ee',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'E-Commerce App',
    meta: 'Mobile-first shopping',
    type: 'commerce',
    tone: '#34d399',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'Brand System',
    meta: 'Identity and campaign kit',
    type: 'brand',
    tone: '#f472b6',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'Lead Engine',
    meta: 'Landing page + CRM flow',
    type: 'leads',
    tone: '#60a5fa',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'Mobile Checkout',
    meta: 'Fast cart experience',
    type: 'store',
    tone: '#fb7185',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'Creator Ads',
    meta: 'Short-form launch kit',
    type: 'social',
    tone: '#38bdf8',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'CRM Flow',
    meta: 'Lead nurture system',
    type: 'leads',
    tone: '#a78bfa',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85'
  }
];

function ProjectTile({ project, index }) {
  return (
    <motion.div
      className={`project-wall-card ${project.type}`}
      style={{ '--th': project.tone }}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: index * 0.025, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="project-wall-screen">
        <img
          src={project.image}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src =
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85';
          }}
        />
      </div>

      <div className="project-wall-copy">
        <b>{project.title}</b>
        <span>{project.meta}</span>
      </div>
    </motion.div>
  );
}

export default function PhoneShowcase() {
  return (
    <section className="showcase project-showcase" id="work">
      <div className="showcase-sticky project-showcase-inner">
        <div className="container showcase-head project-showcase-head">
          <span className="eyebrow">Our work</span>
          <h2 className="section-title">
            Projects that <span className="grad">whoop</span> in your hand
          </h2>
        </div>

        <div className="project-showcase-layout">
          <div className="project-side-grid" aria-hidden="true">
            {PROJECTS.map((project, index) => (
              <ProjectTile key={`left-${project.title}`} project={project} index={index} />
            ))}
          </div>

          <div className="hand-phone-stage">
            <motion.div
              className="hand-phone-motion"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                className="hand-phone-img"
                src="/assets/project-phone-hand.png"
                alt=""
                draggable="false"
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
            </motion.div>
          </div>

          <div className="project-side-grid" aria-hidden="true">
            {[...PROJECTS].reverse().map((project, index) => (
              <ProjectTile key={`right-${project.title}`} project={project} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}