import { useEffect, useState } from "react";
import { getAllDonations, searchDonations } from "../services/donationService";
import DonationCard from "../components/DonationCard";
import DonationDetailModal from "../components/DonationDetailModal";
import DonationRequest from "./organization/DonationRequest";

export default function BrowseDonations({ user }) {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadDonations();
  }, [currentPage, pageSize, sortBy, sortDirection]);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const endpoint = `?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&direction=${sortDirection}`;
      const res = await getAllDonations(endpoint);
      const rawDonations = res.data.content || res.data || [];
      const availableDonations = rawDonations.filter((donation) => Number(donation?.quantity || 0) > 0);
      setDonations(availableDonations);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
      setError(null);
    } catch (err) {
      console.error("Error loading donations:", err);
      setError(err?.response?.data?.message || "Failed to load donations");
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setIsSearching(false);
      setCurrentPage(0);
      loadDonations();
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      const res = await searchDonations(term);
      const rawDonations = Array.isArray(res.data) ? res.data : res.data.content || [];
      const availableDonations = rawDonations.filter((donation) => Number(donation?.quantity || 0) > 0);
      setDonations(availableDonations);
      setTotalPages(1);
      setError(null);
    } catch (err) {
      console.error("Error searching donations:", err);
      setError("No donations found matching your search");
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    handleSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(0);
    loadDonations();
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  if (loading) return <div style={styles.loadingContainer}><p style={styles.loadingText}>Loading donations...</p></div>;
  if (error) return <div style={styles.errorContainer}><p style={styles.errorText}>Error: {error}</p></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Available Donations</h2>
        <p style={styles.subtitle}>Browse and request items from our community</p>
      </div>

      {/* Modern Search Bar */}
      <div style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Search donations by name, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button onClick={handleClearSearch} style={styles.clearBtn}>
              ✕
            </button>
          )}
          <button onClick={handleSearchClick} style={styles.searchBtn}>
            Search
          </button>
        </div>
        {isSearching && <p style={styles.searchStatus}>Showing results for: <strong>{searchTerm}</strong></p>}
      </div>

      {donations.length > 0 ? (
        <>
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
          
          <div style={styles.paginationContainer}>
            <div style={styles.paginationInfo}>
              <span style={styles.infoText}>
                Showing {donations.length} available donations on this page
              </span>
              <span style={styles.divider}>•</span>
              <span style={styles.infoText}>
                Page {currentPage + 1} of {totalPages || 1}
              </span>
            </div>
            
            <div style={styles.controls}>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                style={{...styles.btn, ...(currentPage === 0 ? styles.btnDisabled : {})}}
              >
                ← Previous
              </button>
              
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                style={styles.select}
              >
                {Array.from({ length: totalPages || 1 }, (_, i) => (
                  <option key={i} value={i}>
                    Page {i + 1}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                style={{...styles.btn, ...(currentPage >= totalPages - 1 ? styles.btnDisabled : {})}}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      ) : (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>No donations found.</p>
        </div>
      )}
      
      {selectedDonation && (
        <DonationDetailModal 
          donation={selectedDonation}
          onClose={() => {
            setSelectedDonation(null);
            setShowRequestForm(false);
          }}
        >
          <div style={styles.buttonSection}>
            {user && (user.role === "ORGANIZATION" || user.role === "ORG") ? (
              <button 
                onClick={() => setShowRequestForm(true)}
                style={{...styles.modalRequestBtn, ...(selectedDonation.quantity === 0 ? styles.modalRequestBtnDisabled : {})}}
                disabled={selectedDonation.quantity === 0}
              >
                {selectedDonation.quantity === 0 ? 'Out of Stock' : '📦 Request This Donation'}
              </button>
            ) : user ? (
              <p style={styles.loginPrompt}>Only organizations can request donations</p>
            ) : (
              <p style={styles.loginPrompt}>Please log in as an organization to request</p>
            )}
          </div>
        </DonationDetailModal>
      )}

      {showRequestForm && selectedDonation && (
        <DonationRequest 
          donation={selectedDonation}
          onClose={() => {
            setShowRequestForm(false);
            setSelectedDonation(null);
          }}
          onSuccess={() => {
            loadDonations();
          }}
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
    color: '#8da0f2',
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
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#999',
    margin: 0,
  },
  paginationContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1.5rem',
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e5e5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  paginationInfo: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  infoText: {
    color: '#666',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  divider: {
    color: '#ddd',
  },
  controls: {
    display: 'flex',
    gap: '0.8rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  btn: {
    background: '#8da0f2',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 200ms ease',
    ':hover': {
      background: '#1c7a94',
    },
  },
  btnDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  select: {
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
    cursor: 'pointer',
    background: 'white',
  },
  buttonSection: {
    width: '100%',
  },
  modalRequestBtn: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },
  modalRequestBtnDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
    opacity: 0.6,
    boxShadow: 'none',
  },
  loginPrompt: {
    textAlign: 'center',
    padding: '1rem',
    color: '#666',
    fontStyle: 'italic',
    margin: 0,
  },
  searchSection: {
    maxWidth: '1400px',
    margin: '0 auto 2rem',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4fc 100%)',
    borderRadius: '16px',
    border: '1px solid #e9eefb',
  },
  searchContainer: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: '1rem 1.5rem 1rem 1.5rem',
    fontSize: '0.95rem',
    border: '1px solid #d0d8f7',
    borderRadius: '12px',
    background: 'white',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(63, 91, 216, 0.08)',
    ':focus': {
      borderColor: '#3f5bd8',
      boxShadow: '0 4px 16px rgba(63, 91, 216, 0.15)',
    },
  },
  clearBtn: {
    position: 'absolute',
    right: '4.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#9ca3af',
    transition: 'color 0.2s ease',
    padding: '0.3rem 0.6rem',
  },
  searchBtn: {
    padding: '1rem 1.8rem',
    background: '#3f5bd8',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(63, 91, 216, 0.3)',
    whiteSpace: 'nowrap',
  },
  searchStatus: {
    marginTop: '0.8rem',
    fontSize: '0.85rem',
    color: '#3f5bd8',
    fontWeight: '500',
  },
};









