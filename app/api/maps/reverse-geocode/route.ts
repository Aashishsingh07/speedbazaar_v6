import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const key = process.env.GOOGLE_MAPS_API_KEY;

  if (!lat || !lng) return NextResponse.json({ message: "lat and lng are required." }, { status: 400 });
  if (!key) return NextResponse.json({ message: "GOOGLE_MAPS_API_KEY is missing." }, { status: 400 });

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(`${lat},${lng}`)}&key=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json({
    ok: res.ok,
    status: data.status,
    formattedAddress: data.results?.[0]?.formatted_address || null,
    raw: data,
  }, { status: res.ok ? 200 : 500 });
}
