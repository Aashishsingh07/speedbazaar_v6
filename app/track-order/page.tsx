"use client";

import { useEffect, useState } from "react";
import NavBar from "@/app/components/NavBar";

type Step = { label: string; done: boolean };

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const [timeline, setTimeline] = useState<Step[]>([]);

  useEffect(() => {
    fetch("/api/track-order", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setOrderId(data.orderId || "");
        setStatus(data.status || "");
        setTimeline(data.timeline || []);
      });
  }, []);

  return (
    <div className="page-shell">
      <NavBar />
      <main className="auth-shell">
        <div className="card section-card">
          <h1 style={{ marginTop: 0 }}>Track Order</h1>
          <p className="muted">Order reference: {orderId || "Not available"}</p>
          <div className="badge">{status || "Pending"}</div>
          <div className="timeline" style={{ marginTop: 24 }}>
            {timeline.map((step) => (
              <div key={step.label} className="timelineItem">
                <div className={`dot ${step.done ? "done" : ""}`} />
                <div>
                  <div>{step.label}</div>
                  <div className="small muted">{step.done ? "Completed" : "Waiting"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
