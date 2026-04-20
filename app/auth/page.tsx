"use client";

import { useEffect, useState } from "react";
import NavBar from "@/app/components/NavBar";

type Me = { authenticated: boolean; user: null | { id: string; name: string; email: string; role: string } };

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [message, setMessage] = useState("");
  const [me, setMe] = useState<Me["user"]>(null);

  const loadMe = async () => {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    const data: Me = await res.json();
    setMe(data.user);
  };

  useEffect(() => { loadMe(); }, []);

  const submit = async () => {
    const url = mode === "register" ? "/api/auth/register" : "/api/auth/login";
    const payload = mode === "register" ? { name, email, password, role } : { email, password };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setMessage(data.message || "Done.");
    await loadMe();
  };

  const logout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    const data = await res.json();
    setMessage(data.message || "Logged out.");
    await loadMe();
  };

  return (
    <div className="page-shell">
      <NavBar />
      <main className="auth-shell">
        <div className="grid grid-2">
          <div className="card section-card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h1 style={{ margin: 0 }}>{mode === "register" ? "Create account" : "Login"}</h1>
              <div className="row">
                <button className={`btn ${mode === "register" ? "" : "secondary"}`} onClick={() => setMode("register")}>Register</button>
                <button className={`btn ${mode === "login" ? "" : "secondary"}`} onClick={() => setMode("login")}>Login</button>
              </div>
            </div>
            <p className="muted">Use USER for shoppers, SELLER for manual product entry, or ADMIN for admin pages.</p>
            <div className="grid">
              {mode === "register" && <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />}
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              {mode === "register" && (
                <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="USER">User</option>
                  <option value="SELLER">Seller</option>
                  <option value="ADMIN">Admin</option>
                </select>
              )}
            </div>
            <div className="row" style={{ marginTop: 16 }}>
              <button className="btn" onClick={submit}>{mode === "register" ? "Create Account" : "Login"}</button>
              <button className="btn secondary" onClick={logout}>Logout</button>
            </div>
            {message && <div className="notice small" style={{ marginTop: 16 }}>{message}</div>}
          </div>
          <div className="card section-card">
            <h3 style={{ marginTop: 0 }}>Current session</h3>
            {me ? (
              <div>
                <p><strong>Name:</strong> {me.name}</p>
                <p><strong>Email:</strong> {me.email}</p>
                <p><strong>Role:</strong> {me.role}</p>
              </div>
            ) : <p className="muted">No active session.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
