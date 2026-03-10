    "use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    `;
    document.head.appendChild(styleSheet);

    // Trigger fade-in animation
    setTimeout(() => setFadeIn(true), 100);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        localStorage.setItem("userEmail", email);
        // Success animation
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
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
            <h1 style={styles.title}>
              Welcome Back
            </h1>
            <p style={styles.subtitle}>Sign in to your account</p>
          </div>

          <div style={styles.inputGroup}>
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
                Signing In...
              </div>
            ) : (
              <div style={styles.buttonContent}>
                Login
              </div>
            )}
          </button>

          <div style={styles.signupLink}>
            <text style={styles.signupText}>Don't have an account?</text>
            <Link href="/signup" style={styles.signupButton}>
              Sign up here
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
    maxWidth: "400px"
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
    background: "#007bff",
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
  signupLink: {
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "1px solid rgba(0, 0, 0, 0.1)"
  },
  signupText: {
    color: "#666",
    fontSize: "14px",
    marginRight: "5px"
  },
  signupButton: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    transition: "color 0.3s ease"
  }
};