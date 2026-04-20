"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NavBar from "@/app/components/NavBar";

type CartItem = { id: string; name: string; qty: number; price: number; total: number; stock: number };

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [message, setMessage] = useState("");

  const loadCart = async () => {
    const res = await fetch("/api/cart", { cache: "no-store" });
    const data = await res.json();
    setItems(data.items || []);
    setSubtotal(data.subtotal || 0);
    window.dispatchEvent(new CustomEvent("sbz-cart-updated"));
  };

  useEffect(() => { loadCart(); }, []);

  const changeQty = async (itemId: string, qty: number) => {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity: qty }),
    });
    const data = await res.json();
    setItems(data.items || []);
    setSubtotal(data.subtotal || 0);
    setMessage(data.message || "Updated.");
    window.dispatchEvent(new CustomEvent("sbz-cart-updated"));
  };

  const removeItem = async (itemId: string) => {
    const res = await fetch(`/api/cart?itemId=${itemId}`, { method: "DELETE" });
    const data = await res.json();
    setItems(data.items || []);
    setSubtotal(data.subtotal || 0);
    setMessage(data.message || "Removed.");
    window.dispatchEvent(new CustomEvent("sbz-cart-updated"));
  };

  return (
    <div className="page-shell">
      <NavBar />
      <main className="auth-shell">
        <div className="card section-card">
          <h1 style={{ marginTop: 0 }}>Cart</h1>
          {message && <div className="notice small" style={{ marginBottom: 16 }}>{message}</div>}
          {items.length === 0 ? (
            <div>
              <p>Your cart is empty.</p>
              <Link href="/" className="btn">Continue Shopping</Link>
            </div>
          ) : (
            <>
              <table className="table">
                <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th><th></th></tr></thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        <div className="row">
                          <button className="btn secondary" onClick={() => changeQty(item.id, item.qty - 1)}>-</button>
                          <span>{item.qty}</span>
                          <button className="btn secondary" onClick={() => changeQty(item.id, Math.min(item.qty + 1, item.stock))}>+</button>
                        </div>
                      </td>
                      <td>₹{item.price}</td>
                      <td>₹{item.total}</td>
                      <td><button className="btn ghost" onClick={() => removeItem(item.id)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="space" style={{ marginTop: 16 }}>
                <div className="muted small">Proceed with checkout using the same UI theme.</div>
                <div className="price">Subtotal: ₹{subtotal}</div>
              </div>
              <div className="row" style={{ marginTop: 16 }}>
                <Link href="/checkout" className="btn">Proceed to Checkout</Link>
                <Link href="/" className="btn secondary">Add More Items</Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
