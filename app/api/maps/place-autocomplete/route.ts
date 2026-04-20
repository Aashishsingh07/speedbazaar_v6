import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const input = searchParams.get("input");

    if (!input) {
      return NextResponse.json(
        { success: false, message: "input is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "Missing GOOGLE_MAPS_API_KEY" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&components=country:in&key=${apiKey}`
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      predictions: data.predictions || [],
    });
  } catch (error) {
    console.error("Autocomplete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
