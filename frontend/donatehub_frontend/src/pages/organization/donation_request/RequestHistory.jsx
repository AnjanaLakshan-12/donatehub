import { useState, useEffect } from "react";
import { getAllDonationRequestsPaginated } from "../../../services/donationRequest";
import { FaHistory, FaHashtag, FaGift, FaInfoCircle, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function RequestHistory() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sortBy, setSortBy] = useState("id");
    const [sortDirection, setSortDirection] = useState("DESC");

    useEffect(() => {
        fetchRequestHistory();
    }, [currentPage, pageSize, sortBy, sortDirection]);

    const fetchRequestHistory = async () => {
        try {
            setLoading(true);
            const response = await getAllDonationRequestsPaginated(currentPage, pageSize, sortBy, sortDirection);
            console.log("Request history response:", response);
            
            setRequests(response.data.content || response.data || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
            setError(null);
        } catch (err) {
            console.error("Error fetching request history:", err);
            setError(err.response?.data?.message || err.message || "Failed to load request history");
            setRequests([]);
        } finally {
            setLoading(false);
        }
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

    const handleSortChange = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "DESC" ? "ASC" : "DESC");
        } else {
            setSortBy(column);
            setSortDirection("DESC");
        }
        setCurrentPage(0);
    };

    if (loading) return <div style={styles.loadingContainer}><p>Loading request history...</p></div>;
    if (error) return <div style={styles.errorContainer}><p>Error: {error}</p></div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>
                    <FaHistory style={{fontSize: '1.5rem'}} />
                    Request History
                </h3>
                <p style={styles.subtitle}>View all your donation requests</p>
            </div>

            {requests.length > 0 ? (
                <>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeader}>
                                    <th style={{...styles.th, cursor: 'pointer', width: '80px'}} onClick={() => handleSortChange("id")}>
                                        ID {sortBy === "id" && (sortDirection === "DESC" ? "▼" : "▲")}
                                    </th>
                                    <th style={{...styles.th, cursor: 'pointer'}} onClick={() => handleSortChange("donationItem")}>
                                        Donation Item {sortBy === "donationItem" && (sortDirection === "DESC" ? "▼" : "▲")}
                                    </th>
                                    <th style={{...styles.th, cursor: 'pointer', width: '140px'}} onClick={() => handleSortChange("requestedQuantity")}>
                                        Qty Requested {sortBy === "requestedQuantity" && (sortDirection === "DESC" ? "▼" : "▲")}
                                    </th>
                                    <th style={{...styles.th, cursor: 'pointer', width: '140px'}} onClick={() => handleSortChange("status")}>
                                        Status {sortBy === "status" && (sortDirection === "DESC" ? "▼" : "▲")}
                                    </th>
                                    <th style={{...styles.th, cursor: 'pointer', width: '140px'}} onClick={() => handleSortChange("requestDate")}>
                                        Request Date {sortBy === "requestDate" && (sortDirection === "DESC" ? "▼" : "▲")}
                                    </th>
                                    <th style={styles.th}>Purpose</th>
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
                                        <td style={{...styles.td, fontWeight: '600', color: '#8da0f2'}}>#{request.id}</td>
                                        <td style={{...styles.td, fontWeight: '500'}}>{request.donation?.name || request.donationItem?.name || "N/A"}</td>
                                        <td style={{...styles.td, fontWeight: '600'}}>{request.requestedQuantity || 1} units</td>
                                        <td style={styles.td}>
                                            <span style={getStatusStyle(request.status)}>
                                                {request.status || "N/A"}
                                            </span>
                                        </td>
                                        <td style={styles.td}>{new Date(request.requestDate || request.createdAt).toLocaleDateString()}</td>
                                        <td style={styles.td}>{request.purpose || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={styles.paginationContainer}>
                        <div style={styles.paginationInfo}>
                            <span style={styles.infoText}>
                                Showing {requests.length} of {totalElements} requests
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
                                <FaChevronLeft /> Previous
                            </button>

                            <select 
                                value={currentPage}
                                onChange={(e) => setCurrentPage(Number(e.target.value))}
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
                                Next <FaChevronRight />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div style={styles.emptyContainer}>
                    <p style={styles.emptyText}>No requests found</p>
                </div>
            )}
        </div>
    );
}

const getStatusStyle = (status) => {
    const baseStyle = {
        fontWeight: '600',
        borderRadius: '20px',
        padding: '0.5rem 1rem',
        textAlign: 'center',
        display: 'inline-block',
    };

    switch (status) {
        case "APPROVED":
            return {
                ...baseStyle,
                background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
                color: 'white',
                boxShadow: '0 2px 8px rgba(141, 160, 242, 0.3)',
            };
        case "PENDING":
            return {
                ...baseStyle,
                background: 'linear-gradient(135deg, #ffd93d 0%, #ffaa00 100%)',
                color: 'white',
                boxShadow: '0 2px 8px rgba(255, 170, 0, 0.3)',
            };
        case "REJECTED":
            return {
                ...baseStyle,
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                color: 'white',
                boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
            };
        default:
            return baseStyle;
    }
};

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
        marginBottom: '2rem',
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
        userSelect: 'none',
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
    paginationContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    paginationInfo: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        fontSize: '0.9rem',
        color: '#666',
    },
    infoText: {
        fontSize: '0.9rem',
        color: '#666',
        fontWeight: '500',
    },
    divider: {
        color: '#8da0f2',
        fontWeight: 'bold',
    },
    controls: {
        display: 'flex',
        gap: '0.8rem',
        alignItems: 'center',
    },
    btn: {
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        color: 'white',
        border: 'none',
        padding: '0.7rem 1.2rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(141, 160, 242, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
    },
    btnDisabled: {
        background: '#e9ecef',
        color: '#6c757d',
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
    select: {
        padding: '0.7rem 1rem',
        borderRadius: '8px',
        border: '2px solid #b7c2ff',
        fontSize: '0.9rem',
        cursor: 'pointer',
        background: 'white',
        fontWeight: '500',
        color: '#333',
        transition: 'all 0.3s ease',
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
        color: '#6c757d',
        fontWeight: '500',
    },
};
