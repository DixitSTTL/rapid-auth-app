"use client";
import Link from "next/link";
import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

    const response = await fetch(
      `/api/upload?filename=${Date.now()}${image.name}`,
      {
        method: 'POST',
        body: image,
      },
    );
    const newBlob = (await response.json()) || {};
    const imageFile = newBlob.url;


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
      alert("User created 🎉");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      // Reset form
      setEmail("");
      setPassword("");
      setName("");
      setImage(null);
      setImagePreview(null);
      // Redirect to login or dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } else {
      const error = await res.json();
      alert("Error creating user: " + (error.error || "Unknown error"));
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
       
        <div style={styles.profileWrapper}>
  <label style={styles.profileLabel}>
    {imagePreview ? (
      <img src={imagePreview} alt="Profile" style={styles.profileImage} />
    ) : (
      <div style={styles.profilePlaceholder}>
        Upload
      </div>
    )}

    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      style={styles.hiddenInput}
    />
  </label>
</div>

        <input
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Sign Up
        </button>

        <li>
          <text style={{ textAlign: "center", marginTop: "10px", color: "gray", }}>Already have an account? </text>
          <Link href="/login" style={{ marginTop: "10px", textAlign: "center", color: "#16213e", textDecoration: "none" }}>
            Log in
          </Link>
        </li>

      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)"
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#333"
  },
  input: {
    color: "#333",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none"
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#16213e",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s"
  },
  imagePreview: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px"
  },
  fileInput: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    cursor: "pointer"
  },
   profileWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20
  },

  profileLabel: {
    cursor: "pointer"
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #444"
  },

  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: "#222",
    color: "#aaa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed #555",
    fontSize: 14
  },

  hiddenInput: {
    display: "none"
  }
};