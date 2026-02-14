import React from 'react';

export default function DonationCard({ donation, onCardClick }) {
  const hasRemaining = Number(donation?.quantity || 0) > 0;
  const displayStatus = hasRemaining ? 'AVAILABLE' : (donation?.status || 'N/A');
  const statusStyle = hasRemaining ? styles.statusAvailable : styles.statusReserved;

  return (
    <div
      style={styles.card}
      onClick={() => onCardClick && onCardClick(donation)}
    >
      {donation.id && (
        <div style={styles.imageContainer}>
          <img 
            src={`http://localhost:8080/api/v1/donations/${donation.id}/image`}
            alt={donation.title}
            style={styles.image}
          />
          <div style={{...styles.statusBadge, ...statusStyle}}>
            {displayStatus}
          </div>
        </div>
      )}
      <div style={styles.content}>
        <h3 style={styles.title}>{donation.title}</h3>
        <p style={styles.description}>{donation.description}</p>
        
        <div style={styles.details}>
          <div style={styles.detailItem}>
            <span style={styles.label}>Quantity:</span>
            <span style={{...styles.value, ...(donation.quantity === 0 ? styles.quantityDepleted : styles.quantityAvailable)}}>
              {donation.quantity} {donation.quantity === 1 ? 'unit' : 'units'}
            </span>
          </div>
        </div>
      </div>
      <div style={styles.footer}>
        <span style={styles.clickHint}>Click to view details →</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    border: '1px solid #e9eefb',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxShadow: '0 4px 12px rgba(31, 42, 68, 0.08)',
    ':hover': {
      boxShadow: '0 12px 32px rgba(63, 91, 216, 0.15)',
      transform: 'translateY(-4px)',
      borderColor: '#d0d8f7',
    },
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: '66.67%',
    background: '#f5f7fc',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  statusBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '24px',
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    backdropFilter: 'blur(4px)',
  },
  statusAvailable: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
  statusReserved: {
    background: 'linear-gradient(135deg, #8da0f2 0%, #6b7fd8 100%)',
    boxShadow: '0 4px 12px rgba(141, 160, 242, 0.3)',
  },
  content: {
    padding: '1.5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#1f2a44',
    marginBottom: '0.6rem',
    marginTop: 0,
    lineHeight: '1.3',
  },
  description: {
    fontSize: '0.88rem',
    color: '#6b7280',
    marginBottom: '1.2rem',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: 'auto',
    paddingTop: '0.5rem',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
  },
  label: {
    color: '#9ca3af',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  value: {
    color: '#1f2a44',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  footer: {
    padding: '1rem 1.5rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4fc 100%)',
    borderTop: '1px solid #e9eefb',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  clickHint: {
    fontSize: '0.85rem',
    color: '#3f5bd8',
    fontWeight: '700',
    letterSpacing: '0.3px',
  },
  quantityAvailable: {
    color: '#10b981',
  },
  quantityDepleted: {
    color: '#ef4444',
  },
};