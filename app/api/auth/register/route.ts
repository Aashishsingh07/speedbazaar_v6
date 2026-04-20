import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const role = ["USER", "SELLER", "ADMIN"].includes(body.role) ? body.role : "USER";

    if (name.length < 2) return NextResponse.json({ message: "Name must be at least 2 characters." }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ message: "Enter a valid email." }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ message: "Password must be at least 6 characters." }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ message: "Email already exists." }, { status: 409 });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        role,
        ...(role === "SELLER" ? { seller: { create: { storeName: `${name}'s Store`, isApproved: false } } } : {}),
      },
    });

    await createSession(user.id);

    return NextResponse.json({ ok: true, message: "Account created successfully.", user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    return NextResponse.json({ message: "Could not create account.", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
