
"use client";

import { useMemo, useState } from "react";

type Coords = { lat: number; lng: number } | null;

const emptyForm = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  addressType: "HOME",
};

export default function AddressForm({ coords }: { coords: Coords }) {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const valid = useMemo(() => (
    form.fullName.trim().length >= 2 &&
    /^\d{10}$/.test(form.phone) &&
    form.line1.trim().length >= 5 &&
    form.city.trim().length >= 2 &&
    form.state.trim().length >= 2 &&
    /^\d{6}$/.test(form.pincode)
  ), [form]);

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const saveAddress = async () => {
    if (!valid) {
      setMessage("Fill all required fields correctly before saving.");
      return;
    }
    const res = await fetch("/api/save-address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, latitude: coords?.lat ?? null, longitude: coords?.lng ?? null }),
    });
    const data = await res.json();
    setMessage(data.message || "Address saved.");
  };

  return (
    <div className="card section">
      <div className="space">
        <div>
          <h3 style={{ marginTop: 0 }}>Delivery Address</h3>
          <p className="muted small">Manual entry + pincode validation + lat/lng support.</p>
        </div>
        <div className="badge">Map-ready</div>
      </div>
      <div className="grid grid-2">
        <input className="input" placeholder="Full Name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
        <input className="input" placeholder="Phone (10 digits)" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        <input className="input" placeholder="House / Flat / Street" value={form.line1} onChange={(e) => update("line1", e.target.value)} />
        <input className="input" placeholder="Area / Locality" value={form.line2} onChange={(e) => update("line2", e.target.value)} />
        <input className="input" placeholder="Landmark" value={form.landmark} onChange={(e) => update("landmark", e.target.value)} />
        <select className="select" value={form.addressType} onChange={(e) => update("addressType", e.target.value)}>
          <option value="HOME">Home</option>
          <option value="WORK">Work</option>
          <option value="OTHER">Other</option>
        </select>
        <input className="input" placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
        <input className="input" placeholder="State" value={form.state} onChange={(e) => update("state", e.target.value)} />
        <input className="input" placeholder="Pincode (6 digits)" value={form.pincode} onChange={(e) => update("pincode", e.target.value)} />
      </div>
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn" onClick={saveAddress}>Save Address</button>
        <div className="badge">{valid ? "Address looks valid" : "Address incomplete"}</div>
      </div>
      {message && <p className="small">{message}</p>}
    </div>
  );
}
