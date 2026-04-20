import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const requestedRole = String(body.role || "user").trim().toLowerCase();
    const mainAdmin = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();

    if (email === mainAdmin) {
      return NextResponse.json(
        { success: false, message: "This admin account already exists" },
        { status: 403 }
      );
    }

    if (requestedRole === "admin") {
      return NextResponse.json(
        { success: false, message: "Admin registration is not allowed" },
        { status: 403 }
      );
    }

    if (requestedRole === "seller") {
      return NextResponse.json(
        {
          success: false,
          message: "Seller cannot self-verify. Only admin can approve sellers.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User registration allowed as normal user only",
      role: "user",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
