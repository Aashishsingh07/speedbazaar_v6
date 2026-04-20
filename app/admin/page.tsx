"use client";

import { useEffect, useState } from "react";
import NavBar from "@/app/components/NavBar";

export default function AdminPage() {
  const [stats, setStats] = useState<{users:number;sellers:number;products:number;orders:number;revenue:number} | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then(async (r) => ({ ok: r.ok, data: await r.json() }))
      .then(({ ok, data }) => ok ? setStats(data.stats) : setMessage(data.message || "Access denied."));
  }, []);

  return (
    <div className="page-shell">
      <NavBar />
      <main className="auth-shell">
        <h1>Admin Dashboard</h1>
        {message ? <div className="card section-card">{message}</div> : (
          <>
            <div className="grid grid-3">
              {[['Users', stats?.users], ['Sellers', stats?.sellers], ['Products', stats?.products], ['Orders', stats?.orders], ['Revenue', `₹${stats?.revenue ?? 0}`]].map(([label, value]) => (
                <div key={String(label)} className="card section-card"><div className="small muted">{label}</div><div style={{ fontSize: 30, fontWeight: 800 }}>{value ?? '...'}</div></div>
              ))}
            </div>
            <div className="card section-card">
              <h3 style={{ marginTop: 0 }}>Admin Actions</h3>
              <div className="row">
                <a href="/admin/orders" className="btn">Manage Orders</a>
                <a href="/admin/products" className="btn secondary">Manage Products</a>
                <a href="/admin/users" className="btn secondary">Manage Users</a>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
