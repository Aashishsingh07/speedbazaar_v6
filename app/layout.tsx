
import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "SpeedBazaar V6",
  description: "Marketplace V6 scaffold with real local auth, cart wiring, seeded products, checkout, seller tools, admin stats, tracking, and AI/payment placeholders."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}  <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
