import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = String(searchParams.get("input") || "").trim();
  const key = process.env.GOOGLE_MAPS_API_KEY;

  if (!input) return NextResponse.json({ predictions: [] });
  if (!key) return NextResponse.json({ message: "GOOGLE_MAPS_API_KEY is missing.", predictions: [] }, { status: 400 });

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&components=country:in&key=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json({ predictions: data.predictions || [], status: data.status }, { status: res.ok ? 200 : 500 });
}
