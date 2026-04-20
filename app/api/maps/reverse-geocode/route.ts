import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json(
        { success: false, message: "lat and lng are required" },
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
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    const data = await response.json();

    if (!data.results || !data.results.length) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    const result = data.results[0];
    const components = result.address_components || [];

    const getPart = (type: string) =>
      components.find((c: any) => c.types.includes(type))?.long_name || "";

    const address = {
      fullAddress: result.formatted_address || "",
      street:
        [getPart("street_number"), getPart("route")].filter(Boolean).join(" ") || "",
      area:
        getPart("sublocality_level_1") ||
        getPart("sublocality") ||
        getPart("neighborhood") ||
        "",
      city:
        getPart("locality") ||
        getPart("administrative_area_level_2") ||
        "",
      state: getPart("administrative_area_level_1") || "",
      country: getPart("country") || "",
      pincode: getPart("postal_code") || "",
      lat,
      lng,
    };

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch address" },
      { status: 500 }
    );
  }
}
