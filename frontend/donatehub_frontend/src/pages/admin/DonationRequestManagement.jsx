import React, { useState, useEffect } from 'react';
import { getAllDonationRequests, handleRequestStatus } from '../../services/donationRequest';
import { FaFileAlt, FaClock, FaCheckCircle, FaTimesCircle, FaSearch } from 'react-icons/fa';

const DonationRequestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sortBy, setSortBy] = useState('id');
    const [sortDirection, setSortDirection] = useState('DESC');

    useEffect(() => {
        fetchRequests();
    }, [currentPage, pageSize, filter, sortBy, sortDirection]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            let endpoint = '';
            if (filter === 'ALL') {
                endpoint = `/getall/paginated?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&direction=${sortDirection}`;
            } else {
                endpoint = `/status/${filter}/paginated?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&direction=${sortDirection}`;
            }
            
            console.log('Fetching requests with filter:', filter);
            console.log('Endpoint URL:', endpoint);
            
            const response = await getAllDonationRequests(endpoint);
            console.log('Donation Requests API Response:', response.data);
            console.log('Number of requests returned:', response.data.content?.length || 0);
            const requestsData = response.data.content || [];
            if (requestsData.length > 0) {
                console.log('Sample request object:', requestsData[0]);
                console.log('Request donation:', requestsData[0].donation);
                console.log('Request organization:', requestsData[0].organization);
            }
            setRequests(requestsData);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (error) {
            console.error('Error fetching donation requests:', error);
            alert('Failed to fetch donation requests');
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId, status) => {
        if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) {
            return;
        }

        setActionLoading(requestId);
        try {
            await handleRequestStatus(requestId, status);
            alert(`Request ${status.toLowerCase()} successfully!`);
            await fetchRequests();
        } catch (error) {
            console.error(`Error ${status.toLowerCase()} request:`, error);
            alert(`Failed to ${status.toLowerCase()} request: ${error.response?.data || error.message}`);
        } finally {
            setActionLoading(null);
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

    if (loading) {
        return <div style={styles.loading}>Loading donation requests...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>📋 Donation Request Management</h2>
                <p style={styles.subtitle}>Monitor and manage all donation requests in the system</p>
            </div>

            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}><FaFileAlt /></div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statValue}>{requests.length}</h3>
                        <p style={styles.statLabel}>Total Requests</p>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)' }}><FaClock /></div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statValue}>{requests.filter(r => r.status === 'PENDING').length}</h3>
                        <p style={styles.statLabel}>Pending</p>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)' }}><FaCheckCircle /></div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statValue}>{requests.filter(r => r.status === 'APPROVED').length}</h3>
                        <p style={styles.statLabel}>Approved</p>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' }}><FaTimesCircle /></div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statValue}>{requests.filter(r => r.status === 'REJECTED').length}</h3>
                        <p style={styles.statLabel}>Rejected</p>
                    </div>
                </div>
            </div>

            <div style={styles.filterBar}>
                <div style={styles.searchBox}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search requests..."
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
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {requests.length === 0 ? (
                <div style={styles.emptyState}>
                    <p style={styles.emptyText}>No donation requests found</p>
                </div>
            ) : (
                <>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeader}>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Donation</th>
                                    <th style={styles.th}>Organization</th>
                                    <th style={styles.th}>Qty Requested</th>
                                    <th style={styles.th}>Purpose</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Requested Date</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => (
                                    <tr key={request.id} style={styles.tableRow}>
                                        <td style={styles.td}>#{request.id}</td>
                                        <td style={styles.td}>
                                            <div>
                                                <p style={styles.itemTitle}>{request.donation?.title || 'N/A'}</p>
                                                <p style={styles.itemMeta}>Category: {request.donation?.category?.name || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div>
                                                <p style={styles.itemTitle}>
                                                    {request.organization
                                                        ? `${request.organization.firstName || ''} ${request.organization.lastName || ''}`.trim() || request.organization.email || 'N/A'
                                                        : 'N/A'
                                                    }
                                                </p>
                                                <p style={styles.itemMeta}>{request.organization?.email || ''}</p>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <p style={{...styles.itemTitle, color: '#8da0f2', fontWeight: '700'}}>{request.requestedQuantity || 1} units</p>
                                        </td>
                                        <td style={styles.td}>{request.purpose || 'N/A'}</td>
                                        <td style={styles.td}>
                                            <span style={getStatusBadgeStyle(request.status)}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            {(request.requestDate || request.createdAt) ? new Date(request.requestDate || request.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td style={styles.td}>
                                            {request.status === 'PENDING' ? (
                                                <div style={styles.actionButtons}>
                                                    <button
                                                        onClick={() => handleAction(request.id, 'APPROVED')}
                                                        disabled={actionLoading === request.id}
                                                        style={styles.approveBtn}
                                                    >
                                                        {actionLoading === request.id ? 'Loading...' : 'Approve'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(request.id, 'REJECTED')}
                                                        disabled={actionLoading === request.id}
                                                        style={styles.rejectBtn}
                                                    >
                                                        {actionLoading === request.id ? 'Loading...' : 'Reject'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={styles.noActionText}>No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={styles.paginationContainer}>
                        <div style={styles.paginationInfo}>
                            <span>Showing {Math.min(pageSize, requests.length)} of {totalElements}</span>
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
        case 'PENDING':
            return { ...baseStyle, background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)' };
        case 'APPROVED':
            return { ...baseStyle, background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)' };
        case 'REJECTED':
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
    loading: { padding: '2rem', textAlign: 'center', color: '#666' },
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
    itemMeta: { margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#999' },
    actionButtons: { display: 'flex', gap: '0.5rem' },
    approveBtn: { background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' },
    rejectBtn: { background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' },
    noActionText: { color: '#999', fontSize: '0.85rem' },
    paginationContainer: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    paginationInfo: { color: '#666', fontSize: '0.95rem', fontWeight: '500' },
    paginationControls: { display: 'flex', gap: '0.8rem', alignItems: 'center' },
    paginationBtn: { background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' },
    pageSelect: { padding: '0.6rem 1rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.9rem', background: 'white', cursor: 'pointer' },
    emptyState: { textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' },
    emptyText: { color: '#999', fontSize: '1.1rem' }
};


export default DonationRequestManagement;