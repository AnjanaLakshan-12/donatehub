import { useState, useEffect } from "react";
import { getUserById } from "../../services/userService";

export default function UserProfile({ user }) {
  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await getUserById(user.id);
        console.log("User data received:", res.data);
        setProfileData(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        // Fallback to the user prop if fetch fails
        setProfileData(user);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user?.id]);

  if (!profileData) {
    return <div>No user information available</div>;
  }

  const userData = profileData;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Profile</h1>
        <p style={styles.subtitle}>Your account information and details</p>
      </div>

      {loading && <p style={styles.loadingText}>Loading your profile...</p>}
      
      <div style={styles.profileGrid}>
        {/* Profile Card */}
        <div style={styles.profileHeaderCard}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              {userData.firstName?.[0]}{userData.lastName?.[0]}
            </div>
          </div>
          <div style={styles.profileHeaderContent}>
            <h2 style={styles.fullName}>
              {userData.firstName || userData.first_name || "N/A"} {userData.lastName || userData.last_name || userData.lname || userData.surname || "N/A"}
            </h2>
            <div style={styles.roleContainer}>
              <span style={{...styles.roleBadge, ...getRoleBadgeStyle(userData.role)}}>
                {userData.role === "DONOR" ? "👤 Donor" : userData.role === "ORG" || userData.role === "ORGANIZATION" ? "🏢 Organization" : "👨‍💼 Admin"}
              </span>
            </div>
            <p style={styles.memberSince}>Member since 2024</p>
          </div>
        </div>

        {/* Info Grid */}
        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>✉️</div>
            <div style={styles.infoContent}>
              <label style={styles.infoLabel}>Email Address</label>
              <p style={styles.infoValue}>{userData.email || "Not specified"}</p>
            </div>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>📍</div>
            <div style={styles.infoContent}>
              <label style={styles.infoLabel}>Location</label>
              <p style={styles.infoValue}>{userData.district || userData.location || userData.address || "Not specified"}</p>
            </div>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>🆔</div>
            <div style={styles.infoContent}>
              <label style={styles.infoLabel}>First Name</label>
              <p style={styles.infoValue}>{userData.firstName || userData.first_name || "Not specified"}</p>
            </div>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>📝</div>
            <div style={styles.infoContent}>
              <label style={styles.infoLabel}>Last Name</label>
              <p style={styles.infoValue}>{userData.lastName || userData.last_name || userData.lname || userData.surname || "Not specified"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getRoleBadgeStyle(role) {
  if (role === "DONOR") {
    return { background: '#ecfdf5', color: '#059669' };
  } else if (role === "ORG" || role === "ORGANIZATION") {
    return { background: '#eff6ff', color: '#0284c7' };
  } else {
    return { background: '#fef3c7', color: '#b45309' };
  }
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    background: '#f6f9ff',
    padding: '2rem 1rem',
    paddingTop: '2rem',
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#3f5bd8',
    marginBottom: '0.3rem',
    marginTop: 0,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '1rem',
    marginTop: 0,
    fontWeight: '500',
  },
  loadingText: {
    fontSize: '1.1rem',
    color: '#3f5bd8',
    textAlign: 'center',
    fontWeight: '500',
  },
  profileGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  profileHeaderCard: {
    background: 'linear-gradient(135deg, #3f5bd8 0%, #5b7ef5 100%)',
    borderRadius: '20px',
    padding: '2rem',
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    color: 'white',
    marginBottom: '2rem',
    boxShadow: '0 8px 32px rgba(63, 91, 216, 0.25)',
  },
  avatarContainer: {
    flexShrink: 0,
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: '700',
    border: '3px solid rgba(255, 255, 255, 0.5)',
  },
  profileHeaderContent: {
    flex: 1,
  },
  fullName: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 1rem 0',
  },
  roleContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    minWidth: '120px',
    textAlign: 'center',
  },
  memberSince: {
    fontSize: '0.95rem',
    opacity: 0.9,
    margin: 0,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  infoCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start',
    border: '1px solid #e9eefb',
    boxShadow: '0 4px 12px rgba(63, 91, 216, 0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  infoIcon: {
    fontSize: '2rem',
    flexShrink: 0,
    marginTop: '0.2rem',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.5rem',
  },
  infoValue: {
    fontSize: '1.1rem',
    color: '#1f2a44',
    fontWeight: '600',
    margin: 0,
    wordBreak: 'break-word',
  },
};