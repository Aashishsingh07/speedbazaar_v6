import { NextResponse } from "next/server";

// ❗ Use require instead of import (fix for Vercel)
const nodemailer = require("nodemailer");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: body.to,
      subject: body.subject || "Test Email",
      text: body.message || "Hello from SpeedBazaar 🚀",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
