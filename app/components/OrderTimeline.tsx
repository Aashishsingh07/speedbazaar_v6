
import { demoOrderTimeline } from "@/lib/data";

export default function OrderTimeline() {
  return (
    <div className="card section">
      <h3 style={{ marginTop: 0 }}>Live Order Tracking UI</h3>
      <div className="timeline">
        {demoOrderTimeline.map((item) => (
          <div className="timelineItem" key={item.label}>
            <div className={`dot ${item.done ? "done" : ""}`} />
            <div>
              <div>{item.label}</div>
              <div className="small muted">{item.done ? "Completed" : "Pending next action"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
