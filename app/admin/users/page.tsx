import NavBar from "@/app/components/NavBar";

const users = [
  ["Demo User", "demo@speedbazaar.test", "USER"],
  ["Seller One", "seller@speedbazaar.test", "SELLER"],
  ["Admin", "admin@speedbazaar.test", "ADMIN"],
];

export default function AdminUsersPage() {
  return (
    <div className="page-shell">
      <NavBar />
      <main className="auth-shell">
        <div className="card section-card">
          <h1 style={{ marginTop: 0 }}>Admin Users</h1>
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>{users.map((u) => <tr key={u[1]}>{u.map((c) => <td key={c}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
