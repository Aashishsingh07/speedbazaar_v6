import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone || "").trim();
    if (!phone) return NextResponse.json({ message: "phone is required." }, { status: 400 });

    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
    if (!sid || !token || !serviceSid) return NextResponse.json({ message: "Twilio Verify is not configured." }, { status: 400 });

    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const form = new URLSearchParams({ To: phone, Channel: "sms" });
    const res = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const data = await res.json();
    return NextResponse.json({ ok: res.ok, status: data.status, sid: data.sid, raw: data }, { status: res.ok ? 200 : 500 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not send OTP." }, { status: 500 });
  }
}
