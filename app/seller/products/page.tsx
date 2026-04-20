"use client";

import { useEffect, useState } from "react";
import NavBar from "@/app/components/NavBar";

type Product = { id: string; name: string; category: string; price: number; stock: number };

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", category: "General", description: "", price: "", stock: "" });
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = await res.json();
    setProducts(data.products || []);
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }),
    });
    const data = await res.json();
    setMessage(data.message || "Done.");
    if (res.ok) {
      setForm({ name: "", category: "General", description: "", price: "", stock: "" });
      load();
    }
  };

  return (
    <div className="page-shell">
      <NavBar />
      <main className="auth-shell">
        <h1>Seller Products</h1>
        <div className="grid grid-2">
          <div className="card section-card">
            <h3 style={{ marginTop: 0 }}>Add Product</h3>
            <div className="grid">
              <input className="input" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <textarea className="textarea" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-2">
                <input className="input" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <input className="input" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <button className="btn" onClick={submit}>Create Product</button>
              {message && <div className="notice small">{message}</div>}
            </div>
          </div>
          <div className="card section-card">
            <h3 style={{ marginTop: 0 }}>Product List</h3>
            <table className="table">
              <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id}><td>{item.name}</td><td>{item.category}</td><td>₹{item.price}</td><td>{item.stock}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
