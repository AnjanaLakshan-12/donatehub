import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/userService';
import { approveUser, changeRole, deleteUser } from '../../services/adminService';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaClock, FaTrash, FaEdit, FaUserShield, FaBuilding, FaHandHoldingHeart } from 'react-icons/fa';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedRole, setSelectedRole] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sortBy, setSortBy] = useState('id');
    const [sortDirection, setSortDirection] = useState('DESC');

    useEffect(() => {
        fetchUsers();
    }, [currentPage, pageSize, sortBy, sortDirection]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers(`?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&direction=${sortDirection}`);
            setUsers(response.data.content || response.data || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch users", err);
            setError("Could not load users. Please check if the backend is running.");
            setUsers([]);
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

    const handleApproveUser = async (id) => {
        try {
            await approveUser(id);
            setSuccess(`User ${id} approved successfully!`);
            fetchUsers();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to approve user");
        }
    };

    const handleChangeRole = async (id) => {
        try {
            const newRole = selectedRole[id];
            if (!newRole) {
                setError("Please select a role");
                return;
            }
            await changeRole(id, newRole);
            setSuccess(`User ${id} role changed to ${newRole} successfully!`);
            setSelectedRole({ ...selectedRole, [id]: '' });
            fetchUsers();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change role");
        }
    };

    const handleDeleteUser = async (userId) => {
        // Extract clean numeric ID
        const cleanId = String(userId).split(':')[0].trim();
        console.log('Original ID:', userId, 'Clean ID:', cleanId);
        
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                console.log(`Attempting to delete user with ID: ${cleanId}`);
                const response = await deleteUser(cleanId);
                console.log('Delete response:', response);
                setSuccess(`User deleted successfully!`);
                await fetchUsers();
                setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                console.error('Delete user error:', err);
                console.error('Error response:', err.response);
                const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Failed to delete user";
                setError(errorMsg);
                setTimeout(() => setError(null), 5000);
            }
        }
    };

    if (loading) return (
        <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading users...</p>
        </div>
    );

    const getRoleIcon = (role) => {
        switch (role) {
            case 'ADMIN': return <FaUserShield style={{ color: '#f5576c' }} />;
            case 'ORG': return <FaBuilding style={{ color: '#4facfe' }} />;
            case 'DONOR': return <FaHandHoldingHeart style={{ color: '#8da0f2' }} />;
            default: return <FaUser />;
        }
    };

    return (
        <div style={styles.container}>
            {error && (
                <div style={styles.errorAlert}>
                    <span>⚠️</span>
                    <span>{error}</span>
                    <button onClick={() => setError(null)} style={styles.closeBtn}>×</button>
                </div>
            )}
            {success && (
                <div style={styles.successAlert}>
                    <span>✓</span>
                    <span>{success}</span>
                    <button onClick={() => setSuccess(null)} style={styles.closeBtn}>×</button>
                </div>
            )}

            <div style={styles.header}>
                <h2 style={styles.title}>👥 User Management</h2>
                <p style={styles.subtitle}>Total {totalElements} users</p>
            </div>

            {users.length === 0 ? (
                <div style={styles.emptyState}>
                    <p style={styles.emptyText}>No users found.</p>
                </div>
            ) : (
                <>
                    <div style={styles.cardsGrid}>
                        {users.map((user, index) => (
                            <div key={user.id} style={{
                                ...styles.userCard,
                                animationDelay: `${index * 0.05}s`
                            }}>
                                <div style={styles.cardHeader}>
                                    <div style={styles.userInfo}>
                                        <div style={styles.avatarCircle}>
                                            {getRoleIcon(user.role)}
                                        </div>
                                        <div>
                                            <h3 style={styles.userName}>
                                                {user.firstName} {user.lastName}
                                            </h3>
                                            <div style={styles.userMeta}>
                                                <FaEnvelope style={styles.metaIcon} />
                                                <span style={styles.metaText}>{user.email}</span>
                                            </div>
                                            <div style={styles.userMeta}>
                                                <FaMapMarkerAlt style={styles.metaIcon} />
                                                <span style={styles.metaText}>{user.district}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={styles.statusBadge}>
                                        {user.enable ? (
                                            <div style={styles.activeStatus}>
                                                <FaCheckCircle style={{ marginRight: '0.3rem' }} />
                                                Active
                                            </div>
                                        ) : (
                                            <div style={styles.pendingStatus}>
                                                <FaClock style={{ marginRight: '0.3rem' }} />
                                                Pending
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={styles.roleBadge}>
                                    {getRoleIcon(user.role)}
                                    <span style={styles.roleText}>{user.role}</span>
                                </div>

                                <div style={styles.cardActions}>
                                    {!user.enable && (
                                        <button 
                                            onClick={() => handleApproveUser(user.id)}
                                            style={styles.approveBtn}
                                        >
                                            <FaCheckCircle /> Approve
                                        </button>
                                    )}
                                    
                                    <div style={styles.roleChangeGroup}>
                                        <select 
                                            value={selectedRole[user.id] || ''}
                                            onChange={(e) => setSelectedRole({ ...selectedRole, [user.id]: e.target.value })}
                                            style={styles.selectRole}
                                        >
                                            <option value="">Change Role</option>
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="ORG">ORG</option>
                                            <option value="DONOR">DONOR</option>
                                        </select>
                                        <button 
                                            onClick={() => handleChangeRole(user.id)}
                                            style={styles.updateBtn}
                                            disabled={!selectedRole[user.id]}
                                        >
                                            <FaEdit /> Update
                                        </button>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)}
                                        style={styles.deleteBtn}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div style={styles.paginationContainer}>
                        <div style={styles.paginationInfo}>
                            <span style={styles.infoText}>
                                Showing {Math.min(pageSize, users.length)} of {totalElements} results
                            </span>
                            <span style={styles.divider}>•</span>
                            <span style={styles.infoText}>
                                Page {currentPage + 1} of {totalPages || 1}
                            </span>
                        </div>
                        
                        <div style={styles.paginationControls}>
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 0}
                                style={{...styles.paginationBtn, ...(currentPage === 0 ? styles.btnDisabled : {})}}
                            >
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
                            
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage >= totalPages - 1}
                                style={{...styles.paginationBtn, ...(currentPage >= totalPages - 1 ? styles.btnDisabled : {})}}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '1rem',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem',
        gap: '1rem',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #8da0f2',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        color: '#666',
        fontSize: '1.1rem',
    },
    errorAlert: {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
        animation: 'slideDown 0.3s ease-out',
    },
    successAlert: {
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 4px 12px rgba(141, 160, 242, 0.3)',
        animation: 'slideDown 0.3s ease-out',
    },
    closeBtn: {
        marginLeft: 'auto',
        background: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        color: 'white',
        fontSize: '1.5rem',
        cursor: 'pointer',
        borderRadius: '6px',
        padding: '0 0.5rem',
        lineHeight: '1',
    },
    header: {
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#333',
        marginBottom: '0.3rem',
    },
    subtitle: {
        color: '#666',
        fontSize: '0.95rem',
    },
    emptyState: {
        background: 'white',
        borderRadius: '16px',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    emptyText: {
        color: '#999',
        fontSize: '1.1rem',
    },
    cardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    userCard: {
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 2px 12px rgba(141, 160, 242, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        animation: 'fadeInUp 0.5s ease-out both',
        border: '2px solid rgba(141, 160, 242, 0.15)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1.2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid rgba(141, 160, 242, 0.1)',
    },
    userInfo: {
        display: 'flex',
        gap: '1rem',
        flex: 1,
    },
    avatarCircle: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        color: 'white',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(141, 160, 242, 0.3)',
    },
    userName: {
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '0.4rem',
        letterSpacing: '-0.5px',
    },
    userMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '0.3rem',
    },
    metaIcon: {
        color: '#8e44ad',
        fontSize: '0.85rem',
    },
    metaText: {
        fontSize: '0.9rem',
        color: '#555',
        fontWeight: '500',
    },
    statusBadge: {
        flexShrink: 0,
    },
    activeStatus: {
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        color: 'white',
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(141, 160, 242, 0.3)',
    },
    pendingStatus: {
        background: 'linear-gradient(135deg, #ffd43b 0%, #fab005 100%)',
        color: 'white',
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(255, 212, 59, 0.3)',
    },
    roleBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: '#f8f9fa',
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        marginBottom: '1rem',
        fontWeight: '600',
        fontSize: '0.9rem',
        color: '#495057',
    },
    roleText: {
        fontSize: '0.9rem',
    },
    cardActions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
    },
    approveBtn: {
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        color: 'white',
        border: 'none',
        padding: '0.7rem 1rem',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 12px rgba(141, 160, 242, 0.3)',
    },
    roleChangeGroup: {
        display: 'flex',
        gap: '0.5rem',
    },
    selectRole: {
        flex: 1,
        padding: '0.7rem',
        borderRadius: '10px',
        border: '2px solid #e9ecef',
        fontSize: '0.9rem',
        color: '#495057',
        cursor: 'pointer',
        background: 'white',
        transition: 'all 0.3s ease',
    },
    updateBtn: {
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        color: 'white',
        border: 'none',
        padding: '0.7rem 1.2rem',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 12px rgba(141, 160, 242, 0.3)',
    },
    deleteBtn: {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
        color: 'white',
        border: 'none',
        padding: '0.7rem 1rem',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
    },
    paginationContainer: {
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    },
    paginationInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
        justifyContent: 'center',
    },
    infoText: {
        color: '#666',
        fontSize: '0.9rem',
    },
    divider: {
        color: '#ddd',
        fontSize: '1rem',
    },
    paginationControls: {
        display: 'flex',
        gap: '0.8rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    paginationBtn: {
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        color: 'white',
        border: 'none',
        padding: '0.7rem 1.5rem',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(141, 160, 242, 0.3)',
    },
    btnDisabled: {
        background: '#e9ecef',
        color: '#adb5bd',
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
    pageSelect: {
        padding: '0.7rem 1rem',
        borderRadius: '10px',
        border: '2px solid #e9ecef',
        fontSize: '0.9rem',
        color: '#495057',
        cursor: 'pointer',
        background: 'white',
    },
    pageSizeSelect: {
        padding: '0.7rem 1rem',
        borderRadius: '10px',
        border: '2px solid #e9ecef',
        fontSize: '0.9rem',
        color: '#495057',
        cursor: 'pointer',
        background: 'white',
    },
};