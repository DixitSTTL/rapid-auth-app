"use client";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const data = await fetchCategories();
            setCategories(data);
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
            <h1 style={styles.title}>Welcome to your Dashboard!</h1>
            <p style={styles.text}>This is a protected page. Only logged in users can see this.</p>
            <div style={styles.buttonContainer}>
                <button onClick={() => router.push('/profile')} style={styles.button}>Go to Profile</button>
                <button onClick={handleLogout} style={{...styles.button, backgroundColor: '#dc3545'}}>Logout</button>
            </div>

            <h2 style={styles.subtitle}>Categories</h2>
            {categories.length === 0 ? (
                <p style={styles.noData}>No Categories available.</p>
            ) : (
                <div style={styles.categoryRow}>
                    {categories.map(category => (
                        <div key={category._id} style={styles.categoryCard} onClick={() => router.push(`/products?category=${category.key}`)} >
                            {category.image && <img src={category.image} alt={category.name} style={styles.categoryImage} />}
                            <h3 style={styles.categoryName}>{category.name}</h3>
                            {category.description && <p style={styles.categoryDescription}>{category.description}</p>}
                        </div>
                    ))}
                </div>
            )}
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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
        padding: "20px"
    },
    title: {
        color: "#fff",
        fontSize: "32px",
        marginBottom: "20px"
    },
    text: {
        color: "#fff",
        fontSize: "18px",
        marginBottom: "40px"
    },
    subtitle: {
        color: "#fff",
        fontSize: "24px",
        marginBottom: "20px"
    },
    categoryRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        width: "100%",
        maxWidth: "1200px"
    },
    categoryCard: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "20px",
        borderRadius: "12px",
        color: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "250px",
        textAlign: "center",
        transition: "transform 0.2s"
    },
    categoryImage: {
        width: "100%",
        height: "150px",
        objectFit: "cover",
        borderRadius: "8px",
        marginBottom: "10px"
    },
    categoryName: {
        fontSize: "20px",
        marginBottom: "10px"
    },
    categoryPrice: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "10px"
    },
    categoryDescription: {
        fontSize: "14px",
        color: "rgba(255, 255, 255, 0.8)"
    },
    noData: {
        color: "#fff",
        fontSize: "16px",
        fontStyle: "italic"
    },
    buttonContainer: {
        display: "flex",
        gap: "10px",
        marginBottom: "40px",
        justifyContent: "center"
    },
    button: {
        backgroundColor: "#fff",
        color: "#1a1a2e",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
        marginBottom: "20px"
    }
}