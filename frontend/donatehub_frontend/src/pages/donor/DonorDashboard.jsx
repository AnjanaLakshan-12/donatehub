import { useNavigate } from "react-router-dom";
import BrowseDonationsById from "./BrowseDonationsById";
import { FaHandHoldingHeart, FaPlus } from 'react-icons/fa';

export default function DonorDashboard({ user }) {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.heroSection}>
            <div style={styles.iconCircle}>
              <FaHandHoldingHeart style={styles.heroIcon} />
            </div>
            <div>
              <h1 style={styles.title}>Donor Dashboard</h1>
              <p style={styles.subtitle}>Manage your donations and make a difference in your community</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/donor/add-donation")}
            style={styles.addBtn}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(141, 160, 242, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(141, 160, 242, 0.3)';
            }}
          >
            <FaPlus style={{ marginRight: '0.5rem' }} />
            Donate Now!
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <BrowseDonationsById user={user} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    background: 'linear-gradient(135deg, #f6f9ff 0%, #e8f1ff 100%)',
    padding: '2rem',
  },
  header: {
    maxWidth: '1400px',
    margin: '0 auto 2rem',
  },
  headerContent: {
    background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
    borderRadius: '20px',
    padding: '2.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.5rem',
    boxShadow: '0 10px 40px rgba(141, 160, 242, 0.3)',
    animation: 'slideDown 0.6s ease-out',
  },
  heroSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  },
  heroIcon: {
    fontSize: '2.5rem',
    color: 'white',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '0.5rem',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  subtitle: {
    color: 'white',
    fontSize: '1rem',
    opacity: 0.95,
    lineHeight: '1.6',
  },
  addBtn: {
    background: 'white',
    color: '#8da0f2',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(141, 160, 242, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    animation: 'fadeInUp 0.6s ease-out',
  },
};