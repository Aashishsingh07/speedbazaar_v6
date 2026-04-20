import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ orders: [] });
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } }, address: true, payment: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json({
    orders: orders.map((order) => ({
      id: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      createdAt: order.createdAt,
      address: order.address ? `${order.address.line1}, ${order.address.city}` : null,
      timeline: order.timelineJson ? JSON.parse(order.timelineJson) : [],
      items: order.items.map((item) => ({ name: item.product.name, quantity: item.quantity, total: item.totalPrice })),
    })),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Login required." }, { status: 401 });
    const addressId = String(body.addressId || "").trim();
    if (!addressId) return NextResponse.json({ message: "addressId is required." }, { status: 400 });

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id, status: "ACTIVE" },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    if (!cart || cart.items.length === 0) return NextResponse.json({ message: "Cart is empty." }, { status: 400 });

    const address = await prisma.address.findFirst({ where: { id: addressId, userId: user.id } });
    if (!address) return NextResponse.json({ message: "Address not found." }, { status: 404 });

    const subtotal = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    const deliveryFee = subtotal >= 999 ? 0 : 49;
    const total = subtotal + deliveryFee;
    const timeline = JSON.stringify([
      { label: "Order placed", done: true },
      { label: "Payment confirmed", done: false },
      { label: "Packed", done: false },
      { label: "Out for delivery", done: false },
      { label: "Delivered", done: false },
    ]);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId: address.id,
        subtotal,
        deliveryFee,
        total,
        status: "PENDING",
        paymentStatus: "UNPAID",
        timelineJson: timeline,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: item.quantity * item.product.price,
          })),
        },
      },
      include: { items: true },
    });

    await prisma.cart.update({ where: { id: cart.id }, data: { status: "ORDERED" } });
    await prisma.cart.create({ data: { userId: user.id, status: "ACTIVE" } });

    return NextResponse.json({ ok: true, message: "Order created successfully.", orderId: order.id, total: order.total });
  } catch (error) {
    return NextResponse.json({ message: "Could not create order.", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
