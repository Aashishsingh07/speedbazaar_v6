import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !["SELLER", "ADMIN"].includes(user.role)) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const seller = user.role === "SELLER"
    ? await prisma.seller.findUnique({ where: { userId: user.id } })
    : null;
  const where = seller ? { sellerId: seller.id } : undefined;
  const [products, inventoryLogs] = await Promise.all([
    prisma.product.count({ where }),
    prisma.inventoryLog.count({ where: where ? { product: where } : undefined }),
  ]);
  return NextResponse.json({ stats: { products, inventoryLogs, storeName: seller?.storeName ?? "Admin view" } });
}
