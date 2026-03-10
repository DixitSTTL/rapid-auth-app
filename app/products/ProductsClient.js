// "use client";
// import { useState } from "react";
// import { useEffect } from "react";
// import { useSearchParams } from "next/navigation";

// export default function ProductsClient() {
//   const searchParams = useSearchParams();
//   const categoryKey = searchParams.get("category");
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       if (!categoryKey) return;

//       const data = await fetchProducts(categoryKey);
//       setProducts(data);
//     }

//     fetchData();
//   }, [categoryKey]);

"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryKey = searchParams.get("category");
  const [products, setProducts] = useState([]);
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
    async function fetchData() {
      if (!categoryKey) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchProducts(categoryKey);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryKey]);

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
            Products
          </h1>
          {categoryKey && (
            <p style={styles.subtitle}>Category: {categoryKey}</p>
          )}
        </div>

        <div style={styles.navigation}>
          <button
            onClick={() => router.push('/dashboard')}
            style={styles.backButton}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            ← Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading products...</p>
          </div>
        ) : !categoryKey ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>Products</div>
            <p style={styles.noData}>No category selected</p>
            <p style={styles.emptySubtext}>Choose a category from the dashboard</p>
            <button
              onClick={() => router.push('/dashboard')}
              style={styles.primaryButton}
            >
              Go to Dashboard
            </button>
          </div>
        ) : products.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>No Products</div>
            <p style={styles.noData}>No products available for category: {categoryKey}</p>
            <p style={styles.emptySubtext}>Check back later for new products!</p>
          </div>
        ) : (
          <div style={styles.productRow}>
            {products.map((product, index) => (
              <div
                key={product._id}
                style={{
                  ...styles.productCard,
                  animationDelay: `${index * 0.1}s`
                }}
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
                {product.image && (
                  <div style={styles.imageContainer}>
                    <img src={product.image} alt={product.name} style={styles.productImage} />
                  </div>
                )}
                <div style={styles.cardContent}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.productPrice}>${product.price}</p>
                  {product.description && (
                    <p style={styles.productDescription}>{product.description}</p>
                  )}
                </div>
                <div style={styles.cardOverlay}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

async function fetchProducts(categoryKey) {
    try {
        const response = await fetch(`/api/products?category=${encodeURIComponent(categoryKey)}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Failed to fetch products:', error);
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
    alignItems: "flex-start",
    padding: "40px 20px",
    boxSizing: "border-box"
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
    maxWidth: "1200px",
    textAlign: "center",
    margin: "0 auto"
  },
  header: {
    marginBottom: "30px",
    padding: "0 20px"
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
    fontSize: "18px",
    margin: 0,
    fontWeight: "300"
  },
  navigation: {
    marginBottom: "40px",
    padding: "0 20px"
  },
  backButton: {
    background: "#fff",
    color: "#333",
    border: "2px solid #ddd",
    padding: "12px 24px",
    borderRadius: "50px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    transform: "translateY(0)"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%"
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
    border: "1px solid #ddd",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box"
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
    fontWeight: "300",
    marginBottom: "20px"
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
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
  },
  productRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px"
  },
  productCard: {
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
    height: "200px"
  },
  productImage: {
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
  productName: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "10px",
    transition: "color 0.3s ease"
  },
  productPrice: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#007bff",
    marginBottom: "10px"
  },
  productDescription: {
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
    background: "rgba(0,123,255,0.05)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    pointerEvents: "none"
  }
};