import React, { useState, useEffect } from 'react';
import { getAllDonations, deleteDonation } from '../../services/donationService';
import { FaBox, FaCheckCircle, FaClock, FaCheckDouble, FaSearch } from 'react-icons/fa';

const DonationManagement = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sortBy, setSortBy] = useState('id');
    const [sortDirection, setSortDirection] = useState('DESC');

    useEffect(() => {
        fetchDonations();
    }, [currentPage, pageSize, filter, sortBy, sortDirection]);

    const fetchDonations = async () => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = `?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&direction=${sortDirection}`;
            console.log('Fetching donations from endpoint:', endpoint);
            const response = await getAllDonations(endpoint);
            
            console.log('API Response:', response);
            
            let data = response.data.content || response.data || [];
            
            if (filter !== 'ALL') {
                data = data.filter(donation => donation.status === filter);
            }
            
            console.log('Filtered donations:', data);
            if (data.length > 0) {
                console.log('Sample donation:', data[0]);
                console.log('Donor object:', data[0].donor);
                console.log('Donor keys:', data[0].donor ? Object.keys(data[0].donor) : 'donor is null/undefined');
            }
            setDonations(data);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (error) {
            console.error('Error fetching donations:', error);
            setError(`Failed to fetch donations: ${error.message}`);
            setDonations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(0);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(0);
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

    const handleDelete = async (donationId, title) => {
        const cleanId = String(donationId).replace(/[^0-9]/g, '');
        console.log('Original donation ID:', donationId, 'Clean ID:', cleanId);
        
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        try {
            console.log(`Attempting to delete donation with ID: ${cleanId}`);
            const response = await deleteDonation(cleanId);
            console.log('Delete response:', response);
            alert('Donation deleted successfully!');
            await fetchDonations();
        } catch (error) {
            console.error('Error deleting donation:', error);
            console.error('Error response:', error.response);
            const errorMsg = error.response?.data?.message || error.response?.data || error.message || 'Failed to delete donation';
            alert(`Failed to delete donation: ${errorMsg}`);
        }
    };

    if (loading) {
        return <div>Loading donations...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredDonations = normalizedSearch
        ? donations.filter((donation) => {
            const donorName = donation.donor
                ? `${donation.donor.firstName || ''} ${donation.donor.lastName || ''}`.trim() || donation.donor.email || ''
                : '';
            const haystack = [
                donation.title,
                donation.description,
                donation.category?.name,
                donation.location,
                donorName,
                donation.donor?.email
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(normalizedSearch);
        })
        : donations;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>📦 Donation Management</h2>
                <p style={styles.subtitle}>Manage all donations in the system</p>
            </div>

            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}><FaBox /></div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statValue}>{filteredDonations.length}</h3>
                        <p style={styles.statLabel}>Total Donations</p>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}><FaCheckCircle /></div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statValue}>{filteredDonations.filter(d => d.status === 'AVAILABLE').length}</h3>
                        <p style={styles.statLabel}>Available</p>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #8da0f2 0%, #6b7fd8 100%)'}}><FaClock /></div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statValue}>{filteredDonations.filter(d => d.status === 'RESERVED').length}</h3>
                        <p style={styles.statLabel}>Reserved</p>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}}><FaCheckDouble /></div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statValue}>{filteredDonations.filter(d => d.status === 'DONATED').length}</h3>
                        <p style={styles.statLabel}>Donated</p>
                    </div>
                </div>
            </div>

            <div style={styles.filterBar}>
                <div style={styles.searchBox}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search donations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    style={styles.filterSelect}
                >
                    <option value="ALL">All Status</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="DONATED">Donated</option>
                </select>
            </div>

            {filteredDonations.length === 0 ? (
                <div style={styles.emptyState}>
                    <p style={styles.emptyText}>No donations found</p>
                </div>
            ) : (
                <>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeader}>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Title</th>
                                    <th style={styles.th}>Category</th>
                                    <th style={styles.th}>Donor</th>
                                    <th style={styles.th}>Quantity</th>
                                    <th style={styles.th}>Location</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Donation Date</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDonations.map((donation) => (
                                    <tr key={donation.id} style={styles.tableRow}>
                                        <td style={styles.td}>#{donation.id}</td>
                                        <td style={styles.td}>
                                            <div>
                                                <p style={styles.itemTitle}>{donation.title}</p>
                                                {donation.description && (
                                                    <p style={styles.itemDesc}>{donation.description.substring(0, 40)}...</p>
                                                )}
                                            </div>
                                        </td>
                                        <td style={styles.td}>{donation.category?.name || 'N/A'}</td>
                                        <td style={styles.td}>
                                            {donation.donor 
                                                ? `${donation.donor.firstName || ''} ${donation.donor.lastName || ''}`.trim() || donation.donor.email || 'Anonymous'
                                                : 'Anonymous'
                                            }
                                        </td>
                                        <td style={styles.td}>{donation.quantity}</td>
                                        <td style={styles.td}>{donation.location || 'N/A'}</td>
                                        <td style={styles.td}>
                                            <span style={getStatusBadgeStyle(donation.status)}>
                                                {donation.status}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            {(donation.donationDate || donation.createdAt) ? new Date(donation.donationDate || donation.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td style={styles.td}>
                                            <button
                                                onClick={() => handleDelete(donation.id, donation.title)}
                                                style={styles.deleteBtn}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={styles.paginationContainer}>
                        <div style={styles.paginationInfo}>
                            <span>Showing {Math.min(pageSize, filteredDonations.length)} of {totalElements}</span>
                            <span> • </span>
                            <span>Page {currentPage + 1} of {totalPages || 1}</span>
                        </div>
                        <div style={styles.paginationControls}>
                            <button onClick={handlePreviousPage} disabled={currentPage === 0} style={styles.paginationBtn}>
                                ← Previous
                            </button>
                            <select
                                value={currentPage}
                                onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                                style={styles.pageSelect}
                            >
                                {Array.from({ length: totalPages || 1 }, (_, i) => (
                                    <option key={i} value={i}>
                                        Page {i + 1}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1} style={styles.paginationBtn}>
                                Next →
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const getStatusBadgeStyle = (status) => {
    const baseStyle = {
        padding: '0.35rem 0.85rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '700',
        display: 'inline-block',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'white'
    };

    switch (status) {
        case 'AVAILABLE':
            return { ...baseStyle, background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)' };
        case 'PENDING':
            return { ...baseStyle, background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)' };
        case 'CLAIMED':
            return { ...baseStyle, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' };
        default:
            return { ...baseStyle, background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)' };
    }
};

const styles = {
    container: { padding: '1.5rem' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2rem', fontWeight: '700', color: '#333', margin: 0 },
    subtitle: { color: '#666', fontSize: '1rem', margin: '0.5rem 0 0 0' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' },
    statCard: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 12px rgba(141, 160, 242, 0.1)', border: '1px solid rgba(141, 160, 242, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' },
    statIcon: { width: '60px', height: '60px', borderRadius: '12px', background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' },
    statContent: { flex: 1 },
    statValue: { fontSize: '1.5rem', fontWeight: '700', color: '#333', margin: 0 },
    statLabel: { color: '#666', fontSize: '0.9rem', margin: '0.2rem 0 0 0' },
    filterBar: { display: 'flex', gap: '1rem', marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' },
    searchBox: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' },
    searchIcon: { position: 'absolute', left: '1rem', color: '#999', fontSize: '1rem' },
    searchInput: { width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', transition: 'all 0.3s ease' },
    filterSelect: { padding: '0.8rem 1rem', border: '2px solid #b7c2ff', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#333', background: 'white', cursor: 'pointer' },
    tableWrapper: { background: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', overflow: 'hidden', marginBottom: '1.5rem' },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0 },
    tableHeader: { background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)' },
    th: { padding: '1.2rem 1rem', textAlign: 'left', fontWeight: '600', color: 'white', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
    tableRow: { borderBottom: '1px solid #f0f0f0', transition: 'all 0.3s ease' },
    td: { padding: '1.2rem 1rem', color: '#555', fontSize: '0.95rem' },
    itemTitle: { margin: 0, fontWeight: '600', color: '#333' },
    itemDesc: { margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#999' },
    deleteBtn: { background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' },
    paginationContainer: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    paginationInfo: { color: '#666', fontSize: '0.95rem', fontWeight: '500' },
    paginationControls: { display: 'flex', gap: '0.8rem', alignItems: 'center' },
    paginationBtn: { background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' },
    pageSelect: { padding: '0.6rem 1rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.9rem', background: 'white', cursor: 'pointer' },
    emptyState: { textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' },
    emptyText: { color: '#999', fontSize: '1.1rem' },
};


export default DonationManagement;