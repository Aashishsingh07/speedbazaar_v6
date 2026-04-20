import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const required = ["fullName", "phone", "line1", "city", "state", "pincode"];
    for (const key of required) {
      if (!body[key]) return NextResponse.json({ message: `${key} is required.` }, { status: 400 });
    }
    if (!/^\d{10}$/.test(body.phone)) return NextResponse.json({ message: "Phone must be 10 digits." }, { status: 400 });
    if (!/^\d{6}$/.test(body.pincode)) return NextResponse.json({ message: "Pincode must be 6 digits." }, { status: 400 });

    const user = await getCurrentUser();
    const address = await prisma.address.create({
      data: {
        userId: user?.id ?? null,
        fullName: String(body.fullName).trim(),
        phone: String(body.phone).trim(),
        line1: String(body.line1).trim(),
        line2: body.line2 ? String(body.line2).trim() : null,
        landmark: body.landmark ? String(body.landmark).trim() : null,
        city: String(body.city).trim(),
        state: String(body.state).trim(),
        pincode: String(body.pincode).trim(),
        type: body.addressType ? String(body.addressType).trim() : "HOME",
        latitude: typeof body.latitude === "number" ? body.latitude : null,
        longitude: typeof body.longitude === "number" ? body.longitude : null,
        isDefault: Boolean(body.isDefault),
      },
    });

    return NextResponse.json({ message: "Address saved successfully.", saved: true, addressId: address.id });
  } catch (error) {
    return NextResponse.json({ message: "Invalid request.", error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
