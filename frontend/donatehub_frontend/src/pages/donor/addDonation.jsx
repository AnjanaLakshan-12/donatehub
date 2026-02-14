import { useEffect, useMemo, useState } from "react";
import { addDonation } from "../../services/donationService";
import { getCurrentUser } from "../../services/authService";
import { getCategories } from "../../services/categoryService";

export default function AddDonation({ user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const storedUser = useMemo(() => {
    if (user) return user;
    try {
      const raw = localStorage.getItem("donateHubUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [user]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setQuantity("");
    setLocation("");
    setCategoryId("");
    setFile(null);
  };

  const compressImage = (file, maxSizeKB = 150) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions (max 1200px)
          const maxDim = 1200;
          if (width > height && width > maxDim) {
            height = (height * maxDim) / width;
            width = maxDim;
          } else if (height > maxDim) {
            width = (width * maxDim) / height;
            height = maxDim;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Start with quality 0.8 and reduce if needed
          let quality = 0.8;
          const tryCompress = () => {
            canvas.toBlob((blob) => {
              if (blob.size <= maxSizeKB * 1024 || quality <= 0.1) {
                resolve(new File([blob], file.name, { type: 'image/jpeg' }));
              } else {
                quality -= 0.1;
                tryCompress();
              }
            }, 'image/jpeg', quality);
          };
          tryCompress();
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const resolveCurrentUser = async () => {
    if (storedUser?.id || storedUser?.username || storedUser?.email || storedUser?.userName) {
      return storedUser;
    }

    try {
      const response = await getCurrentUser();
      const sessionUser = response?.data || null;
      if (sessionUser) {
        localStorage.setItem("donateHubUser", JSON.stringify(sessionUser));
      }
      return sessionUser;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!file) {
      setError("Please upload an image or document.");
      return;
    }

    setLoading(true);

    try {
      const currentUser = await resolveCurrentUser();
      if (!currentUser) {
        setError("Please log in again before creating a donation.");
        setLoading(false);
        return;
      }

      // Compress image if it's an image file
      let finalFile = file;
      if (file.type.startsWith('image/')) {
        setError("Compressing image...");
        finalFile = await compressImage(file, 150);
        setError(""); // Clear compression message
      }

      // Check final file size
      const maxFileSize = 150 * 1024; // 150KB
      if (finalFile.size > maxFileSize) {
        setError(`File size must be less than 150KB. Current: ${Math.round(finalFile.size / 1024)}KB`);
        setLoading(false);
        return;
      }

      const donationPayload = {
        title: title.trim(),
        description: description.trim(),
        quantity: Number(quantity),
        location: location.trim() || undefined,
        status: "AVAILABLE",
        category: { id: Number(categoryId) }
      };

    if (currentUser?.email) {
      donationPayload.user = { email: currentUser.email };
    } else if (currentUser?.id) {
      donationPayload.user = { id: currentUser.id };
    } else if (currentUser?.username || currentUser?.userName) {
      donationPayload.user = { username: currentUser.username || currentUser.userName };
    }

    const formData = new FormData();
    formData.append(
      "donation",
      new Blob([JSON.stringify(donationPayload)], { type: "application/json" })
    );
    formData.append("file", finalFile);

    try {
      await addDonation(formData);
      setSuccess("Donation created successfully.");
      resetForm();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Failed to create donation.";
      setError(message);
    } finally {
      setLoading(false);
    }
  } catch (compressionError) {
    setError("Failed to compress image. Please try a different file.");
    setLoading(false);
  }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.badge}>Donate</div>
          <h2 style={styles.title}>Add Donation</h2>
          <p style={styles.subtitle}>Share items with the community in a few steps.</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div style={styles.successBox}>
            <span style={styles.successIcon}>✅</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="title" style={styles.label}>Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Winter Jackets"
              required
              disabled={loading}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="description" style={styles.label}>Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the items, condition, and any details..."
              rows={4}
              required
              disabled={loading}
              style={styles.textarea}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label htmlFor="quantity" style={styles.label}>Quantity *</label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                required
                disabled={loading}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="location" style={styles.label}>Location</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or district"
                disabled={loading}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label htmlFor="category" style={styles.label}>Category *</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={loading}
              style={styles.select}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label htmlFor="file" style={styles.label}>Upload Image/File *</label>
            <input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept="image/*"
              required
              disabled={loading}
              style={styles.fileInput}
            />
            {file && (
              <div style={styles.fileHint}>
                Selected: <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB)
                {file.type.startsWith('image/') && file.size > 150 * 1024 && (
                  <span style={styles.warnText}> ⚠ Large image - will be compressed automatically</span>
                )}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Submitting..." : "Create Donation"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 70px)',
    background: 'linear-gradient(135deg, #f6f9ff 0%, #eef6ff 100%)',
    padding: '2.5rem 1.5rem',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '900px',
    background: 'white',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 20px 60px rgba(141, 160, 242, 0.18)',
    border: '1px solid #e6f0ff',
  },
  header: {
    marginBottom: '2rem',
  },
  badge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '0.35rem 0.7rem',
    borderRadius: '999px',
    letterSpacing: '0.5px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#8da0f2',
    marginTop: '0.8rem',
    marginBottom: '0.4rem',
  },
  subtitle: {
    color: '#555',
    fontSize: '0.95rem',
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
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '0.85rem 1rem',
    border: '2px solid #e6e6e6',
    borderRadius: '10px',
    fontSize: '0.95rem',
    outline: 'none',
  },
  textarea: {
    padding: '0.85rem 1rem',
    border: '2px solid #e6e6e6',
    borderRadius: '10px',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical',
  },
  select: {
    padding: '0.85rem 1rem',
    border: '2px solid #e6e6e6',
    borderRadius: '10px',
    fontSize: '0.95rem',
    background: 'white',
    cursor: 'pointer',
  },
  fileInput: {
    padding: '0.75rem',
    border: '2px dashed #cfe1ff',
    borderRadius: '10px',
    background: '#f4f8ff',
    cursor: 'pointer',
  },
  fileHint: {
    marginTop: '0.5rem',
    fontSize: '0.85rem',
    color: '#555',
  },
  warnText: {
    color: '#b45309',
    fontWeight: '600',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
    color: 'white',
    padding: '0.95rem 1.5rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(141, 160, 242, 0.35)',
  },
  errorBox: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
    color: 'white',
    padding: '0.9rem 1rem',
    borderRadius: '10px',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  errorIcon: {
    fontSize: '1.1rem',
  },
  successBox: {
    background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
    color: 'white',
    padding: '0.9rem 1rem',
    borderRadius: '10px',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  successIcon: {
    fontSize: '1.1rem',
  },
};