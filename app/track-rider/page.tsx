import NavBar from "@/app/components/NavBar";

export default function TrackRiderPage() {
  return (
    <div className="page-shell">
      <NavBar />
      <main className="auth-shell">
        <div className="card section-card">
          <h1 style={{ marginTop: 0 }}>Track Rider</h1>
          <p className="muted">Rider tracking is kept simple in this version so your homepage UI stays unchanged.</p>
          <div className="feature-list" style={{ marginTop: 20 }}>
            <div className="feature-item"><h4>Current status</h4><p className="muted small">Assigned to rider and waiting for pickup.</p></div>
            <div className="feature-item"><h4>ETA</h4><p className="muted small">Estimated delivery in 10 to 20 minutes after dispatch.</p></div>
            <div className="feature-item"><h4>Next upgrade</h4><p className="muted small">Add live map SDK later without changing the visual style.</p></div>
          </div>
        </div>
      </main>
    </div>
  );
}
