
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim();
    const role = String(body.role || "USER").trim();
    if (!email) return NextResponse.json({ message: "Email is required." }, { status: 400 });
    return NextResponse.json({ ok: true, message: `Demo login success for ${email} as ${role}. Replace this route with real auth.` });
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }
}
