import { NextResponse } from "next/server";
import { setSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { success: false, message: "Admin credentials are not configured" },
        { status: 500 }
      );
    }

    if (
      String(email || "").trim().toLowerCase() === adminEmail &&
      String(password || "") === adminPassword
    ) {
      await setSession({
        email: adminEmail,
        role: "admin",
      });

      return NextResponse.json({
        success: true,
        user: {
          email: adminEmail,
          role: "admin",
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid credentials",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
