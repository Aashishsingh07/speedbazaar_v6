"use client";

import { useEffect, useState } from "react";
import NavBar from "@/app/components/NavBar";

export default function SellerPage() {
  const [stats, setStats] = useState<{products:number; inventoryLogs:number; storeName:string} | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/seller/stats", { cache: "no-store" })
      .then(async (r) => ({ ok: r.ok, data: await r.json() }))
      .then(({ ok, data }) => ok ? setStats(data.stats) : setMessage(data.message || "Access denied."));
  }, []);

  return (
    <div className="page-shell">
      <NavBar />
      <main className="auth-shell">
        <h1>Seller Dashboard</h1>
        {message ? <div className="card section-card">{message}</div> : (
          <>
            <div className="grid grid-3">
              <div className="card section-card"><div className="small muted">Store Name</div><div style={{ fontSize: 28, fontWeight: 800 }}>{stats?.storeName || '...'}</div></div>
              <div className="card section-card"><div className="small muted">Active Products</div><div style={{ fontSize: 28, fontWeight: 800 }}>{stats?.products ?? '...'}</div></div>
              <div className="card section-card"><div className="small muted">Inventory Logs</div><div style={{ fontSize: 28, fontWeight: 800 }}>{stats?.inventoryLogs ?? '...'}</div></div>
            </div>
            <div className="card section-card">
              <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
              <div className="row">
                <a className="btn" href="/seller/products">Manage Products</a>
                <a className="btn secondary" href="/orders">See Orders</a>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
