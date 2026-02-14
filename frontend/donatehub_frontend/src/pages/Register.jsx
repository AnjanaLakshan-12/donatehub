import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    district: "",
    role: "DONOR", // Default role
    // Organization-specific fields
    organizationName: "",
    registrationNumber: "",
    phone: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError("First Name and Last Name are required.");
        setLoading(false);
        return;
      }

      if (!formData.email.trim() || !formData.password.trim()) {
        setError("Email and Password are required.");
        setLoading(false);
        return;
      }

      if (formData.role === "ORG") {
        if (!formData.organizationName.trim()) {
          setError("Organization Name is required for organization registration.");
          setLoading(false);
          return;
        }
        if (!formData.phone.trim()) {
          setError("Phone number is required for organization registration.");
          setLoading(false);
          return;
        }
      }

      // Calling your Spring Boot User Controller
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        district: formData.district.trim(),
        role: formData.role
      };

      // Organization data (sent as query params if role is ORG)
      let orgData = null;
      if (formData.role === "ORG") {
        orgData = {
          orgName: formData.organizationName.trim(),
          orgType: "Organization"
        };
        
        // Only include regNumber if provided
        if (formData.registrationNumber.trim()) {
          orgData.regNumber = formData.registrationNumber.trim();
        }
      }

      const response = await registerUser(userData, orgData);
      setError("");
      alert("Registration Successful! Please log in.");
      navigate("/login"); // Redirect to login
    } catch (err) {
      console.error("Registration failed:", err);
      const errorMsg = err.response?.data?.message || err.message || "Error during registration. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const isOrganization = formData.role === "ORG";

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Create an Account</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Role *</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              disabled={loading}
              style={styles.select}>
              <option value="DONOR">Donor</option>
              <option value="ORG">Organization (Pharmacy/NGO)</option>
            </select>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>First Name *</label>
              <input 
                name="firstName" 
                placeholder="First Name" 
                value={formData.firstName}
                onChange={handleChange} 
                required
                disabled={loading}
                style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Last Name *</label>
              <input 
                name="lastName" 
                placeholder="Last Name" 
                value={formData.lastName}
                onChange={handleChange} 
                required
                disabled={loading}
                style={styles.input} />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email *</label>
            <input 
              name="email" 
              type="text" 
              placeholder="Email" 
              value={formData.email}
              onChange={handleChange} 
              required
              disabled={loading}
              style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password *</label>
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange} 
              required
              disabled={loading}
              style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>District *</label>
            <input 
              name="district" 
              placeholder="District (e.g., Colombo)" 
              value={formData.district}
              onChange={handleChange} 
              required
              disabled={loading}
              style={styles.input} />
          </div>

          {isOrganization && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Organization Name *</label>
                <input 
                  name="organizationName" 
                  placeholder="Organization Name" 
                  value={formData.organizationName}
                  onChange={handleChange} 
                  required
                  disabled={loading}
                  style={styles.input} />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Registration Number</label>
                <input 
                  name="registrationNumber" 
                  placeholder="Registration Number (optional)" 
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  disabled={loading}
                  style={styles.input} />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input 
                  name="phone" 
                  type="tel"
                  placeholder="Phone Number" 
                  value={formData.phone}
                  onChange={handleChange} 
                  required
                  disabled={loading}
                  style={styles.input} />
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={loading ? {...styles.submitBtn, opacity: 0.6} : styles.submitBtn}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        
        <p style={styles.footerText}>
          Already have an account? <a href="/login" style={styles.link}>Login here</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    background: 'linear-gradient(120deg, #e6f0ff 0%, #f6f9ff 45%, #b9dcff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  formCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '3rem',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 10px 40px rgba(141, 160, 242, 0.2)',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#8da0f2',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '0.9rem 1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    transition: 'border-color 200ms ease',
    outline: 'none',
  },
  select: {
    padding: '0.9rem 1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    background: 'white',
    cursor: 'pointer',
  },
  submitBtn: {
    background: '#8da0f2',
    color: 'white',
    padding: '1rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'all 200ms ease',
  },
  error: {
    background: '#ffe6e6',
    color: '#d32f2f',
    padding: '0.8rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#666',
    fontSize: '0.9rem',
  },
  link: {
    color: '#8da0f2',
    textDecoration: 'none',
    fontWeight: '600',
  },
};






