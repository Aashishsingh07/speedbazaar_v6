"use client";

import { PackageCheck, ShieldCheck, Store, Truck } from "lucide-react";
import { useState } from "react";
import AddressForm from "./components/AddressForm";
import LocationPicker from "./components/LocationPicker";
import NavBar from "./components/NavBar";
import ProductGrid from "./components/ProductGrid";

export default function HomePage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <div className="page-shell">
      <NavBar />
      <main className="container">
        <section className="card hero-banner">
          <div>
            <h1 className="hero-title">Everything you need, delivered at SpeedBazaar speed.</h1>
            <p className="hero-copy">
              Multi-seller quick-commerce starter with riders, live tracking, moderation,
              payouts, and OTP flows.
            </p>
          </div>
        </section>

        <h2 className="section-title">Popular Products</h2>
        <ProductGrid />

        <div id="location-panel" className="info-strip">
          <div className="card info-box">
            <LocationPicker onChange={setCoords} />
          </div>
          <div className="card info-box">
            <h3>Track Order</h3>
            <p className="muted">Open your latest order timeline and payment status without changing this homepage UI.</p>
            <a href="/orders" className="btn">Open Orders</a>
          </div>
          <div className="card info-box">
            <h3>Admin Product Entry</h3>
            <p className="muted">You selected manual product entry. Add products from admin or seller panel, then they appear here automatically.</p>
            <div className="row">
              <a href="/admin/products" className="btn secondary">Admin Products</a>
              <a href="/seller/products" className="btn secondary">Seller Products</a>
            </div>
          </div>
        </div>

        <div className="card section-card">
          <h2 className="section-title" style={{ marginTop: 0 }}>Save Delivery Address</h2>
          <AddressForm coords={coords} />
        </div>

        <div className="section-title">More options</div>
        <div className="feature-list">
          <div className="feature-item">
            <Store size={22} />
            <h4>Seller panel</h4>
            <p className="muted small">Create products manually and manage your catalog from the existing backend pages.</p>
          </div>
          <div className="feature-item">
            <PackageCheck size={22} />
            <h4>Checkout flow</h4>
            <p className="muted small">Cart, address selection, order creation, and payment verification are connected.</p>
          </div>
          <div className="feature-item">
            <Truck size={22} />
            <h4>Rider tracking</h4>
            <p className="muted small">Use the tracking pages without replacing the current frontend style you want to keep.</p>
          </div>
          <div className="feature-item">
            <ShieldCheck size={22} />
            <h4>Login and roles</h4>
            <p className="muted small">Register as user, seller, or admin and use the same UI while features run in the background.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
