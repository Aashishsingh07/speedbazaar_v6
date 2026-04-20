
import { NextResponse } from "next/server";
import { demoOrderTimeline } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ orderId: "SBZ-2026-001", status: "OUT_FOR_DELIVERY", timeline: demoOrderTimeline });
}
