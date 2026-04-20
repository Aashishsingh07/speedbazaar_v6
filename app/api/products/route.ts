import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true, seller: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category?.name ?? "General",
      price: p.price,
      stock: p.stock,
      rating: p.rating,
      seller: p.seller?.storeName ?? "Marketplace",
      desc: p.description,
      image: p.image,
    })),
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !["SELLER", "ADMIN"].includes(user.role)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json();
  const name = String(body.name || "").trim();
  const description = String(body.description || "").trim();
  const categoryName = String(body.category || "General").trim();
  const price = Number(body.price || 0);
  const stock = Math.max(0, Number(body.stock || 0));
  if (name.length < 3 || description.length < 8 || price <= 0) {
    return NextResponse.json({ message: "Fill valid product details." }, { status: 400 });
  }

  const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "general";
  const category = await prisma.category.upsert({
    where: { slug: categorySlug },
    update: { name: categoryName },
    create: { name: categoryName, slug: categorySlug },
  });

  let sellerId: string | null = null;
  if (user.role === "SELLER") {
    const seller = await prisma.seller.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, storeName: `${user.name}'s Store`, isApproved: true },
    });
    sellerId = seller.id;
  }

  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `product-${Date.now()}`;
  const product = await prisma.product.create({
    data: {
      name,
      slug: `${baseSlug}-${Date.now()}`,
      description,
      price,
      stock,
      sellerId,
      categoryId: category.id,
      isFeatured: Boolean(body.isFeatured),
      isActive: true,
    },
  });

  return NextResponse.json({ ok: true, message: "Product created.", productId: product.id });
}
