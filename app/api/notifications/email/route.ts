import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const to = String(body.to || "").trim();
    const subject = String(body.subject || "SpeedBazaar update").trim();
    const text = String(body.text || "").trim();

    if (!to || !text) return NextResponse.json({ message: "to and text are required." }, { status: 400 });

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;
    if (!host || !user || !pass) return NextResponse.json({ message: "SMTP is not configured." }, { status: 400 });

    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    const info = await transporter.sendMail({ from, to, subject, text });
    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not send email." }, { status: 500 });
  }
}
