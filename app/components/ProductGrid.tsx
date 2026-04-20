"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  seller: string;
  desc: string;
};

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const loadProducts = async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = await res.json();
    setProducts(data.products || []);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addToCart = async (productId: string) => {
    setLoadingId(productId);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    const data = await res.json();
    setMessage(data.message || "Added.");
    setLoadingId(null);
    window.dispatchEvent(new CustomEvent("sbz-cart-updated"));
  };

  if (products.length === 0) {
    return (
      <div className="card empty-block">
        <h3 style={{ marginTop: 0 }}>No products yet</h3>
        <p className="muted" style={{ maxWidth: 520, margin: "0 auto 18px" }}>
          You selected manual product entry. Add products from <a className="link-inline" href="/admin/products">Admin Products</a> or <a className="link-inline" href="/seller/products">Seller Products</a>, then they will appear here automatically.
        </p>
        {message && <div className="notice small">{message}</div>}
      </div>
    );
  }

  return (
    <>
      {message && <div className="notice small" style={{ marginBottom: 16 }}>{message}</div>}
      <div className="grid grid-3">
        {products.map((product) => (
          <div key={product.id} className="card product-card">
            <div className="product-top">
              <span className="badge">{product.category}</span>
              <span className="small muted">★ {product.rating.toFixed(1)}</span>
            </div>
            <div className="product-name">{product.name}</div>
            <p className="muted small">{product.desc}</p>
            <p className="small muted">Seller: {product.seller}</p>
            <p className="small muted">Stock: {product.stock}</p>
            <div className="space" style={{ marginTop: 18 }}>
              <span className="price">₹{product.price}</span>
              <button className="btn" onClick={() => addToCart(product.id)} disabled={loadingId === product.id || product.stock < 1}>
                {loadingId === product.id ? "Adding..." : product.stock < 1 ? "Out of stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
