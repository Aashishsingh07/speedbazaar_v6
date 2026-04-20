"use client";

import { useState } from "react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPanel() {
  const [addressId, setAddressId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");

  const createOrder = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addressId }),
    });
    const data = await res.json();
    if (data.orderId) setOrderId(data.orderId);
    setMessage(data.message || "Order attempt completed.");
  };

  const launchRazorpay = async () => {
    if (!orderId.trim()) {
      setMessage("Create an order first.");
      return;
    }
    const res = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || "Could not start Razorpay.");
      return;
    }

    if (!window.Razorpay) {
      setMessage("Razorpay script is not available.");
      return;
    }

    const rzp = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "SpeedBazaar",
      description: `Order ${orderId}`,
      order_id: data.razorpayOrderId,
      handler: async function (response: Record<string, string>) {
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, gateway: "RAZORPAY", ...response }),
        });
        const verifyData = await verifyRes.json();
        setMessage(verifyData.message || "Payment handled.");
        if (response.razorpay_payment_id) setTransactionId(response.razorpay_payment_id);
      },
      theme: { color: "#111827" },
    });
    rzp.open();
  };

  const verifyPayment = async () => {
    if (!transactionId.trim() || !orderId.trim()) {
      setMessage("Create an order first, then enter a transaction ID.");
      return;
    }
    const res = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, transactionId, gateway: "RAZORPAY-UPI" }),
    });
    const data = await res.json();
    setMessage(data.message || "Verification complete.");
  };

  return (
    <div className="card section">
      <h3 style={{ marginTop: 0 }}>Checkout & Payment</h3>
      <p className="muted small">This version supports local demo verification and live Razorpay order creation/signature verification when keys are configured.</p>
      <div className="grid grid-2">
        <input className="input" placeholder="Saved Address ID" value={addressId} onChange={(e) => setAddressId(e.target.value)} />
        <input className="input" placeholder="Created Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn" onClick={createOrder}>Create Order</button>
        <button className="btn secondary" onClick={launchRazorpay}>Pay with Razorpay</button>
      </div>
      <div className="row" style={{ marginTop: 16 }}>
        <input className="input" placeholder="Enter transaction reference ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} style={{ flex: 1 }} />
        <button className="btn" onClick={verifyPayment}>Verify Payment</button>
      </div>
      {message && <p className="small">{message}</p>}
    </div>
  );
}
