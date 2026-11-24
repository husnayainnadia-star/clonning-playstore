import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications, categories } from "@/lib/db/schema";
import { ilike, or, eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "20");

  if (!q.trim()) return NextResponse.json([]);

  try {
    const conditions = [
      eq(applications.isActive, true),
      or(
        ilike(applications.name, `%${q}%`),
        ilike(applications.developer, `%${q}%`),
        ilike(applications.description, `%${q}%`)
      )!,
    ];

    if (category) {
      const [cat] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, category))
        .limit(1);
      if (cat) conditions.push(eq(applications.categoryId, cat.id));
    }

    const results = await db
      .select({
        id: applications.id,
        name: applications.name,
        slug: applications.slug,
        developer: applications.developer,
        icon: applications.icon,
        rating: applications.rating,
        downloads: applications.downloads,
        isFree: applications.isFree,
        price: applications.price,
        size: applications.size,
        reviewCount: applications.reviewCount,
      })
      .from(applications)
      .where(and(...conditions))
      .limit(limit);

    return NextResponse.json(results);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
