export default async function Dashboard() {
    const products = await fetchProducts();

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome to your Dashboard!</h1>
            <p style={styles.text}>This is a protected page. Only logged in users can see this.</p>
            
            <h2 style={styles.subtitle}>Products</h2>
            {products.length === 0 ? (
                <p style={styles.noData}>No products available.</p>
            ) : (
                <div style={styles.productRow}>
                    {products.map(product => (
                        <div key={product._id} style={styles.productCard}>
                            {product.image && <img src={product.image} alt={product.name} style={styles.productImage} />}
                            <h3 style={styles.productName}>{product.name}</h3>
                            <p style={styles.productPrice}>${product.price}</p>
                            {product.description && <p st       yle={styles.productDescription}>{product.description}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

async function fetchProducts() {
    try {
        const res = await fetch('http://localhost:3000/api/products', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        return await res.json();
    } catch (error) {
        console.error(error);
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
        background: "linear-gradient(135deg, #667eea, #764ba2)",
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
    productRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        width: "100%",
        maxWidth: "1200px"
    },
    productCard: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "20px",
        borderRadius: "12px",
        color: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "250px",
        textAlign: "center",
        transition: "transform 0.2s"
    },
    productImage: {
        width: "100%",
        height: "150px",
        objectFit: "cover",
        borderRadius: "8px",
        marginBottom: "10px"
    },
    productName: {
        fontSize: "20px",
        marginBottom: "10px"
    },
    productPrice: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "10px"
    },
    productDescription: {
        fontSize: "14px",
        color: "rgba(255, 255, 255, 0.8)"
    },
    noData: {
        color: "#fff",
        fontSize: "16px",
        fontStyle: "italic"
    }
}