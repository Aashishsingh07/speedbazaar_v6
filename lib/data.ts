
export const demoProducts = [
  { id: "p1", name: "Noise Cancelling Headphones", slug: "noise-cancelling-headphones", category: "Electronics", price: 3499, stock: 12, rating: 4.6, seller: "SoundNest", desc: "Premium over-ear wireless headphones with deep bass." },
  { id: "p2", name: "Smart Fitness Watch", slug: "smart-fitness-watch", category: "Wearables", price: 2299, stock: 24, rating: 4.3, seller: "FitPulse", desc: "Heart rate, sleep tracking and long battery life." },
  { id: "p3", name: "Portable Bluetooth Speaker", slug: "portable-bluetooth-speaker", category: "Audio", price: 1499, stock: 30, rating: 4.4, seller: "BeatBox", desc: "Water-resistant speaker for everyday music and travel." },
  { id: "p4", name: "Fast Charger 65W", slug: "fast-charger-65w", category: "Accessories", price: 999, stock: 45, rating: 4.5, seller: "ChargePro", desc: "Multi-device Type-C charger with compact build." },
  { id: "p5", name: "Laptop Sleeve 15 inch", slug: "laptop-sleeve-15-inch", category: "Accessories", price: 699, stock: 50, rating: 4.1, seller: "CarryMore", desc: "Protective water-resistant sleeve with soft lining." },
  { id: "p6", name: "Mechanical Keyboard", slug: "mechanical-keyboard", category: "Computers", price: 2799, stock: 10, rating: 4.7, seller: "KeyForge", desc: "RGB keyboard with tactile switches for work and gaming." },
];

export const demoStats = {
  revenue: 142560,
  orders: 284,
  users: 118,
  sellers: 14,
  pendingOrders: 17,
  paymentSuccessRate: 94.8,
};

export const demoOrderTimeline = [
  { label: "Order Placed", done: true },
  { label: "Payment Confirmed", done: true },
  { label: "Packed", done: true },
  { label: "Out for Delivery", done: false },
  { label: "Delivered", done: false },
];
