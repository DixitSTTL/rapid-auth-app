"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Inject CSS animations
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(1deg); }
        66% { transform: translateY(5px) rotate(-1deg); }
      }

      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      @keyframes slideInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);

    // Trigger fade-in animation
    setTimeout(() => setFadeIn(true), 100);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }


  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password || !name) {
      alert("Please fill in all required fields");
      return;
    }
    if (image && !image.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }

    setLoading(true);

    try {
      let imageFile = null;
      if (image) {
        const response = await fetch(
          `/api/upload?filename=${Date.now()}${image.name}`,
          {
            method: 'POST',
            body: image,
          },
        );
        const newBlob = (await response.json()) || {};
        imageFile = newBlob.url;
      }

      // Create FormData to send file
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", name);
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const res = await fetch("/api/signup", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        alert("User created successfully");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name);
        // Reset form
        setEmail("");
        setPassword("");
        setName("");
        setImage(null);
        setImagePreview(null);
        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        const error = await res.json();
        alert("Error creating user: " + (error.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.backgroundAnimation}></div>

      <div style={{
        ...styles.content,
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.8s ease-out'
      }}>
        <form onSubmit={handleSubmit} style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>
              Create Account
            </h2>
            <p style={styles.subtitle}>Join us and start your journey</p>
          </div>

          <div style={styles.profileWrapper}>
            <label style={styles.profileLabel}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" style={styles.profileImage} />
              ) : (
                <div style={styles.profilePlaceholder}>
                  Upload Photo
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.hiddenInput}
                disabled={loading}
              />
            </label>
          </div>

          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              disabled={loading}
            />

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading && styles.buttonLoading)
            }}
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? (
              <div style={styles.buttonContent}>
                <div style={styles.spinner}></div>
                Creating Account...
              </div>
            ) : (
              <div style={styles.buttonContent}>
                Sign Up
              </div>
            )}
          </button>

          <div style={styles.loginLink}>
            <text style={styles.loginText}>Already have an account?</text>
            <Link href="/login" style={styles.loginButton}>
              Log in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },
  backgroundAnimation: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.02)"
  },
  content: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "450px"
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    border: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    gap: "25px",
    animation: "slideInUp 0.8s ease-out"
  },
  header: {
    textAlign: "center"
  },
  title: {
    fontSize: "clamp(28px, 5vw, 36px)",
    fontWeight: "700",
    color: "#333",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
  },
  subtitle: {
    color: "#666",
    fontSize: "16px",
    margin: 0,
    fontWeight: "300"
  },
  profileWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px"
  },
  profileLabel: {
    cursor: "pointer",
    transition: "transform 0.3s ease"
  },
  profileImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #ccc",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease"
  },
  profilePlaceholder: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "#f0f0f0",
    color: "#666",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "3px solid #ddd",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  hiddenInput: {
    display: "none"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  input: {
    padding: "16px 20px",
    borderRadius: "12px",
    border: "2px solid #ddd",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
    background: "#fff",
    color: "#333",
    fontWeight: "400"
  },
  button: {
    padding: "16px 32px",
    borderRadius: "50px",
    border: "none",
    background: "#28a745",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    transform: "translateY(0)"
  },
  buttonLoading: {
    background: "#ccc",
    cursor: "not-allowed",
    animation: "pulse 1.5s infinite"
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  loginLink: {
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "1px solid rgba(0, 0, 0, 0.1)"
  },
  loginText: {
    color: "#666",
    fontSize: "14px",
    marginRight: "5px"
  },
  loginButton: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    transition: "color 0.3s ease"
  }
};