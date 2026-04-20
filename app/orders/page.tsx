"use client";

import { useEffect, useState } from "react";
import NavBar from "@/app/components/NavBar";

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  total: number;
  address: string | null;
  items: { name: string; quantity: number; total: number }[];
  timeline: { label: string; done: boolean }[];
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders", { cache: "no-store" }).then((r) => r.json()).then((data) => setOrders(data.orders || []));
  }, []);

  return (
    <div className="page-shell">
      <NavBar />
      <main className="auth-shell">
        <h1>Orders</h1>
        {orders.length === 0 ? (
          <div className="card section-card"><p>No orders yet. Create one from checkout.</p></div>
        ) : orders.map((order) => (
          <div key={order.id} className="card section-card" style={{ marginBottom: 18 }}>
            <div className="space">
              <div>
                <h3 style={{ marginTop: 0, marginBottom: 4 }}>Order {order.id.slice(-8).toUpperCase()}</h3>
                <p className="small muted">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <div className="badge">{order.status}</div>
                <p className="small">Payment: {order.paymentStatus}</p>
              </div>
            </div>
            <p className="small muted">Address: {order.address || "Not available"}</p>
            <ul>
              {order.items.map((item) => <li key={item.name}>{item.name} × {item.quantity} — ₹{item.total}</li>)}
            </ul>
            <div className="timeline">
              {order.timeline.map((step) => (
                <div key={step.label} className="timelineItem">
                  <div className={`dot ${step.done ? "done" : ""}`} />
                  <div>
                    <div>{step.label}</div>
                    <div className="small muted">{step.done ? "Completed" : "Pending"}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="price" style={{ marginTop: 12 }}>₹{order.total}</div>
          </div>
        ))}
      </main>
    </div>
  );
}
