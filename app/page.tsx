
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [fadeIn, setFadeIn] = useState(false);

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
        <div style={styles.welcomeCard}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              Welcome to Rapid Auth App
            </h1>
            <p style={styles.subtitle}>
              Secure, fast authentication for your Next.js project. Please log in or sign up to continue.
            </p>
          </div>

          <div style={styles.buttonContainer}>
            <Link href="/login" style={styles.loginButton}>
              Login
            </Link>
            <Link href="/signup" style={styles.signupButton}>
              Sign Up
            </Link>
          </div>
        </div>
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
    maxWidth: "500px"
  },
  welcomeCard: {
    background: "#fff",
    borderRadius: "24px",
    padding: "50px 40px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    border: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "40px",
    animation: "slideInUp 0.8s ease-out"
  },
  header: {
    textAlign: "center"
  },
  title: {
    fontSize: "clamp(32px, 6vw, 42px)",
    fontWeight: "700",
    color: "#333",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    lineHeight: "1.2"
  },
  subtitle: {
    fontSize: "18px",
    color: "#666",
    lineHeight: "1.6",
    margin: 0,
    fontWeight: "400",
    maxWidth: "400px"
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    maxWidth: "300px"
  },
  loginButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "18px 32px",
    borderRadius: "50px",
    background: "#007bff",
    color: "#fff",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    textAlign: "center",
    transform: "translateY(0)"
  },
  signupButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "18px 32px",
    borderRadius: "50px",
    background: "#28a745",
    color: "#fff",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    textAlign: "center",
    transform: "translateY(0)"
  }
};
