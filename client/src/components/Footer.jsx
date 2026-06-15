import { Link } from 'react-router-dom';

export default function Footer({ site, services }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="nav-logo" to="/">
              <span className="dot" />
              {(site && site.brandName) || 'Digital Whopper'}
            </Link>

            <p>{site && site.address}</p>

            <p>
              <a href={`tel:${((site && site.phone) || '').replace(/\s/g, '')}`}>
                {site && site.phone}
              </a>
              <br />
              {site && site.email}
            </p>

            <div className="footer-socials">
              <a
                href={site && site.socials && site.socials.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
                </svg>
              </a>

              <a
                href={site && site.socials && site.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              <a
                href={site && site.socials && site.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.3 18.3V10H5.7v8.3h2.6zM7 8.8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11.3 9.5v-4.7c0-2.5-1.3-3.7-3.1-3.7-1.4 0-2.1.8-2.4 1.4V10h-2.6v8.3h2.6v-4.6c0-1.2.8-1.9 1.7-1.9.9 0 1.4.6 1.4 1.9v4.6h2.4z" />
                </svg>
              </a>
            </div>
          </div>

          <nav>
            <h4>Pages</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/#about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>

          <nav>
            <h4>Our services</h4>
            <ul>
              {services.slice(0, 5).map((s) => (
                <li key={s.slug || s.title}>
                  <Link to="/services">{s.title}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <h4>Quick links</h4>
            <ul>
              <li><Link to="/#blog">Blog</Link></li>
              <li><Link to="/#faq">FAQ</Link></li>
              <li><Link to="/#milestones">Our journey</Link></li>
              <li>
                <a
                  href={site && site.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {(site && site.brandName) || 'Digital Whopper'}. All rights reserved.
          </span>
          <span>Made with ✦ in Jaipur, the Pink City</span>
        </div>
      </div>
    </footer>
  );
}