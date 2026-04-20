"use client";

import { MapPin, Navigation } from "lucide-react";
import { useState } from "react";

type Coords = { lat: number; lng: number } | null;

export default function LocationPicker({ onChange }: { onChange: (value: Coords) => void }) {
  const [coords, setCoords] = useState<Coords>(null);
  const [status, setStatus] = useState("Tap the button to use your current location.");
  const [address, setAddress] = useState("");

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser.");
      return;
    }
    setStatus("Fetching your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCoords(next);
        onChange(next);
        setStatus("Location captured successfully.");
      },
      () => setStatus("Location failed. Allow permission or enter address manually below."),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const resolveAddress = async () => {
    if (!coords) return;
    const res = await fetch(`/api/maps/reverse-geocode?lat=${coords.lat}&lng=${coords.lng}`);
    const data = await res.json();
    setAddress(data.formattedAddress || data.message || "No address found.");
  };

  return (
    <div>
      <h3 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: 8 }}><MapPin size={18} />Deliver to your location</h3>
      <p className="muted small">Use GPS now, or save your address manually in the same frontend below.</p>
      <div className="row" style={{ marginTop: 14 }}>
        <button className="btn" onClick={getLocation}><Navigation size={16} style={{ marginRight: 8 }} />Use Current Location</button>
        <button className="btn secondary" onClick={resolveAddress} disabled={!coords}>Get Address</button>
      </div>
      <p className="small muted" style={{ marginTop: 14 }}>{status}</p>
      {coords && <div className="notice small">Lat: {coords.lat.toFixed(6)} | Lng: {coords.lng.toFixed(6)}</div>}
      {address && <p className="small" style={{ marginTop: 12 }}>{address}</p>}
    </div>
  );
}
