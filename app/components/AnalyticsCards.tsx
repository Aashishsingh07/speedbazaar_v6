
import { demoStats } from "@/lib/data";

const items = [
  ["Revenue", `₹${demoStats.revenue.toLocaleString()}`],
  ["Orders", String(demoStats.orders)],
  ["Users", String(demoStats.users)],
  ["Sellers", String(demoStats.sellers)],
  ["Pending Orders", String(demoStats.pendingOrders)],
  ["Payment Success", `${demoStats.paymentSuccessRate}%`],
];

export default function AnalyticsCards() {
  return (
    <div className="grid grid-3">
      {items.map(([label, value]) => (
        <div key={label} className="card stat">
          <div className="small muted">{label}</div>
          <div style={{ fontSize: 30, fontWeight: 800 }}>{value}</div>
        </div>
      ))}
    </div>
  );
}
