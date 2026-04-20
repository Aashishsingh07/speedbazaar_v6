"use client";

import { useEffect, useState } from "react";
import NavBar from "@/app/components/NavBar";

type Address = { id: string; fullName: string; line1: string; city: string; state: string; pincode: string; type: string };
type CartItem = { id: string; name: string; qty: number; total: number };

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const load = async () => {
    const [aRes, cRes] = await Promise.all([
      fetch("/api/addresses", { cache: "no-store" }),
      fetch("/api/cart", { cache: "no-store" }),
    ]);
    const aData = await aRes.json();
    const cData = await cRes.json();
    setAddresses(aData.addresses || []);
    setSelectedAddressId((aData.addresses || [])[0]?.id || "");
    setItems(cData.items || []);
    setSubtotal(cData.subtotal || 0);
  };

  useEffect(() => { load(); }, []);

  const createOrder = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addressId: selectedAddressId }),
    });
    const data = await res.json();
    if (data.orderId) setOrderId(data.orderId);
    setMessage(data.message || "Order attempt finished.");
    window.dispatchEvent(new CustomEvent("sbz-cart-updated"));
  };

  const verifyPayment = async () => {
    const res = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, transactionId, gateway: "RAZORPAY-UPI" }),
    });
    const data = await res.json();
    setMessage(data.message || "Payment checked.");
  };

  return (
    <div className="page-shell">
      <NavBar />
      <main className="auth-shell">
        <div className="grid grid-2">
          <div className="card section-card">
            <h1 style={{ marginTop: 0 }}>Checkout</h1>
            <h3>Choose Saved Address</h3>
            {addresses.length === 0 ? <p className="small muted">No saved address yet. Save one on the home page first.</p> : (
              <div className="grid">
                {addresses.map((address) => (
                  <label key={address.id} className="card" style={{ padding: 14, border: selectedAddressId === address.id ? "1px solid #8cf400" : undefined }}>
                    <div className="row">
                      <input type="radio" checked={selectedAddressId === address.id} onChange={() => setSelectedAddressId(address.id)} />
                      <strong>{address.fullName}</strong>
                      <span className="badge">{address.type}</span>
                    </div>
                    <p className="small muted">{address.line1}, {address.city}, {address.state} - {address.pincode}</p>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="card section-card">
            <h3 style={{ marginTop: 0 }}>Order Summary</h3>
            {items.length === 0 ? <p className="small muted">Your cart is empty.</p> : items.map((item) => (
              <div key={item.id} className="space" style={{ marginBottom: 10 }}>
                <div>{item.name} × {item.qty}</div>
                <div>₹{item.total}</div>
              </div>
            ))}
            <hr style={{ borderColor: "#e5e7eb" }} />
            <div className="space"><span>Subtotal</span><strong>₹{subtotal}</strong></div>
            <div className="space"><span>Delivery</span><strong>{subtotal >= 999 ? "Free" : "₹49"}</strong></div>
            <div className="space" style={{ marginTop: 8 }}><span>Total</span><span className="price">₹{subtotal >= 999 ? subtotal : subtotal + 49}</span></div>
            <div className="row" style={{ marginTop: 16 }}>
              <button className="btn" onClick={createOrder} disabled={!selectedAddressId || items.length === 0}>Create Order</button>
            </div>
            {orderId && (
              <div style={{ marginTop: 18 }}>
                <p className="small muted">Order ID: {orderId}</p>
                <input className="input" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Transaction reference" />
                <div className="row" style={{ marginTop: 12 }}>
                  <button className="btn secondary" onClick={verifyPayment} disabled={!transactionId}>Verify Payment</button>
                </div>
              </div>
            )}
            {message && <div className="notice small" style={{ marginTop: 16 }}>{message}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
