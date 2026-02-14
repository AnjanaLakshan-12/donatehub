import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getCurrentUser } from "../services/authService";
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

export default function Login({ setUser }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log("Attempting login with:", credentials);
      // 1. Perform Login (Spring intercepts and creates session)
      const loginResponse = await loginUser(credentials);
      console.log("Login successful:", loginResponse);
      
      // 2. Fetch the user details using the session cookie
      const response = await getCurrentUser();
      const userData = response.data;
      console.log("User data retrieved:", userData);

      setUser(userData);
      localStorage.setItem("donateHubUser", JSON.stringify(userData));

      // 3. Redirect based on role
      if (userData.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      const errorMessage = err.response?.data?.message || err.response?.status || "Invalid email or password";
      setError(`Error: ${errorMessage}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <div style={styles.iconCircle}>
          <FaSignInAlt style={styles.mainIcon} />
        </div>
        
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back! 👋</h2>
          <p style={styles.subtitle}>Sign in to your DonateHub account</p>
        </div>
        
        {error && (
          <div style={styles.error}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <FaEnvelope style={styles.inputIcon} />
              <input 
                name="email" 
                type="text" 
                placeholder="Email address" 
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <FaLock style={styles.inputIcon} />
              <input 
                name="password" 
                type="password" 
                placeholder="Password" 
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>
          
          <button type="submit" style={styles.submitBtn}>
            <FaSignInAlt style={{ marginRight: '0.5rem' }} />
            Sign In
          </button>
        </form>
        
        <p style={styles.footerText}>
          Don't have an account? <a href="/register" style={styles.link}>Register here</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    background: 'linear-gradient(135deg, #f6f9ff 0%, #eef6ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  formCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '3rem',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(141, 160, 242, 0.25)',
    animation: 'fadeInUp 0.6s ease-out',
    position: 'relative',
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    boxShadow: '0 8px 20px rgba(141, 160, 242, 0.3)',
  },
  mainIcon: {
    fontSize: '2rem',
    color: 'white',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#333',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#666',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: '#999',
    fontSize: '1rem',
    pointerEvents: 'none',
  },
  input: {
    padding: '1rem 1rem 1rem 3rem',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    width: '100%',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
    color: 'white',
    padding: '1.1rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(141, 160, 242, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
    color: 'white',
    padding: '1rem 1.2rem',
    borderRadius: '12px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '2rem',
    color: '#666',
    fontSize: '0.9rem',
  },
  link: {
    color: '#8da0f2',
    textDecoration: 'none',
    fontWeight: '600',
  },
};







