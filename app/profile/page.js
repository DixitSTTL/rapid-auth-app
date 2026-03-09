"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
        return <div style={styles.container}><p>Loading...</p></div>;
    }

    if (!user) {
        return <div style={styles.container}><p>User not found</p></div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Profile</h1>
            <div style={styles.card}>
                {user && user.profileImage && (
                    <img src={user.profileImage} alt={user?.name || 'Profile'} style={styles.profileImage} />
                )}
                <p style={styles.text}><strong>Name:</strong> {user?.name || 'N/A'}</p>
                <p style={styles.text}><strong>Email:</strong> {user?.email || 'N/A'}</p>
                <button onClick={() => router.push('/dashboard')} style={styles.button}>Back to Dashboard</button>
                <button onClick={handleLogout} style={{...styles.button, backgroundColor: '#dc3545', marginTop: '10px'}}>Logout</button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "30px",
        borderRadius: "12px",
        color: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        width: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    profileImage: {
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        objectFit: "cover",
        marginBottom: "20px",
        border: "3px solid #fff",
        alignSelf: "center",
    },
    text: {
        fontSize: "18px",
        marginBottom: "10px"
    },
    button: {
        backgroundColor: "#fff",
        color: "#1a1a2e",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "20px"
    }
};