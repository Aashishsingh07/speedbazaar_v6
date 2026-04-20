import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const [users, sellers, products, orders, paidOrders] = await Promise.all([
    prisma.user.count(), prisma.seller.count(), prisma.product.count(), prisma.order.count(), prisma.order.findMany({ where: { paymentStatus: "PAID" }, select: { total: true } })
  ]);
  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  return NextResponse.json({ stats: { users, sellers, products, orders, revenue } });
}
