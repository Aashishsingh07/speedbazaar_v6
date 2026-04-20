import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

async function getOrCreateCart(userId?: string | null) {
  let cart = await prisma.cart.findFirst({
    where: { userId: userId ?? null, status: "ACTIVE" },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: userId ?? null, status: "ACTIVE" },
      include: { items: { include: { product: true } } },
    });
  }
  return cart;
}

function shape(cart: Awaited<ReturnType<typeof getOrCreateCart>>) {
  const items = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    qty: item.quantity,
    price: item.product.price,
    stock: item.product.stock,
    total: item.quantity * item.product.price,
  }));
  return {
    cartId: cart.id,
    items,
    subtotal: items.reduce((sum, item) => sum + item.total, 0),
  };
}

export async function GET() {
  const user = await getCurrentUser();
  const cart = await getOrCreateCart(user?.id);
  return NextResponse.json(shape(cart));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productId = String(body.productId || "").trim();
    const quantity = Math.max(1, Number(body.quantity || 1));
    if (!productId) return NextResponse.json({ message: "productId is required." }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ message: "Product not found." }, { status: 404 });

    const user = await getCurrentUser();
    const cart = await getOrCreateCart(user?.id);
    const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId: product.id } });
    if (existing) {
      await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: Math.min(existing.quantity + quantity, product.stock || 99) } });
    } else {
      await prisma.cartItem.create({ data: { cartId: cart.id, productId: product.id, quantity: Math.min(quantity, product.stock || 99) } });
    }

    const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { product: true } } } });
    return NextResponse.json({ ok: true, message: "Added to cart.", ...shape(updated!) });
  } catch (error) {
    return NextResponse.json({ message: "Could not update cart.", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const itemId = String(body.itemId || "").trim();
    const quantity = Number(body.quantity || 1);
    if (!itemId) return NextResponse.json({ message: "itemId is required." }, { status: 400 });

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    }

    const user = await getCurrentUser();
    const cart = await getOrCreateCart(user?.id);
    return NextResponse.json({ ok: true, message: "Cart updated.", ...shape(cart) });
  } catch (error) {
    return NextResponse.json({ message: "Could not change quantity.", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = String(searchParams.get("itemId") || "").trim();
    if (!itemId) return NextResponse.json({ message: "itemId is required." }, { status: 400 });
    await prisma.cartItem.delete({ where: { id: itemId } });
    const user = await getCurrentUser();
    const cart = await getOrCreateCart(user?.id);
    return NextResponse.json({ ok: true, message: "Item removed.", ...shape(cart) });
  } catch (error) {
    return NextResponse.json({ message: "Could not remove item.", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
