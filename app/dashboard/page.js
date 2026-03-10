"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
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

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
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

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
                // Trigger fade-in animation after loading
                setTimeout(() => setFadeIn(true), 100);
            }
        }

        fetchData();
    }, []);

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
                        Welcome to your Dashboard!
                    </h1>
                    <p style={styles.text}>This is a protected page. Only logged in users can see this.</p>
                </div>

                <div style={styles.buttonContainer}>
                    <button
                        onClick={() => router.push('/profile')}
                        style={styles.primaryButton}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Go to Profile
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

                <div style={styles.categoriesSection}>
                    <h2 style={styles.subtitle}>
                        Categories
                    </h2>

                    {loading ? (
                        <div style={styles.loadingContainer}>
                            <div style={styles.spinner}></div>
                            <p style={styles.loadingText}>Loading categories...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyIcon}>No Categories</div>
                            <p style={styles.noData}>No Categories available.</p>
                            <p style={styles.emptySubtext}>Check back later for new categories!</p>
                        </div>
                    ) : (
                        <div style={styles.categoryRow}>
                            {categories.map((category, index) => (
                                <div
                                    key={category._id}
                                    style={{
                                        ...styles.categoryCard,
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                    onClick={() => router.push(`/products?category=${category.key}`)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                                        const img = e.currentTarget.querySelector('img');
                                        if (img) img.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                        const img = e.currentTarget.querySelector('img');
                                        if (img) img.style.transform = 'scale(1)';
                                    }}
                                >
                                    {category.image && (
                                        <div style={styles.imageContainer}>
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                style={styles.categoryImage}
                                            />
                                        </div>
                                    )}
                                    <div style={styles.cardContent}>
                                        <h3 style={styles.categoryName}>{category.name}</h3>
                                        {category.description && (
                                            <p style={styles.categoryDescription}>{category.description}</p>
                                        )}
                                    </div>
                                    <div style={styles.cardOverlay}></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

async function fetchCategories() {
    try {
        const response = await fetch("/api/categories",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
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
        textAlign: "center"
    },
    header: {
        marginBottom: "40px"
    },
    title: {
        color: "#333",
        fontSize: "clamp(28px, 5vw, 42px)",
        marginBottom: "15px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px"
    },
    text: {
        color: "#666",
        fontSize: "18px",
        marginBottom: "10px",
        fontWeight: "300"
    },
    buttonContainer: {
        display: "flex",
        gap: "20px",
        marginBottom: "50px",
        justifyContent: "center",
        flexWrap: "wrap"
    },
    primaryButton: {
        background: "#007bff",
        color: "#fff",
        border: "none",
        padding: "15px 30px",
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
        padding: "15px 30px",
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
    categoriesSection: {
        width: "100%",
        margin: "0 auto",
        padding: "0 20px"
    },
    subtitle: {
        color: "#333",
        fontSize: "clamp(24px, 4vw, 32px)",
        marginBottom: "30px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px"
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
        border: "4px solid rgba(0, 0, 0, 0.1)",
        borderTop: "4px solid #333",
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
        marginBottom: "10px"
    },
    emptySubtext: {
        color: "#666",
        fontSize: "16px",
        fontWeight: "300"
    },
    categoryRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "25px",
        width: "100%",
        margin: "0 auto"
    },
    categoryCard: {
        background: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease-out",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        border: "1px solid #ddd",
        position: "relative",
        animation: "slideInUp 0.6s ease-out forwards",
        opacity: 0,
        transform: "translateY(30px)"
    },
    imageContainer: {
        position: "relative",
        overflow: "hidden",
        height: "180px"
    },
    categoryImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "transform 0.3s ease-out"
    },
    cardContent: {
        padding: "20px",
        position: "relative",
        zIndex: 2
    },
    categoryName: {
        fontSize: "22px",
        fontWeight: "600",
        color: "#333",
        marginBottom: "10px",
        transition: "color 0.3s ease"
    },
    categoryDescription: {
        fontSize: "14px",
        color: "#666",
        lineHeight: "1.5",
        margin: 0
    },
    cardOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 123, 255, 0.08)",
        opacity: 0,
        transition: "opacity 0.3s ease",
        pointerEvents: "none"
    }
};

