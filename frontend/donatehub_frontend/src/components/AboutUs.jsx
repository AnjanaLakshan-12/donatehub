import { useNavigate } from 'react-router-dom';
import { FaHeart, FaCheckCircle, FaUsers, FaChartLine, FaLock, FaArrowRight } from 'react-icons/fa';

export default function AboutUs({ user }) {
  const navigate = useNavigate();

  const stats = [
    { icon: '💰', label: 'Donated', value: 'Rs. 2.5M+' },
    { icon: '👥', label: 'Donors', value: '1,200+' },
    { icon: '🏢', label: 'Organizations', value: '45+' },
    { icon: '📄', label: 'Transparent', value: '100%' }
  ];

  const steps = [
    {
      icon: <FaHeart />,
      number: '1',
      title: 'Donors Register & Donate',
      description: 'Create an account and make secure donations to trusted causes'
    },
    {
      icon: <FaCheckCircle />,
      number: '2',
      title: 'Organizations Submit Campaigns',
      description: 'NGOs request donations for specific social initiatives'
    },
    {
      icon: <FaUsers />,
      number: '3',
      title: 'Admin Verifies & Approves',
      description: 'Our team ensures all organizations are legitimate and verified'
    },
    {
      icon: <FaChartLine />,
      number: '4',
      title: 'Donations Reach Right Hands',
      description: 'Real-time tracking and detailed reports for transparency'
    }
  ];

  const team = [
    {
      name: 'Your Name',
      role: 'Full Stack Developer',
      description: 'Passionate about building secure and meaningful systems'
    },
    {
      name: 'Team Member 2',
      role: 'Backend Engineer',
      description: 'Expert in database and API architecture'
    },
     {
      name: 'Team Member 2',
      role: 'Backend Engineer',
      description: 'Expert in database and API architecture'
    },
     {
      name: 'Team Member 2',
      role: 'Backend Engineer',
      description: 'Expert in database and API architecture'
    },
     {
      name: 'Team Member 2',
      role: 'Backend Engineer',
      description: 'Expert in database and API architecture'
    },
     {
      name: 'Team Member 2',
      role: 'Backend Engineer',
      description: 'Expert in database and API architecture'
    },
     {
      name: 'Team Member 2',
      role: 'Backend Engineer',
      description: 'Expert in database and API architecture'
    },
     {
      name: 'Team Member 2',
      role: 'Backend Engineer',
      description: 'Expert in database and API architecture'
    },
    {
      name: 'Team Member 3',
      role: 'UI/UX Designer',
      description: 'Creating beautiful and intuitive user experiences'
    }
    
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <img 
          src="/about_us.jpeg" 
          alt="About DonateHub" 
          style={styles.heroBackground}
        />
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Connecting Hearts Through Giving</h1>
          <p style={styles.heroSubtitle}>
            DonateHub is a transparent platform that connects donors with trusted organizations to make real-world impact.
          </p>
          <div style={styles.heroButtons}>
            <button
              onClick={() => user?.role === 'DONOR' ? navigate('/donor/add-donation') : navigate('/login')}
              style={styles.primaryBtn}
            >
              Start Donating
              <FaArrowRight style={{ marginLeft: '8px' }} />
            </button>
            <button
              onClick={() => navigate('/browse-donations')}
              style={styles.secondaryBtn}
            >
              Browse Donations
            </button>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section style={styles.missionSection}>
        <h2 style={styles.sectionTitle}>Our Mission & Vision</h2>
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <div style={styles.cardIcon}>🎯</div>
            <h3 style={styles.cardTitle}>Our Mission</h3>
            <p style={styles.cardText}>
              To make donations transparent, secure, and accessible for everyone. We believe every contribution matters.
            </p>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>🌍</div>
            <h3 style={styles.cardTitle}>Our Vision</h3>
            <p style={styles.cardText}>
              A world where every donation creates meaningful change and communities thrive through collective generosity.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={styles.howItWorksSection}>
        <h2 style={styles.sectionTitle}>How DonateHub Works</h2>
        <div style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={index} style={styles.stepCard}>
              <div style={styles.stepIcon}>{step.icon}</div>
              <div style={styles.stepNumber}>{step.number}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDescription}>{step.description}</p>
              {index < steps.length - 1 && <div style={styles.stepArrow}>→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section style={styles.impactSection}>
        <h2 style={styles.sectionTitle}>Our Impact</h2>
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} style={styles.statCard}>
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency & Trust Section */}
      <section style={styles.trustSection}>
        <h2 style={styles.sectionTitle}>Transparency & Trust</h2>
        <p style={styles.trustDescription}>
          We believe trust is built through transparency. Every donation is tracked, verified, and reported in real time.
        </p>
        <div style={styles.trustGrid}>
          <div style={styles.trustItem}>
            <div style={styles.trustCheck}>✓</div>
            <h4 style={styles.trustItemTitle}>Admin-Verified Organizations</h4>
            <p style={styles.trustItemText}>All organizations go through rigorous verification process</p>
          </div>
          <div style={styles.trustItem}>
            <div style={styles.trustCheck}>✓</div>
            <h4 style={styles.trustItemTitle}>Donation Status Tracking</h4>
            <p style={styles.trustItemText}>Real-time updates on where your donation goes</p>
          </div>
          <div style={styles.trustItem}>
            <div style={styles.trustCheck}>✓</div>
            <h4 style={styles.trustItemTitle}>Downloadable Reports</h4>
            <p style={styles.trustItemText}>Access detailed reports and impact summaries anytime</p>
          </div>
          <div style={styles.trustItem}>
            <div style={styles.trustCheck}>✓</div>
            <h4 style={styles.trustItemTitle}>Secure Transactions</h4>
            <p style={styles.trustItemText}>Bank-level security for all monetary transactions</p>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section style={styles.teamSection}>
        <h2 style={styles.sectionTitle}>Our Team</h2>
        <div style={styles.teamGrid}>
          {team.map((member, index) => (
            <div key={index} style={styles.teamCard}>
              <div style={styles.teamAvatar}>
                {member.name.charAt(0)}
              </div>
              <h3 style={styles.teamName}>{member.name}</h3>
              <p style={styles.teamRole}>{member.role}</p>
              <p style={styles.teamDescription}>{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Make a Difference?</h2>
        <p style={styles.ctaDescription}>
          Join thousands of donors and organizations working together to create positive change in our communities.
        </p>
        <div style={styles.ctaButtons}>
          <button
            onClick={() => user?.role === 'DONOR' ? navigate('/donor/add-donation') : navigate('/login')}
            style={styles.ctaPrimaryBtn}
          >
            Donate Now
          </button>
          <button
            onClick={() => navigate('/browse-donations')}
            style={styles.ctaSecondaryBtn}
          >
            Join as an Organization
          </button>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#2c3e50',
    backgroundColor: '#f8f9fa',
  },

  // Hero Section
  heroSection: {
    position: 'relative',
    color: 'white',
    padding: '120px 20px',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(63, 91, 216, 0.7) 0%, rgba(91, 126, 238, 0.6) 100%)',
    zIndex: 1,
  },
  heroContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '50px',
    maxWidth: '1200px',
    width: '100%',
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: '600px',
    position: 'relative',
    zIndex: 2,
  },
  heroImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    maxWidth: '500px',
    height: 'auto',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    objectFit: 'cover',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '20px',
    lineHeight: '1.2',
    textAlign: 'left',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    marginBottom: '40px',
    opacity: 0.95,
    lineHeight: '1.6',
    textAlign: 'left',
  },
  heroButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    backgroundColor: 'white',
    color: '#3f5bd8',
    border: 'none',
    padding: '14px 32px',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    padding: '12px 30px',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  // Mission & Vision
  missionSection: {
    padding: '80px 20px',
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '60px',
    color: '#2c3e50',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  card: {
    background: 'white',
    padding: '40px 30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  cardIcon: {
    fontSize: '3rem',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#3f5bd8',
  },
  cardText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#555',
  },

  // How It Works
  howItWorksSection: {
    padding: '80px 20px',
    backgroundColor: '#f8f9fa',
  },
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  stepCard: {
    background: 'white',
    padding: '40px 25px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    textAlign: 'center',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  stepIcon: {
    fontSize: '2.5rem',
    color: '#3f5bd8',
    marginBottom: '15px',
  },
  stepNumber: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#e5f3ff',
    marginBottom: '10px',
  },
  stepTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#2c3e50',
  },
  stepDescription: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.5',
  },
  stepArrow: {
    position: 'absolute',
    right: '-20px',
    top: '50%',
    fontSize: '2rem',
    color: '#3f5bd8',
    transform: 'translateY(-50%)',
  },

  // Impact
  impactSection: {
    padding: '80px 20px',
    backgroundColor: 'white',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  statCard: {
    background: 'linear-gradient(135deg, #5b7eee 0%, #3f5bd8 100%)',
    color: 'white',
    padding: '40px 20px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(91, 126, 238, 0.2)',
  },
  statIcon: {
    fontSize: '2.5rem',
    marginBottom: '15px',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '1rem',
    opacity: 0.95,
  },

  // Trust Section
  trustSection: {
    padding: '80px 20px',
    backgroundColor: '#f8f9fa',
  },
  trustDescription: {
    fontSize: '1.1rem',
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto 60px',
    color: '#555',
    lineHeight: '1.7',
  },
  trustGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  trustItem: {
    background: 'white',
    padding: '30px 25px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
  },
  trustCheck: {
    width: '50px',
    height: '50px',
    background: '#3f5bd8',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    fontWeight: '800',
    marginBottom: '15px',
  },
  trustItemTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  trustItemText: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.5',
  },

  // Team Section
  teamSection: {
    padding: '80px 20px',
    backgroundColor: 'white',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '40px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  teamCard: {
    background: '#f8f9fa',
    padding: '40px 25px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  teamAvatar: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #5b7eee 0%, #3f5bd8 100%)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: '800',
    margin: '0 auto 20px',
  },
  teamName: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#2c3e50',
  },
  teamRole: {
    fontSize: '1rem',
    color: '#3f5bd8',
    fontWeight: '600',
    marginBottom: '12px',
  },
  teamDescription: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.5',
  },

  // CTA Section
  ctaSection: {
    background: 'linear-gradient(135deg, #5b7eee 0%, #3f5bd8 100%)',
    color: 'white',
    padding: '80px 20px',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '20px',
  },
  ctaDescription: {
    fontSize: '1.1rem',
    maxWidth: '600px',
    margin: '0 auto 40px',
    opacity: 0.95,
    lineHeight: '1.7',
  },
  ctaButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimaryBtn: {
    backgroundColor: 'white',
    color: '#3f5bd8',
    border: 'none',
    padding: '14px 32px',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  ctaSecondaryBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    padding: '12px 30px',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};