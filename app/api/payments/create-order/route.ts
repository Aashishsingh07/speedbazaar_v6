import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRazorpayOrder, hasRazorpayConfig } from "@/lib/integrations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = String(body.orderId || "").trim();
    if (!orderId) return NextResponse.json({ message: "orderId is required." }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ message: "Order not found." }, { status: 404 });

    if (!hasRazorpayConfig()) {
      return NextResponse.json({ message: "Razorpay is not configured. Add keys to .env.local", live: false }, { status: 400 });
    }

    const razorpayOrder = await createRazorpayOrder(order.total, order.id);
    await prisma.payment.upsert({
      where: { orderId: order.id },
      update: {
        gateway: "RAZORPAY",
        gatewayRef: String(razorpayOrder.id),
        amount: order.total,
        status: "CREATED",
        verificationLog: JSON.stringify({ receipt: order.id, createdAt: new Date().toISOString() }),
      },
      create: {
        orderId: order.id,
        gateway: "RAZORPAY",
        gatewayRef: String(razorpayOrder.id),
        amount: order.total,
        status: "CREATED",
        verificationLog: JSON.stringify({ receipt: order.id, createdAt: new Date().toISOString() }),
      },
    });

    return NextResponse.json({
      live: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not create Razorpay order." }, { status: 500 });
  }
}
