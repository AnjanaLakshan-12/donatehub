import { useState, useEffect } from 'react';
import { getDonationRequestsByDonationId, handleRequestStatus } from '../services/donationRequest';

export default function DonationDetailModal({ donation, onClose, children, showRequests = false }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (donation?.id && showRequests) {
      fetchDonationRequests();
    }
  }, [donation?.id, showRequests]);

  const fetchDonationRequests = async () => {
    setLoading(true);
    try {
      const response = await getDonationRequestsByDonationId(donation.id);
      console.log("Donation requests response:", response.data);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching donation requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, status) => {
    setActionLoading(requestId);
    try {
      await handleRequestStatus(requestId, status);
      await fetchDonationRequests();
      alert(`Request ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error(`Error ${status.toLowerCase()} request:`, error);
      alert(`Failed to ${status.toLowerCase()} request: ${error.response?.data || error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (!donation) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          style={styles.closeBtn}
        >
          ✕
        </button>
        
        <div style={styles.content}>
          {donation.id && (
            <div style={styles.imageSection}>
              <img 
                src={`http://localhost:8080/api/v1/donations/${donation.id}/image`}
                alt={donation.title}
                style={styles.image}
              />
              <div style={styles.statusOverlay}>
                <span style={getStatusBadgeStyle(donation.status)}>{donation.status}</span>
              </div>
            </div>
          )}
          
          <div style={styles.contentWrapper}>
            <h2 style={styles.title}>{donation.title}</h2>
            
            <p style={styles.description}>{donation.description}</p>
            
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Category</span>
                <p style={styles.detailValue}>{donation.category?.name || "N/A"}</p>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Quantity</span>
                <p style={{...styles.detailValue, ...(donation.quantity === 0 ? {color: '#e74c3c'} : {color: '#27ae60'})}}> 
                  {donation.quantity} {donation.quantity === 1 ? 'unit' : 'units'}
                </p>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Location</span>
                <p style={styles.detailValue}>{donation.location || "N/A"}</p>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Posted By</span>
                <p style={styles.detailValue}>
                  {donation.donor 
                    ? `${donation.donor.firstName || ''} ${donation.donor.lastName || ''}`.trim() || donation.donor.email || 'Anonymous'
                    : 'Anonymous'
                  }
                </p>
              </div>
              
              {(donation.donationDate || donation.createdAt) && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Donation Date</span>
                  <p style={styles.detailValue}>{new Date(donation.donationDate || donation.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {children && <div style={styles.childrenContainer}>{children}</div>}
            
            {showRequests && (
              <div style={styles.requestsSection}>
                <h3 style={styles.requestsTitle}>Donation Requests</h3>
              {loading ? (
                <p style={styles.loadingText}>Loading requests...</p>
              ) : requests.length > 0 ? (
                <div style={styles.requestsList}>
                  {requests.map((request) => (
                    <div 
                      key={request.id}
                      style={styles.requestItem}
                    >
                      <div style={styles.requestHeader}>
                        <span style={styles.requestName}>
                          {request.organization
                            ? `${request.organization.firstName || ''} ${request.organization.lastName || ''}`.trim() || request.organization.email || 'Unknown Organization'
                            : request.organizationName || request.user?.username || 'Unknown Organization'
                          }
                        </span>
                        <span style={getRequestStatusBadgeStyle(request.status)}>{request.status}</span>
                      </div>
                      <div style={styles.requestDetails}>
                        {request.requestedQuantity && (
                          <p style={styles.requestField}><strong>Quantity Requested:</strong> {request.requestedQuantity} units</p>
                        )}
                        <p style={styles.requestField}><strong>Purpose:</strong> {request.purpose}</p>
                        {(request.requestDate || request.createdAt) && (
                          <p style={styles.requestField}>
                            <strong>Requested on:</strong> {new Date(request.requestDate || request.createdAt).toLocaleDateString()}
                          </p>
                        )}
                        {(request.organization?.email || request.email) && (
                          <p style={styles.requestField}>
                            <strong>Contact:</strong> {request.organization?.email || request.email}
                          </p>
                        )}
                        
                        {request.status === 'PENDING' && (
                          <div style={styles.actionButtons}>
                            <button 
                              onClick={() => handleAction(request.id, 'APPROVED')}
                              disabled={actionLoading === request.id}
                              style={{...styles.btn, ...styles.btnApprove, ...(actionLoading === request.id ? styles.btnDisabled : {})}}
                            >
                              {actionLoading === request.id ? 'Processing...' : 'Approve'}
                            </button>
                            <button 
                              onClick={() => handleAction(request.id, 'REJECTED')}
                              disabled={actionLoading === request.id}
                              style={{...styles.btn, ...styles.btnReject, ...(actionLoading === request.id ? styles.btnDisabled : {})}}
                            >
                              {actionLoading === request.id ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.noRequestsText}>No donation requests yet for this donation.</p>
              )}
              </div>
            )}
            
            <button 
              onClick={onClose}
              style={styles.closeMainBtn}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'white',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    transition: 'all 200ms ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  imageSection: {
    position: 'relative',
    width: '100%',
    paddingBottom: '50%',
    background: '#f0f0f0',
    overflow: 'hidden',
    flex: 'none',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  statusOverlay: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    zIndex: 5,
  },
  contentWrapper: {
    flex: 1,
    overflow: 'auto',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '0.8rem',
    marginTop: 0,
  },
  description: {
    fontSize: '0.95rem',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
    padding: '1rem',
    background: '#f9f9f9',
    borderRadius: '12px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    color: '#999',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '0.3rem',
  },
  detailValue: {
    fontSize: '0.95rem',
    color: '#2c3e50',
    fontWeight: '500',
    margin: 0,
  },
  childrenContainer: {
    marginBottom: '1.5rem',
  },
  requestsSection: {
    marginTop: 'auto',
    borderTop: '2px solid #e5e5e5',
    paddingTop: '1.5rem',
  },
  requestsTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '1rem',
    marginTop: 0,
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  requestItem: {
    background: '#f9f9f9',
    border: '1px solid #e5e5e5',
    borderRadius: '10px',
    padding: '1rem',
  },
  requestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.8rem',
  },
  requestName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#2c3e50',
  },
  requestDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  requestField: {
    fontSize: '0.85rem',
    color: '#555',
    margin: 0,
    lineHeight: '1.4',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.8rem',
    marginTop: '1rem',
  },
  btn: {
    flex: 1,
    padding: '0.7rem 1.2rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 200ms ease',
  },
  btnApprove: {
    background: '#1f8aa5',
    color: 'white',
  },
  btnReject: {
    background: '#dc3545',
    color: 'white',
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  closeMainBtn: {
    background: '#8da0f2',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    marginTop: '1rem',
    width: '100%',
  },
  loadingText: {
    fontSize: '0.95rem',
    color: '#666',
    textAlign: 'center',
    padding: '1rem',
  },
  noRequestsText: {
    fontSize: '0.95rem',
    color: '#999',
    textAlign: 'center',
    padding: '1rem',
  },
};

function getStatusBadgeStyle(status) {
  const colors = {
    AVAILABLE: { bg: "rgba(141, 160, 242, 0.15)", text: "#8da0f2" },
    RESERVED: { bg: "rgba(245, 158, 11, 0.15)", text: "#ff9800" },
    DONATED: { bg: "rgba(161, 161, 170, 0.15)", text: "#808080" }
  };
  const style = colors[status] || colors.DONATED;
  return {
    display: "inline-block",
    padding: "0.5rem 1.25rem",
    backgroundColor: style.bg,
    color: style.text,
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "0.9rem",
    letterSpacing: "0.5px"
  };
}

function getRequestStatusBadgeStyle(status) {
  const colors = {
    PENDING: { bg: "rgba(245, 158, 11, 0.15)", text: "#ff9800" },
    APPROVED: { bg: "rgba(141, 160, 242, 0.15)", text: "#8da0f2" },
    REJECTED: { bg: "rgba(220, 53, 69, 0.15)", text: "#dc3545" }
  };
  const style = colors[status] || { bg: "rgba(161, 161, 170, 0.15)", text: "#808080" };
  return {
    display: "inline-block",
    padding: "0.4rem 0.8rem",
    backgroundColor: style.bg,
    color: style.text,
    borderRadius: "16px",
    fontWeight: "600",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.3px"
  };
}




