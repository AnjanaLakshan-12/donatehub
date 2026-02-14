import { useState } from "react";
import { submitDonationRequest } from "../../services/donationRequest";

export default function DonationRequest({ donation, onClose, onSuccess }) {
  const [purpose, setPurpose] = useState("");
  const [requestedQuantity, setRequestedQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!purpose.trim()) {
      setError("Please provide a purpose for the donation request");
      return;
    }

    if (!requestedQuantity || requestedQuantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }

    if (requestedQuantity > donation.quantity) {
      setError(`Requested quantity (${requestedQuantity}) exceeds available quantity (${donation.quantity})`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await submitDonationRequest(donation.id, purpose, requestedQuantity);
      setSuccess(true);
      
      // Reset form
      setPurpose("");
      setRequestedQuantity(1);
      
      // Call success callback after 2 seconds
      setTimeout(() => {
        if (onSuccess) onSuccess(response.data);
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      console.error("Error submitting request:", err);
      
      let errorMessage = "Failed to submit donation request";
      
      if (err.response) {
        // Backend returned an error response
        if (err.response.status === 404) {
          errorMessage = "Donation not found";
        } else if (err.response.status === 401) {
          errorMessage = "Please login to submit a request";
        } else if (err.response.status === 403) {
          errorMessage = "You are not authorized to submit a request";
        } else if (err.response.status === 400) {
          // Parse backend validation errors
          if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data?.error) {
            errorMessage = err.response.data.error;
          }
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!donation) return null;

  return (
    <div onClick={onClose} style={styles.overlay}>
      <div onClick={(e) => e.stopPropagation()} style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        
        <h2 style={styles.title}>Request Donation</h2>
        
        <div style={styles.donationInfo}>
          <p><strong>Item:</strong> {donation.title}</p>
          <p><strong>Category:</strong> {donation.category?.name || "N/A"}</p>
          <p style={styles.quantityText}><strong>Available:</strong> <span style={styles.quantityNumber}>{donation.quantity} units</span></p>
        </div>

        {success ? (
          <div style={styles.successMessage}>
            <h3 style={styles.successTitle}>✓ Request Submitted Successfully!</h3>
            <p style={styles.successText}>Your donation request has been submitted. The donor will review it soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label htmlFor="quantity" style={styles.label}>
                Quantity Requested *
              </label>
              <div style={styles.quantityInputContainer}>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={donation.quantity}
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={styles.quantityInput}
                  disabled={loading}
                  required
                />
                <span style={styles.quantityMax}>/ {donation.quantity} available</span>
              </div>
            </div>

            <div style={styles.field}>
              <label htmlFor="purpose" style={styles.label}>
                Purpose of Request *
              </label>
              <textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Explain why your organization needs this donation..."
                rows="5"
                disabled={loading}
                style={styles.textarea}
                required
              />
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <div style={styles.buttonGroup}>
              <button
                type="submit"
                disabled={loading}
                style={styles.submitBtn}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        )}
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
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#999',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s',
  },
  title: {
    marginTop: 0,
    marginBottom: '1.5rem',
    color: '#333',
    fontSize: '1.5rem',
  },
  donationInfo: {
    background: '#f9f9f9',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  quantityText: {
    margin: '0.5rem 0 0 0',
  },
  quantityNumber: {
    color: '#3f5bd8',
    fontWeight: '700',
  },
  successMessage: {
    textAlign: 'center',
    padding: '2rem 1rem',
  },
  successTitle: {
    color: '#10b981',
    fontSize: '1.3rem',
    marginBottom: '0.8rem',
  },
  successText: {
    color: '#666',
    fontSize: '1rem',
    lineHeight: '1.5',
  },
  field: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#333',
  },
  quantityInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  },
  quantityInput: {
    width: '100px',
    padding: '0.6rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
  },
  quantityMax: {
    fontSize: '0.9rem',
    color: '#666',
  },
  textarea: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    resize: 'vertical',
    transition: 'border-color 0.2s',
  },
  errorMessage: {
    background: '#fee',
    color: '#c33',
    padding: '0.8rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.8rem',
  },
  submitBtn: {
    flex: 1,
    padding: '0.8rem',
    background: '#3f5bd8',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.2s',
  },
  cancelBtn: {
    flex: 1,
    padding: '0.8rem',
    background: '#e5e7eb',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.2s',
  },
}