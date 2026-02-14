import { useState } from "react";
import axios from "axios";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    
    // Check if all required fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    setIsLoading(true);
    setStatus({ type: "", message: "" });

    // Create FormData object for query parameters
    const params = new URLSearchParams({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      message: formData.message,
    });

    if (formData.phone) {
      params.append("phone", formData.phone);
    }

    const url = `http://localhost:8080/api/contact/submit?${params.toString()}`;
    console.log("Sending request to:", url);

    axios
      .post(url)
      .then((response) => {
        console.log("Message sent successfully:", response.data);
        setIsLoading(false);
        setStatus({
          type: "success",
          message: typeof response.data === "string" ? response.data : "Thank you for contacting us! We'll get back to you soon.",
        });
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        setIsLoading(false);
        const errorMessage = 
          typeof error.response?.data === "string" 
            ? error.response.data 
            : error.message || "Failed to send message. Please try again later.";
        
        setStatus({
          type: "error",
          message: errorMessage,
        });
      });
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Contact</h1>
          <p style={styles.subtitle}>
            Have questions or need assistance? We're here to help.
            <br />
            Get in touch with us today!
          </p>
        </div>
        {/* Decorative circles */}
        <div style={{ ...styles.circle, top: "20%", left: "10%" }}></div>
        <div style={{ ...styles.circle, top: "15%", right: "15%", width: "80px", height: "80px" }}></div>
        <div style={{ ...styles.circle, bottom: "10%", left: "15%", width: "60px", height: "60px" }}></div>
        <div style={{ ...styles.circle, bottom: "20%", right: "10%", width: "70px", height: "70px" }}></div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Contact Information */}
        <div style={styles.contactInfo}>
          <h2 style={styles.sectionTitle}>Get in touch</h2>

          <div style={styles.infoSection}>
            <h3 style={styles.infoTitle}>📞 Phone</h3>
            <p style={styles.infoText}>
              You'll be directed to our team who can help you in resolving your queries. Pleased to
              serve you 24/7.
            </p>
            <p style={styles.contactDetail}>+94 (70) 355-4379</p>
          </div>

          <div style={styles.infoSection}>
            <h3 style={styles.infoTitle}>✉️ Email</h3>
            <p style={styles.infoText}>
              You can reach us via email and we'll respond within 24 hours.
            </p>
            <p style={styles.contactDetail}>anjanalakshan186@gmail.com</p>
          </div>

          <div style={styles.infoSection}>
            <h3 style={styles.infoTitle}>📍 Main Office</h3>
            <p style={styles.infoText}>Pitipana - Thalagala Rd, Homagama</p>
          </div>

          <div style={styles.infoSection}>
            <h3 style={styles.infoTitle}>📍 Regional Office</h3>
            <p style={styles.infoText}>Thaniyage Bodima, Pitipana North, Homagama</p>
          </div>
        </div>

        {/* Contact Form */}
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.icon}>👤</span> First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.icon}>👤</span> Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span style={styles.icon}>✉️</span> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span style={styles.icon}>📞</span> Phone (optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span style={styles.icon}>💬</span> Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Leave message"
                style={styles.textarea}
                rows="5"
                required
              />
            </div>

            {status.message && (
              <div
                style={{
                  ...styles.statusMessage,
                  backgroundColor: status.type === "success" ? "#d4edda" : "#f8d7da",
                  color: status.type === "success" ? "#155724" : "#721c24",
                }}
              >
                {status.message}
              </div>
            )}

            <button type="submit" style={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div style={styles.mapContainer}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.5964217447627!2d80.02592147568105!3d6.818840219659413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25300488e5315%3A0x8d407f0b03fbd961!2sThaniyage%20bodima!5e0!3m2!1sen!2slk!4v1770998563722!5m2!1sen!2slk"
          width="100%"
          height="400"
          style={styles.map}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f9fafb",
  },
  header: {
    background: "linear-gradient(135deg, #5b7ef5 0%, #3f5bd8 100%)",
    padding: "4rem 2rem",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  headerContent: {
    position: "relative",
    zIndex: 2,
  },
  title: {
    fontSize: "3.5rem",
    color: "white",
    fontWeight: "700",
    marginBottom: "1rem",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  subtitle: {
    fontSize: "1.15rem",
    color: "rgba(255, 255, 255, 0.95)",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  circle: {
    position: "absolute",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.15)",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    zIndex: 1,
  },
  mainContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "4rem 2rem",
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "4rem",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
      padding: "2rem 1rem",
    },
  },
  contactInfo: {
    paddingRight: "2rem",
  },
  sectionTitle: {
    fontSize: "2rem",
    color: "#1f2a44",
    fontWeight: "700",
    marginBottom: "2rem",
  },
  infoSection: {
    marginBottom: "2rem",
  },
  infoTitle: {
    fontSize: "1.1rem",
    color: "#1f2a44",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
  infoText: {
    fontSize: "0.95rem",
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "0.5rem",
  },
  contactDetail: {
    fontSize: "1rem",
    color: "#3f5bd8",
    fontWeight: "600",
  },
  formContainer: {
    background: "white",
    padding: "2.5rem",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "0.9rem",
    color: "#1f2a44",
    fontWeight: "600",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  icon: {
    fontSize: "1rem",
  },
  input: {
    padding: "0.8rem 1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.3s ease",
  },
  textarea: {
    padding: "0.8rem 1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    transition: "all 0.3s ease",
  },
  submitButton: {
    background: "#3f5bd8",
    color: "white",
    padding: "1rem 2rem",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(63, 91, 216, 0.3)",
  },
  statusMessage: {
    padding: "1rem",
    borderRadius: "8px",
    fontSize: "0.95rem",
    textAlign: "center",
  },
  mapContainer: {
    maxWidth: "1200px",
    margin: "0 auto 4rem",
    padding: "0 2rem",
  },
  map: {
    border: "none",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  },
};
