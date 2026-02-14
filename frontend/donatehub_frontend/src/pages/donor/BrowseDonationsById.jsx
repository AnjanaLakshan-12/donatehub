import { useEffect, useState, useMemo } from "react";
import { getDonationsByUser } from "../../services/donationService";
import DonationCard from "../../components/DonationCard";
import DonationDetailModal from "../../components/DonationDetailModal";

export default function BrowseDonationsById({ user }) {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedUser = useMemo(() => {
    if (user) return user;
    try {
      const raw = localStorage.getItem("donateHubUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [user]);

  useEffect(() => {
    console.log("Stored user:", storedUser);
    if (storedUser?.email || storedUser?.username || storedUser?.userName) {
      loadMyDonations();
    } else {
      setError("Please log in to view your donations");
      setLoading(false);
    }
  }, [storedUser]);

  const loadMyDonations = async () => {
    try {
      setLoading(true);
      const email = storedUser.email || storedUser.username || storedUser.userName;
      if (!email) {
        setError("User email not found. Please log in again.");
        setDonations([]);
        setLoading(false);
        return;
      }
      console.log("Loading donations for email:", email);
      const res = await getDonationsByUser(email);
      setDonations(res.data.content || res.data || []);
      setError(null);
    } catch (err) {
      console.error("Error loading my donations:", err);
      setError(err?.response?.data?.message || "Failed to load your donations");
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loadingContainer}><p style={styles.loadingText}>Loading your donations...</p></div>;
  if (error) return <div style={styles.errorContainer}><p style={styles.errorText}>{error}</p></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Donations</h2>
        <p style={styles.subtitle}>Manage and track all your donated items</p>
      </div>

      {donations.length > 0 ? (
        <div style={styles.gridContainer}>
          <div style={styles.grid}>
            {donations.map(d => (
              <DonationCard 
                key={d.id} 
                donation={d}
                onCardClick={setSelectedDonation}
              />
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>You haven't added any donations yet.</p>
          <p style={styles.emptySubtext}>Start by creating your first donation to help others in need.</p>
        </div>
      )}

      {selectedDonation && (
        <DonationDetailModal 
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
          showRequests={true}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    background: '#f6f9ff',
    padding: '2rem',
  },
  header: {
    maxWidth: '1400px',
    margin: '0 auto 2rem',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#3f5bd8',
    marginBottom: '0.3rem',
    marginTop: 0,
  },
  subtitle: {
    color: '#666',
    fontSize: '0.95rem',
    marginTop: 0,
  },
  gridContainer: {
    maxWidth: '1400px',
    margin: '0 auto 2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  loadingContainer: {
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f6f9ff',
  },
  loadingText: {
    fontSize: '1.1rem',
    color: '#666',
  },
  errorContainer: {
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f6f9ff',
  },
  errorText: {
    fontSize: '1.1rem',
    color: '#d32f2f',
  },
  emptyContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '3rem',
    textAlign: 'center',
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e5e5',
    boxShadow: '0 2px 8px rgba(63, 91, 216, 0.08)',
  },
  emptyText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2a44',
    marginBottom: '0.5rem',
    margin: 0,
  },
  emptySubtext: {
    fontSize: '0.95rem',
    color: '#6b7280',
    margin: '0.5rem 0 0 0',
  },
};