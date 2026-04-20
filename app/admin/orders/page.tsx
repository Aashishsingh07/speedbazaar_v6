import NavBar from "@/app/components/NavBar";

const rows = [
  ["SBZ-2026-001", "Demo User", "₹3499", "PAID", "PACKED"],
  ["SBZ-2026-002", "Aman", "₹2299", "UNPAID", "PENDING"],
  ["SBZ-2026-003", "Riya", "₹1499", "PAID", "OUT_FOR_DELIVERY"],
];

export default function AdminOrdersPage() {
  return (
    <div className="page-shell">
      <NavBar />
      <main className="auth-shell">
        <div className="card section-card">
          <h1 style={{ marginTop: 0 }}>Admin Orders</h1>
          <table className="table">
            <thead><tr><th>Order ID</th><th>User</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c) => <td key={c}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
