import { useState, useEffect } from "react";
import { getDonationRequestsByUserAndStatus } from "../../../services/donationRequest";
import { FaClock, FaImage, FaHashtag, FaGift, FaBullseye, FaCalendarAlt } from 'react-icons/fa';

export default function BrowsePendingDonationRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check authentication
        const userStr = localStorage.getItem("donateHubUser");
        console.log("Stored user:", userStr);
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                console.log("Parsed user object:", user);
                console.log("Token:", user?.token || user?.jwt || user?.accessToken);
            } catch (e) {
                console.error("Failed to parse user:", e);
            }
        } else {
            console.log("No user found in localStorage");
        }
        
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            const response = await getDonationRequestsByUserAndStatus("PENDING");
            console.log("Pending requests response:", response);
            console.log("Response data:", response.data);
            
            // Handle different possible response structures
            const data = Array.isArray(response.data) ? response.data : 
                         response.data?.data ? response.data.data : [];
            
            setRequests(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching pending requests:", err);
            console.error("Error response:", err.response);
            setError(err.response?.data?.message || err.message || "Failed to load pending requests");
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={styles.loadingContainer}><p>Loading pending requests...</p></div>;
    if (error) return <div style={styles.errorContainer}><p>Error: {error}</p></div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>
                    <FaClock style={{fontSize: '1.5rem'}} />
                    Pending Donation Requests
                </h1>
                <p style={styles.subtitle}>View all your pending donation requests</p>
            </div>
            
            {requests.length === 0 ? (
                <div style={styles.emptyContainer}>
                    <p style={styles.emptyText}>No pending requests found.</p>
                </div>
            ) : (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={{...styles.th, width: '100px'}}>Image</th>
                                <th style={{...styles.th, width: '80px'}}>ID</th>
                                <th style={styles.th}>Donation Item</th>
                                <th style={{...styles.th, width: '120px'}}>Qty Requested</th>
                                <th style={styles.th}>Purpose</th>
                                <th style={{...styles.th, width: '120px'}}>Status</th>
                                <th style={{...styles.th, width: '140px'}}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request) => (
                                <tr 
                                    key={request.id} 
                                    style={styles.tableRow}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(141, 160, 242, 0.05) 0%, rgba(205, 216, 255, 0.05) 100%)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{...styles.td, padding: '0.8rem'}}>
                                        <img 
                                            src={request.donation?.id ? `http://localhost:8080/api/v1/donations/${request.donation.id}/image` : 'https://via.placeholder.com/70?text=No+Image'} 
                                            alt={request.donation?.title || 'Donation'}
                                            style={styles.donationImage}
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/70?text=No+Image'}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                    </td>
                                    <td style={{...styles.td, fontWeight: '600', color: '#8da0f2'}}>#{request.id}</td>
                                    <td style={{...styles.td, fontWeight: '500'}}>{request.donation?.title || request.donation?.name || "N/A"}</td>
                                    <td style={{...styles.td, fontWeight: '600'}}>{request.requestedQuantity || 1} units</td>
                                    <td style={styles.td}>{request.purpose || "N/A"}</td>
                                    <td style={styles.td}>
                                        <span style={styles.statusBadgePending}>
                                            <FaClock style={{fontSize: '0.8rem'}} />
                                            {request.status}
                                        </span>
                                    </td>
                                    <td style={styles.td}>{(request.requestDate || request.createdAt) ? new Date(request.requestDate || request.createdAt).toLocaleDateString() : "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '2rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(141, 160, 242, 0.08)',
        border: '1px solid rgba(141, 160, 242, 0.1)',
    },
    header: {
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(141, 160, 242, 0.3)',
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: 'white',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '1rem',
        margin: 0,
    },
    tableWrapper: {
        overflowX: 'auto',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
    },
    tableHeader: {
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
    },
    th: {
        padding: '1.2rem 1rem',
        textAlign: 'left',
        fontWeight: '600',
        color: 'white',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    tableRow: {
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
    td: {
        padding: '1.2rem 1rem',
        color: '#333',
        borderBottom: '1px solid #f0f0f0',
        verticalAlign: 'middle',
    },
    statusBadgePending: {
        background: 'linear-gradient(135deg, #ffd93d 0%, #ffaa00 100%)',
        color: 'white',
        fontWeight: '600',
        fontSize: '0.85rem',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        boxShadow: '0 2px 8px rgba(255, 170, 0, 0.3)',
    },
    loadingContainer: {
        padding: '3rem',
        textAlign: 'center',
        color: '#666',
        fontSize: '1.1rem',
    },
    errorContainer: {
        padding: '2rem',
        background: 'linear-gradient(135deg, #f8d7da 0%, #f5c2c7 100%)',
        color: '#721c24',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #f1aeb5',
    },
    emptyContainer: {
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: '12px',
        border: '2px dashed #dee2e6',
    },
    emptyText: {
        fontSize: '1.1rem',
        margin: 0,
        color: '#6c757d',
        fontWeight: '500',
    },
    donationImage: {
        width: '70px',
        height: '70px',
        objectFit: 'cover',
        borderRadius: '8px',
        border: '2px solid #b7c2ff',
        boxShadow: '0 2px 8px rgba(141, 160, 242, 0.2)',
        transition: 'transform 0.3s ease',
    },
};