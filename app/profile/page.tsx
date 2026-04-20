import NavBar from "@/app/components/NavBar";

export default function ProfilePage() {
  return (
    <div className="page-shell">
      <NavBar />
      <main className="auth-shell">
        <div className="grid grid-2">
          <div className="card section-card">
            <h1 style={{ marginTop: 0 }}>User Profile</h1>
            <p>Name: Demo User</p>
            <p>Email: demo@speedbazaar.test</p>
            <p>Phone: 9999999999</p>
          </div>
          <div className="card section-card">
            <h3 style={{ marginTop: 0 }}>Saved Preferences</h3>
            <p>Language: English</p>
            <p>Default Payment: UPI</p>
            <p>Default Address: Home</p>
          </div>
        </div>
      </main>
    </div>
  );
}
