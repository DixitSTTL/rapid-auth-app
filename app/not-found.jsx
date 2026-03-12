"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {

  useEffect(() => {
    // Inject CSS animations specific to 404 page
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(1deg); }
        66% { transform: translateY(5px) rotate(-1deg); }
      }

      @keyframes slideInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }


    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.errorCode}>404</h1>
        <h2 style={styles.title}>Page Not Found</h2>
        <Link href="/" style={styles.primaryButton}>
          Go Home
        </Link>
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
  content: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "500px"
  },
  errorCode: {
    fontSize: "clamp(48px, 10vw, 72px)",
    fontWeight: "400",
    color: "#6c9fd1",
    margin: "0 0 15px 0"
  },
  title: {
    fontSize: "clamp(18px, 3vw, 24px)",
    fontWeight: "500",
    color: "#777",
    margin: "0 0 20px 0"
  },
  primaryButton: {
    padding: "12px 28px",
    borderRadius: "50px",
    border: "none",
    background: "#a8c9e1",
    color: "#555",
    fontSize: "15px",
    color: "#fff",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
    display: "inline-block"
  }
};
