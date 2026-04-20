import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/integrations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = String(body.orderId || "").trim();
    const transactionId = String(body.transactionId || body.razorpay_payment_id || "").trim();
    const gateway = String(body.gateway || "RAZORPAY-UPI").trim();
    const razorpayOrderId = String(body.razorpay_order_id || "").trim();
    const razorpayPaymentId = String(body.razorpay_payment_id || "").trim();
    const razorpaySignature = String(body.razorpay_signature || "").trim();

    if (!orderId) return NextResponse.json({ message: "orderId is required." }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ message: "Order not found." }, { status: 404 });

    let verified = false;
    let verificationMode = "local-demo";
    let verificationLog: Record<string, unknown> = {};

    if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      verified = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
      verificationMode = "razorpay-signature";
      verificationLog = { razorpayOrderId, razorpayPaymentId, verifiedAt: new Date().toISOString() };
      if (!verified) {
        return NextResponse.json({ verified: false, message: "Razorpay signature verification failed." }, { status: 400 });
      }
    } else {
      if (!transactionId) return NextResponse.json({ message: "transactionId or Razorpay payment fields are required." }, { status: 400 });
      verified = true;
      verificationLog = { transactionId, verifiedAt: new Date().toISOString() };
    }

    const payment = await prisma.payment.upsert({
      where: { orderId },
      update: {
        gateway,
        gatewayRef: razorpayPaymentId || transactionId,
        amount: order.total,
        status: verified ? "VERIFIED" : "FAILED",
        verificationLog: JSON.stringify({ mode: verificationMode, ...verificationLog }),
      },
      create: {
        orderId,
        gateway,
        gatewayRef: razorpayPaymentId || transactionId,
        amount: order.total,
        status: verified ? "VERIFIED" : "FAILED",
        verificationLog: JSON.stringify({ mode: verificationMode, ...verificationLog }),
      },
    });

    if (verified) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          status: order.status === "PENDING" ? "CONFIRMED" : order.status,
          transactionId: razorpayPaymentId || transactionId,
          paymentMethod: gateway,
        },
      });
    }

    return NextResponse.json({
      verified,
      mode: verificationMode,
      message: verificationMode === "razorpay-signature"
        ? "Payment verified using Razorpay signature."
        : "Payment saved in local demo mode. Send Razorpay fields for live signature verification.",
      paymentId: payment.id,
    });
  } catch (error) {
    return NextResponse.json({ message: "Invalid request.", error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
