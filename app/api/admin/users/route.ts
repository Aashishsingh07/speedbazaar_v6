import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";

let admins = [String(process.env.ADMIN_EMAIL || "").trim().toLowerCase()].filter(Boolean);
let verifiedSellers: string[] = [];

export async function GET() {
  try {
    await requireAdmin();

    return NextResponse.json({
      success: true,
      admins,
      verifiedSellers,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const action = String(body.action || "");
    const email = String(body.email || "").trim().toLowerCase();
    const mainAdmin = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    if (action === "add_admin") {
      if (!admins.includes(email)) admins.push(email);
      return NextResponse.json({ success: true, admins });
    }

    if (action === "delete_admin") {
      if (email === mainAdmin) {
        return NextResponse.json(
          { success: false, message: "Main admin cannot be deleted" },
          { status: 403 }
        );
      }

      admins = admins.filter((a) => a !== email);
      return NextResponse.json({ success: true, admins });
    }

    if (action === "verify_seller") {
      if (!verifiedSellers.includes(email)) verifiedSellers.push(email);
      return NextResponse.json({ success: true, verifiedSellers });
    }

    if (action === "unverify_seller") {
      verifiedSellers = verifiedSellers.filter((s) => s !== email);
      return NextResponse.json({ success: true, verifiedSellers });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}
