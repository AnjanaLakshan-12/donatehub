import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/userService';
import { FaUsers, FaUserShield, FaBuilding, FaHandHoldingHeart, FaCheckCircle, FaClock } from 'react-icons/fa';

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data.content || response.data || []);
        } catch (err) {
            console.error("Failed to fetch users", err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading dashboard...</p>
        </div>
    );

    const stats = {
        totalUsers: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        organizations: users.filter(u => u.role === 'ORG').length,
        donors: users.filter(u => u.role === 'DONOR').length,
        active: users.filter(u => u.enable).length,
        pending: users.filter(u => !u.enable).length
    };

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: FaUsers, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#667eea' },
        { title: 'Admins', value: stats.admins, icon: FaUserShield, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#f5576c' },
        { title: 'Organizations', value: stats.organizations, icon: FaBuilding, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#4facfe' },
        { title: 'Donors', value: stats.donors, icon: FaHandHoldingHeart, gradient: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)', color: '#8da0f2' },
        { title: 'Active Users', value: stats.active, icon: FaCheckCircle, gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fa709a' },
        { title: 'Pending Approval', value: stats.pending, icon: FaClock, gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', color: '#30cfd0' },
    ];

    return (
        <div style={styles.container}>
            <div style={styles.welcomeCard}>
                <h2 style={styles.welcomeTitle}>👋 Welcome to Admin Dashboard</h2>
                <p style={styles.welcomeText}>Manage users, approve registrations, and monitor system activity from one place.</p>
            </div>

            <div style={styles.statsGrid}>
                {statCards.map((stat, index) => (
                    <div key={index} style={{
                        ...styles.statCard,
                        animationDelay: `${index * 0.1}s`
                    }}>
                        <div style={styles.statCardInner}>
                            <div style={{...styles.iconWrapper, background: stat.gradient}}>
                                <stat.icon style={styles.icon} />
                            </div>
                            <div style={styles.statContent}>
                                <h3 style={styles.statTitle}>{stat.title}</h3>
                                <p style={{...styles.statValue, color: stat.color}}>{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
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
    welcomeCard: {
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(141, 160, 242, 0.3)',
        color: 'white',
        animation: 'slideDown 0.6s ease-out',
    },
    welcomeTitle: {
        fontSize: '1.8rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
    },
    welcomeText: {
        fontSize: '1rem',
        opacity: 0.9,
        lineHeight: '1.6',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
    },
    statCard: {
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        animation: 'fadeInUp 0.6s ease-out both',
    },
    statCardInner: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    iconWrapper: {
        width: '70px',
        height: '70px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    },
    icon: {
        fontSize: '2rem',
        color: 'white',
    },
    statContent: {
        flex: 1,
    },
    statTitle: {
        fontSize: '0.9rem',
        color: '#666',
        fontWeight: '500',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    statValue: {
        fontSize: '2.5rem',
        fontWeight: '700',
        margin: 0,
    },
};

