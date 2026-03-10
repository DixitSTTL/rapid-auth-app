"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const userEmail = localStorage.getItem("userEmail");

                if (!userEmail) {
                    router.push("/login");
                    return;
                }

                const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    router.push("/login");
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserProfile();
    }, [router]);

    async function handleLogout() {
        try {
            await fetch("/api/logout", {
                method: "POST"
            });
            localStorage.removeItem("userEmail");
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.backgroundAnimation}></div>
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <p style={styles.loadingText}>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={styles.container}>
                <div style={styles.backgroundAnimation}></div>
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>Profile</div>
                    <p style={styles.noData}>User not found</p>
                    <button onClick={() => router.push('/login')} style={styles.primaryButton}>
                        Go to Login
                    </button>
                </div>
            </div>
        );
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
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        Your Profile
                    </h1>
                    <p style={styles.subtitle}>Manage your account information</p>
                </div>

                <div style={styles.card}>
                    {user && user.profileImage && (
                        <div style={styles.imageContainer}>
                            <img src={user.profileImage} alt={user?.name || 'Profile'} style={styles.profileImage} />
                        </div>
                    )}

                    <div style={styles.userInfo}>
                        <div style={styles.infoItem}>
                            <span style={styles.label}>Name:</span>
                            <span style={styles.value}>{user?.name || 'N/A'}</span>
                        </div>
                        <div style={styles.infoItem}>
                            <span style={styles.label}>Email:</span>
                            <span style={styles.value}>{user?.email || 'N/A'}</span>
                        </div>
                    </div>

                    <div style={styles.buttonContainer}>
                        <button
                            onClick={() => router.push('/dashboard')}
                            style={styles.primaryButton}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={handleLogout}
                            style={styles.logoutButton}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
        header: {
            textAlign: "center",
            marginBottom: "30px"
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
        loadingContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px"
        },
        spinner: {
            width: "50px",
            height: "50px",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTop: "4px solid #fff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px"
        },
        loadingText: {
            color: "#333",
            fontSize: "18px",
            fontWeight: "300"
        },
        emptyState: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            border: "1px solid #ddd"
        },
        emptyIcon: {
            fontSize: "24px",
            marginBottom: "20px",
            color: "#333",
            fontWeight: "bold"
        },
        noData: {
            color: "#333",
            fontSize: "20px",
            fontWeight: "500",
            marginBottom: "20px"
        },
        card: {
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            border: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "25px",
            animation: "slideInUp 0.8s ease-out"
        },
        imageContainer: {
            position: "relative"
        },
        profileImage: {
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid #ccc",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "transform 0.3s ease"
        },
        userInfo: {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "15px"
        },
        infoItem: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 20px",
            background: "#f9f9f9",
            borderRadius: "12px",
            border: "1px solid #ddd"
        },
        label: {
            fontSize: "16px",
            fontWeight: "600",
            color: "#333"
        },
        value: {
            fontSize: "16px",
            color: "#666",
            fontWeight: "500"
        },
        buttonContainer: {
            display: "flex",
            gap: "15px",
            width: "100%",
            justifyContent: "center",
            flexWrap: "wrap"
        },
        primaryButton: {
            background: "#007bff",
            color: "#fff",
            border: "none",
            padding: "15px 25px",
            borderRadius: "50px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transform: "translateY(0)"
        },
        logoutButton: {
            background: "#dc3545",
            color: "#fff",
            border: "none",
            padding: "15px 25px",
            borderRadius: "50px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transform: "translateY(0)"
        }
    }
