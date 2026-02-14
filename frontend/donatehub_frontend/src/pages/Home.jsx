import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/categoryService';
import { FaHeart, FaMedkit, FaGraduationCap, FaHome, FaExclamationTriangle, FaUtensils, FaCheckCircle } from 'react-icons/fa';

export default function Home({ user }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('food')) return FaUtensils;
    if (name.includes('medical') || name.includes('health')) return FaMedkit;
    if (name.includes('education')) return FaGraduationCap;
    if (name.includes('housing') || name.includes('shelter')) return FaHome;
    if (name.includes('emergency')) return FaExclamationTriangle;
    return FaHeart;
  };

  const getCategoryColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #5b7cfa 0%, #3f5bd8 100%)',
      'linear-gradient(135deg, #6a8bff 0%, #8e5cff 100%)',
      'linear-gradient(135deg, #4fc3f7 0%, #3f87d8 100%)',
      'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
      'linear-gradient(135deg, #7f8cff 0%, #5a6bff 100%)',
      'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
    ];
    return colors[index % colors.length];
  };

  const getCategoryImage = (categoryName) => {
    const name = categoryName.toLowerCase();
    
    // Use flexible keyword matching for better compatibility
    if (name.includes('food') || name.includes('supplies')) return '/food.jpeg';
    if (name.includes('medical') || name.includes('health')) return '/health.jpeg';
    if (name.includes('education') || name.includes('school') || name.includes('learning')) return '/education.jpeg';
    if (name.includes('housing') || name.includes('shelter') || name.includes('community')) return '/community development.jpeg';
    if (name.includes('emergency') || name.includes('disaster') || name.includes('relief')) return '/disaster relif.jpeg';
    if (name.includes('environment') || name.includes('climate') || name.includes('nature')) return '/environment.jpeg';
    if (name.includes('animal') || name.includes('welfare') || name.includes('pet')) return '/animal walfare.jpeg';
    
    // Default fallback image
    return '/222.jpeg';
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      console.log("Categories loaded:", res.data);
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories", err);
      // Fallback sample categories for demo
      setCategories([
        { id: 1, name: 'Food & Supplies', description: 'Help us provide food and essential supplies' },
        { id: 2, name: 'Medical Aid', description: 'Support medical treatment and healthcare' },
        { id: 3, name: 'Education', description: 'Invest in educational programs and scholarships' },
        { id: 4, name: 'Housing', description: 'Assist with housing and shelter needs' },
        { id: 5, name: 'Emergency Relief', description: 'Quick response to emergencies and disasters' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Hero Section */}
            {/* Banner Image Section */}
            <section style={{
              ...styles.bannerSection,
              backgroundImage: "url('/222.jpeg')",
            }}>
              <div style={styles.bannerOverlay}></div>
              <div style={styles.bannerContent}>
                <h2 style={styles.bannerTitle}>Making Difference Together</h2>
                <p style={styles.bannerSubtitle}>Join our community of donors and organizations creating meaningful change</p>
              </div>
            </section>
      <section style={styles.heroSection}>
        <div style={styles.heroShell}>
          <div style={styles.heroGlowLeft}></div>
          <div style={styles.heroGlowRight}></div>
          <div style={styles.heroInner}>
            <div style={styles.heroLeft}>
              <span style={styles.heroPill}>Donation Hub</span>
              <h1 style={styles.heroTitle}>
                Donation Hub – <span style={styles.heroAccent}>Connecting Donors with Organizations</span>
              </h1>
              <p style={styles.heroDescription}>
                A modern platform that makes giving simple, transparent, and impactful. Join donors and nonprofits building stronger communities together.
              </p>
              <div style={styles.ctaButtons}>
                {!user ? (
                  <>
                    <Link to="/register" style={styles.primaryButton}>
                      Donate Items
                    </Link>
                    <Link to="/register" style={styles.secondaryButton}>
                      Request Donations
                    </Link>
                  </>
                ) : user.role === 'DONOR' ? (
                  <Link to="/donor/add-donation" style={styles.primaryButton}>
                    Donate Items
                  </Link>
                ) : user.role === 'ORG' ? (
                  <Link to="/organization-profile" style={styles.secondaryButton}>
                    Request Donations
                  </Link>
                ) : null}
              </div>
              <div style={styles.heroHighlights}>
                <div style={styles.heroHighlightItem}>
                  <FaCheckCircle style={styles.highlightIcon} />
                  Verified organizations
                </div>
                <div style={styles.heroHighlightItem}>
                  <FaCheckCircle style={styles.highlightIcon} />
                  Transparent impact tracking
                </div>
              </div>
            </div>
            <div style={styles.heroRight}>
              <div style={styles.heroIllustration}>
                <div style={styles.heroImage}></div>
                <div style={styles.heroMiniCard}>
                  <h4 style={styles.heroMiniTitle}>Trusted Network</h4>
                  <p style={styles.heroMiniText}>120+ verified partners</p>
                </div>
                <div style={styles.heroMiniCardAlt}>
                  <h4 style={styles.heroMiniTitle}>Fast Matching</h4>
                  <p style={styles.heroMiniText}>Donations reach the right place</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={styles.categoriesSection}>
        <div style={styles.sectionWrapper}>
          <h2 style={styles.sectionTitle}>🎁 Browse by Category</h2>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Loading categories...</p>
            </div>
          ) : categories.length > 0 ? (
            <div style={styles.categoriesGrid}>
              {categories.map((cat, index) => {
                const Icon = getCategoryIcon(cat.name);
                return (
                  <Link 
                    to={`/donations/category/${cat.name}`}
                    key={cat.id}
                    style={styles.categoryCardLink}
                  >
                    <div style={{
                      ...styles.categoryCard,
                      animationDelay: `${index * 0.1}s`
                    }}>
                      <div style={{
                        ...styles.categoryImageBanner,
                        backgroundImage: `url('${getCategoryImage(cat.name)}')`
                      }}></div>
                      <div style={styles.categoryCardBody}>
                        <div style={{
                          ...styles.categoryIconWrapper,
                          background: getCategoryColor(index)
                        }}>
                          <Icon style={styles.categoryIcon} />
                        </div>
                        <h3 style={styles.categoryName}>{cat.name}</h3>
                        <p style={styles.categoryDescription}>{cat.description || "Click to browse donations"}</p>
                        <div style={styles.categoryArrow} className="categoryArrow">→</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p style={styles.noCategories}>No categories available.</p>
          )}
        </div>
      </section>
    </div>
  );
}

// Blue Professional Charity Theme Styles
const styles = {
    bannerSection: {
      width: '100%',
      height: '380px',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '40px',
    },
    bannerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(63, 91, 216, 0.5) 0%, rgba(141, 160, 242, 0.4) 100%)',
      zIndex: 1,
    },
    bannerContent: {
      position: 'relative',
      zIndex: 2,
      textAlign: 'center',
      color: 'white',
      paddingBottom: '40px',
    },
    bannerTitle: {
      fontSize: '3.5rem',
      fontWeight: '700',
      margin: '0 0 1rem 0',
      textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
    bannerSubtitle: {
      fontSize: '1.3rem',
      fontWeight: '500',
      margin: 0,
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  pageContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: 'linear-gradient(120deg, #eef3ff 0%, #f8f9ff 45%, #e9f0ff 100%)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  heroSection: {
    padding: '70px 30px 40px',
  },
  heroShell: {
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.92)',
    borderRadius: '28px',
    padding: '50px',
    boxShadow: '0 24px 60px rgba(31, 42, 68, 0.12)',
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlowLeft: {
    position: 'absolute',
    width: '240px',
    height: '240px',
    left: '-80px',
    top: '-60px',
    background: 'radial-gradient(circle, rgba(99, 124, 255, 0.25), transparent 70%)',
  },
  heroGlowRight: {
    position: 'absolute',
    width: '260px',
    height: '260px',
    right: '-90px',
    bottom: '-70px',
    background: 'radial-gradient(circle, rgba(78, 168, 255, 0.22), transparent 70%)',
  },
  heroInner: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2.5rem',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  heroRight: {
    display: 'flex',
    justifyContent: 'center',
  },
  heroPill: {
    alignSelf: 'flex-start',
    background: '#eef3ff',
    color: '#3f5bd8',
    padding: '6px 14px',
    borderRadius: '999px',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '0.4px',
  },
  heroTitle: {
    fontSize: '2.7rem',
    fontWeight: '700',
    color: '#1f2a44',
    lineHeight: '1.3',
  },
  heroAccent: {
    color: '#3f5bd8',
  },
  heroDescription: {
    fontSize: '1.05rem',
    color: '#4a5568',
    fontWeight: '500',
    maxWidth: '520px',
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  primaryButton: {
    background: '#3f5bd8',
    color: 'white',
    padding: '12px 32px',
    borderRadius: '999px',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    boxShadow: '0 12px 24px rgba(63, 91, 216, 0.25)',
    display: 'inline-block',
  },
  secondaryButton: {
    background: 'white',
    color: '#3f5bd8',
    padding: '12px 32px',
    borderRadius: '999px',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    border: '1px solid #dfe6fb',
    display: 'inline-block',
  },
  heroHighlights: {
    display: 'grid',
    gap: '0.6rem',
    color: '#4a5568',
    fontWeight: '500',
  },
  heroHighlightItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.95rem',
  },
  highlightIcon: {
    color: '#3f5bd8',
    fontSize: '1rem',
  },
  heroIllustration: {
    position: 'relative',
    width: '100%',
    maxWidth: '420px',
  },
  heroImage: {
    width: '100%',
    height: '280px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #dbe6ff 0%, #f5f8ff 45%, #cfe0ff 100%)',
    border: '1px solid #e2e8ff',
    boxShadow: '0 18px 45px rgba(63, 91, 216, 0.12)',
  },
  heroMiniCard: {
    position: 'absolute',
    bottom: '-20px',
    left: '-20px',
    background: 'white',
    padding: '14px 18px',
    borderRadius: '16px',
    boxShadow: '0 12px 24px rgba(31, 42, 68, 0.12)',
    border: '1px solid #eef1ff',
  },
  heroMiniCardAlt: {
    position: 'absolute',
    top: '-18px',
    right: '-18px',
    background: 'white',
    padding: '14px 18px',
    borderRadius: '16px',
    boxShadow: '0 12px 24px rgba(31, 42, 68, 0.12)',
    border: '1px solid #eef1ff',
  },
  heroMiniTitle: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1f2a44',
  },
  heroMiniText: {
    margin: '0.3rem 0 0 0',
    fontSize: '0.85rem',
    color: '#6b7280',
  },
  categoriesSection: {
    padding: '60px 40px',
    background: 'transparent',
    flex: 1,
  },
  sectionWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1f2a44',
    marginBottom: '3rem',
    textAlign: 'center',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
  categoryCardLink: {
    textDecoration: 'none',
  },
  categoryCard: {
    background: 'white',
    borderRadius: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(31, 42, 68, 0.08)',
    animation: 'fadeInUp 0.6s ease-out both',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #eef1ff',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  categoryImageBanner: {
    width: '100%',
    height: '160px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderBottom: '2px solid #f0f0f0',
  },
  categoryCardBody: {
    padding: '2rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  categoryIconWrapper: {
    width: '70px',
    height: '70px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
  },
  categoryIcon: {
    fontSize: '2rem',
    color: 'white',
  },
  categoryName: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#333',
    marginBottom: '0.8rem',
  },
  categoryDescription: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  categoryArrow: {
    position: 'absolute',
    bottom: '1.5rem',
    right: '1.5rem',
    fontSize: '1.5rem',
    color: '#3f5bd8',
    opacity: 0,
    transform: 'translateX(-10px)',
    transition: 'all 0.3s ease',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '3rem',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3f5bd8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '1.1rem',
    color: '#3f5bd8',
  },
  noCategories: {
    fontSize: '1.1rem',
    color: '#999',
    textAlign: 'center',
    padding: '2rem',
  },
  footer: {
    background: '#3045a4',
    color: 'white',
    padding: '2rem',
    textAlign: 'center',
    marginTop: 'auto',
  },
};