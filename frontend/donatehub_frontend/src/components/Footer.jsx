export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.mainContent}>
          {/* Left Section - Brand */}
          <div style={styles.brandSection}>
            <div style={styles.logoContainer}>
              <span style={styles.logo}>🤲</span>
              <h2 style={styles.brandName}>DONATEHUB</h2>
            </div>
            <p style={styles.tagline}>
              Connecting generous donors with organizations in need,
              making charitable giving simple, transparent, and impactful.
            </p>
            
            {/* Social Media Icons */}
            <div style={styles.socialLinks}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialIcon}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.socialIcon}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.socialIcon}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.socialIcon}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
            </div>

            <button onClick={scrollToTop} style={styles.backToTopBtn}>
              <span style={styles.arrowIcon}>↑</span> BACK TO TOP
            </button>
          </div>

          {/* Middle Section - Site Map */}
          <div style={styles.linksSection}>
            <h3 style={styles.sectionTitle}>Site Map</h3>
            <ul style={styles.linksList}>
              <li style={styles.linkItem}><a href="/" style={styles.link}>Homepage</a></li>
              <li style={styles.linkItem}><a href="/browse-donations" style={styles.link}>Browse Donations</a></li>
              <li style={styles.linkItem}><a href="/donor-dashboard" style={styles.link}>For Donors</a></li>
              <li style={styles.linkItem}><a href="/organization-profile" style={styles.link}>For Organizations</a></li>
              <li style={styles.linkItem}><a href="/register" style={styles.link}>Get Started</a></li>
              <li style={styles.linkItem}><a href="/login" style={styles.link}>Login</a></li>
            </ul>
          </div>

          {/* Right Section - Legal */}
          <div style={styles.linksSection}>
            <h3 style={styles.sectionTitle}>Legal</h3>
            <ul style={styles.linksList}>
              <li style={styles.linkItem}><a href="#" style={styles.link}>Privacy Policy</a></li>
              <li style={styles.linkItem}><a href="#" style={styles.link}>Terms of Service</a></li>
              <li style={styles.linkItem}><a href="#" style={styles.link}>Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={styles.copyrightBar}>
        <div style={styles.container}>
          <p style={styles.copyrightText}>
            Copyright © {new Date().getFullYear()} DonateHub. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#3045a4',
    color: 'white',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '3rem',
    padding: '3rem 0',
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  },
  logo: {
    fontSize: '2rem',
  },
  brandName: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '1px',
  },
  tagline: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.85)',
    margin: 0,
    maxWidth: '400px',
  },
  socialLinks: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  socialIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textDecoration: 'none',
    transition: 'all 200ms ease',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  backToTopBtn: {
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '0.7rem 1.5rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
    transition: 'all 200ms ease',
    width: 'fit-content',
  },
  arrowIcon: {
    fontSize: '1.2rem',
  },
  linksSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    margin: 0,
    marginBottom: '0.5rem',
  },
  linksList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
  },
  linkItem: {
    margin: 0,
  },
  link: {
    color: 'rgba(255, 255, 255, 0.85)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 200ms ease',
  },
  copyrightBar: {
    background: '#3045a4',
    padding: '1rem 0',
  },
  copyrightText: {
    margin: 0,
    fontSize: '0.9rem',
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
  },
};