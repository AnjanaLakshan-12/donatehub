import React, { useState } from 'react';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import DonationManagement from './DonationManagement';
import DonationRequestManagement from './DonationRequestManagement';
import CategoryManagement from './CategoryManagement';
import { FaChartLine, FaUsers, FaHandHoldingHeart, FaFileAlt, FaTag } from 'react-icons/fa';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [hoveredTab, setHoveredTab] = useState(null);

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: FaChartLine, color: '#667eea' },
        { id: "users", label: "User Management", icon: FaUsers, color: '#f5576c' },
        { id: "donations", label: "Donation Management", icon: FaHandHoldingHeart, color: '#8da0f2' },
        { id: "requests", label: "Donation Requests", icon: FaFileAlt, color: '#4facfe' },
        { id: "categories", label: "Category Management", icon: FaTag, color: '#f093fb' },
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerCard}>
                    <h1 style={styles.title}>🔐 Admin Dashboard</h1>
                    <p style={styles.subtitle}>Manage users, donations, and system requests</p>
                </div>
            </div>

            <div style={styles.tabs}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const isHovered = hoveredTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            onMouseEnter={() => setHoveredTab(tab.id)}
                            onMouseLeave={() => setHoveredTab(null)}
                            style={{
                                ...styles.tab,
                                ...(isActive ? styles.activeTab : {}),
                                backgroundColor: isActive ? `${tab.color}15` : (isHovered ? '#f8f9fa' : 'transparent'),
                                borderBottomColor: isActive ? tab.color : 'transparent',
                            }}
                        >
                            <Icon style={{ marginRight: '0.5rem', color: isActive ? tab.color : '#666' }} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div style={styles.content}>
                {activeTab === "dashboard" && <Dashboard />}
                {activeTab === "users" && <UserManagement />}
                {activeTab === "donations" && <DonationManagement />}
                {activeTab === "requests" && <DonationRequestManagement />}
                {activeTab === "categories" && <CategoryManagement />}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: 'calc(100vh - 70px)',
        background: 'linear-gradient(135deg, #f6f9ff 0%, #e8f1ff 100%)',
        padding: '2rem',
    },
    header: {
        maxWidth: '1400px',
        margin: '0 auto 2rem',
    },
    headerCard: {
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 10px 30px rgba(141, 160, 242, 0.3)',
        color: 'white',
        animation: 'slideDown 0.6s ease-out',
    },
    title: {
        fontSize: '2.2rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '1rem',
        opacity: 0.9,
    },
    tabs: {
        maxWidth: '1400px',
        margin: '0 auto 2rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        background: 'white',
        padding: '1rem',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    },
    tab: {
        background: 'transparent',
        border: 'none',
        padding: '1rem 1.5rem',
        fontSize: '0.95rem',
        fontWeight: '600',
        color: '#666',
        cursor: 'pointer',
        borderBottom: '3px solid transparent',
        borderRadius: '10px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
    },
    activeTab: {
        fontWeight: '700',
    },
    content: {
        maxWidth: '1400px',
        margin: '0 auto',
        animation: 'fadeInUp 0.5s ease-out',
    },
};

export default AdminDashboard;
