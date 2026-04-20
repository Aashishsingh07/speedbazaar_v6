import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) return NextResponse.json({ message: "Email and password are required." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({ ok: true, message: "Login successful.", user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    return NextResponse.json({ message: "Could not log in.", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
