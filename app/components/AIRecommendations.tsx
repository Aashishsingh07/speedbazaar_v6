
"use client";

import { useState } from "react";

export default function AIRecommendations() {
  const [result, setResult] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    setLoading(true);
    const res = await fetch("/api/ai/recommend", { method: "POST" });
    const data = await res.json();
    setResult(data.recommendations || []);
    setLoading(false);
  };

  return (
    <div className="card section">
      <div className="space">
        <div>
          <h3 style={{ marginTop: 0 }}>AI Recommendations</h3>
          <p className="muted small">Starter API for future recommendation logic based on views, cart, and order history.</p>
        </div>
        <button className="btn" onClick={getRecommendations}>{loading ? "Loading..." : "Get AI Picks"}</button>
      </div>
      {result.length > 0 && (
        <div className="row">
          {result.map((item) => <div key={item} className="badge">{item}</div>)}
        </div>
      )}
    </div>
  );
}
