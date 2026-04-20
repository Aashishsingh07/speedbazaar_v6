
import { NextResponse } from "next/server";
import { demoProducts } from "@/lib/data";

export async function POST() {
  const recommendations = demoProducts.slice(0, 4).map((p) => p.name);
  return NextResponse.json({ source: "placeholder", recommendations, message: "Connect this route to user behavior, vector search, or your model later." });
}
