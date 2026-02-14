import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { logoutUser } from "../services/authService";
import { getCategories } from "../services/categoryService";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDonationsDropdown, setShowDonationsDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const donationsDropdownRef = useRef(null);

  const normalizeCategories = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.categories)) return data.categories;
    return [];
  };

  useEffect(() => {
    fetchCategories();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (donationsDropdownRef.current && !donationsDropdownRef.current.contains(event.target)) {
        setShowDonationsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      console.log("Categories API Response:", res.data);
      const normalized = normalizeCategories(res.data);
      console.log("Normalized Categories:", normalized);
      setCategories(normalized);
    } catch (err) {
      console.error("Error fetching categories:", err);
      console.error("Error details:", err.response?.status, err.response?.data || err.message);
      // If 403 Forbidden or other error, just set empty categories
      setCategories([]);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("donateHubUser");
      navigate("/");
    }
  };

  const handleViewProfile = () => {
    navigate("/user-profile");
    setShowDropdown(false);
  };

  const handleDonationSelect = (path) => {
    navigate(path);
    setShowDonationsDropdown(false);
  };

  const formatCategoryPath = (category) => {
    const name = category?.name || category?.categoryName || category;
    return `/donations/category/${encodeURIComponent(name)}`;
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>DonateHub</Link>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.link}>Home</Link>

          <div style={styles.donationsContainer} ref={donationsDropdownRef}>
            <button
              onClick={() => setShowDonationsDropdown(!showDonationsDropdown)}
              style={styles.donationsBtn}
            >
              Donations ▾
            </button>

            {showDonationsDropdown && (
              <div style={styles.donationsDropdown}>
                <button
                  onClick={() => handleDonationSelect("/browse-donations")}
                  onMouseEnter={() => setHoveredItem("all")}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    ...styles.donationsDropdownItem,
                    backgroundColor: hoveredItem === "all" ? "#eef3ff" : "transparent",
                  }}
                >
                  Available Donations
                </button>
                <div style={styles.divider}></div>
                {categories.length === 0 ? (
                  <div style={styles.emptyDropdownItem}>No categories available</div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.id || category}
                      onClick={() => handleDonationSelect(formatCategoryPath(category))}
                      onMouseEnter={() => setHoveredItem(category.id || category)}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{
                        ...styles.donationsDropdownItem,
                        backgroundColor: hoveredItem === (category.id || category) ? "#eef3ff" : "transparent",
                      }}
                    >
                      {category?.name || category?.categoryName || category}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <Link to="/about" style={styles.link}>About Us</Link>
          <Link to="/contact" style={styles.link}>Contact Us</Link>

          {user?.role === "DONOR" && (
            <Link to="/donor-dashboard" style={styles.link}>For Donors</Link>
          )}
          {user?.role === "ORG" && (
            <Link to="/organization-profile" style={styles.link}>For Organizations</Link>
          )}
          {user?.role === "ADMIN" && (
            <Link to="/admin" style={styles.link}>Admin</Link>
          )}
        </div>

        <div style={styles.rightSection}>
          {!user ? (
            <>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Register</Link>
            </>
          ) : (
            <>
              <div style={styles.profileContainer}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={styles.profileBtn}
                >
                  👤 {user.firstName || "Profile"}
                </button>

                {showDropdown && (
                  <div style={styles.dropdown}>
                    <button
                      onClick={handleViewProfile}
                      style={styles.dropdownItem}
                    >
                      View Profile
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                style={styles.logoutBtn}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "transparent",
    padding: "1.2rem 2rem",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(8px)",
    borderRadius: "18px",
    padding: "0.9rem 1.6rem",
    boxShadow: "0 12px 30px rgba(31, 42, 68, 0.08)",
    border: "1px solid rgba(63, 91, 216, 0.08)",
  },
  logo: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#1f2a44",
    textDecoration: "none",
    letterSpacing: "0.4px",
  },
  navLinks: {
    display: "flex",
    gap: "2rem",
    alignItems: "center",
  },
  donationsContainer: {
    position: "relative",
  },
  donationsBtn: {
    background: "transparent",
    color: "#1f2a44",
    border: "none",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    padding: "0.25rem 0",
  },
  donationsDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    background: "white",
    border: "1px solid #e9eefb",
    borderRadius: "12px",
    boxShadow: "0 12px 24px rgba(31, 42, 68, 0.12)",
    minWidth: "200px",
    zIndex: 1001,
    marginTop: "0.6rem",
    maxHeight: "400px",
    overflowY: "auto",
  },
  donationsDropdownItem: {
    width: "100%",
    padding: "0.8rem 1.2rem",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "0.9rem",
    textAlign: "left",
    color: "#1f2a44",
  },
  divider: {
    height: "1px",
    background: "#e9eefb",
    margin: "0.5rem 0",
  },
  emptyDropdownItem: {
    padding: "0.8rem 1.2rem",
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  link: {
    color: "#1f2a44",
    textDecoration: "none",
    fontSize: "0.95rem",
    fontWeight: "600",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
  },
  loginBtn: {
    color: "#1f2a44",
    textDecoration: "none",
    fontWeight: "600",
    padding: "0.55rem 1.1rem",
    borderRadius: "999px",
    border: "1px solid #dfe6fb",
    background: "white",
  },
  registerBtn: {
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
    padding: "0.55rem 1.2rem",
    borderRadius: "999px",
    background: "#3f5bd8",
    boxShadow: "0 10px 20px rgba(63, 91, 216, 0.25)",
  },
  profileContainer: {
    position: "relative",
  },
  profileBtn: {
    background: "#eef3ff",
    color: "#1f2a44",
    border: "none",
    padding: "0.55rem 1rem",
    borderRadius: "999px",
    fontWeight: "600",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: "110%",
    right: 0,
    background: "white",
    border: "1px solid #e9eefb",
    borderRadius: "12px",
    boxShadow: "0 12px 24px rgba(31, 42, 68, 0.12)",
    minWidth: "160px",
    zIndex: 1001,
    padding: "0.4rem",
  },
  dropdownItem: {
    width: "100%",
    padding: "0.65rem 0.9rem",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "0.9rem",
    textAlign: "left",
    color: "#1f2a44",
  },
  logoutBtn: {
    background: "#f1f4ff",
    color: "#1f2a44",
    border: "1px solid #e0e7ff",
    padding: "0.55rem 1rem",
    borderRadius: "999px",
    fontWeight: "600",
    cursor: "pointer",
  },
};