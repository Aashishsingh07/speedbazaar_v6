"use client";

import Link from "next/link";
import { MapPin, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

type MeResponse = { authenticated: boolean; user: null | { name: string } };

declare global {
  interface WindowEventMap {
    "sbz-cart-updated": CustomEvent<{ count?: number }>;
  }
}

export default function NavBar() {
  const [cartCount, setCartCount] = useState(0);
  const [authLabel, setAuthLabel] = useState("Login");

  const loadCart = async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const data = await res.json();
      const count = (data.items || []).reduce((sum: number, item: { qty: number }) => sum + item.qty, 0);
      setCartCount(count);
    } catch {}
  };

  const loadAuth = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data: MeResponse = await res.json();
      setAuthLabel(data.authenticated ? "Account" : "Login");
    } catch {}
  };

  useEffect(() => {
    loadCart();
    loadAuth();
    const handler = () => loadCart();
    window.addEventListener("sbz-cart-updated", handler as EventListener);
    return () => window.removeEventListener("sbz-cart-updated", handler as EventListener);
  }, []);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">s</span>
          <span>
            <p className="brand-title">SpeedBazaar</p>
            <p className="brand-subtitle">⌘ Delivery in 10 minutes</p>
          </span>
        </Link>

        <nav className="header-nav">
          <a className="top-link" href="#location-panel"><MapPin size={18} />Deliver to your location</a>
          <Link className="top-link" href="/track-order">Track Order</Link>
          <Link className="top-link" href="/track-rider">Track Rider</Link>
          <Link className="top-link" href="/auth">{authLabel}</Link>
          <Link href="/cart" className="cart-pill"><ShoppingCart size={20} />Cart ({cartCount})</Link>
        </nav>
      </div>
    </header>
  );
}
