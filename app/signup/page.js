    "use client";
import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    alert("User created");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
      <input type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
      <button>Signup</button>
    </form>
  );
}