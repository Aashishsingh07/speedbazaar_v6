import { NextResponse } from "next/server";
import { buildCloudinarySignature } from "@/lib/integrations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const timestamp = Number(body.timestamp || Math.floor(Date.now() / 1000));
    const folder = String(body.folder || "speedbazaar/products");

    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!apiKey || !cloudName) {
      return NextResponse.json({ message: "Cloudinary is not configured." }, { status: 400 });
    }

    const signature = buildCloudinarySignature({ timestamp, folder });
    return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not sign upload." }, { status: 500 });
  }
}
