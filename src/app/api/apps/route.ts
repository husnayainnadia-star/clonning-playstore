import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications, categories } from "@/lib/db/schema";
import { eq, ilike, or, desc, asc, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const editor = searchParams.get("editor");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");
  const sort = searchParams.get("sort") || "downloads";

  try {
    const conditions = [eq(applications.isActive, true)];

    if (category) {
      const [cat] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, category))
        .limit(1);
      if (cat) conditions.push(eq(applications.categoryId, cat.id));
    }

    if (featured === "true") conditions.push(eq(applications.isFeatured, true));
    if (editor === "true") conditions.push(eq(applications.isEditor, true));

    const orderBy = sort === "rating"
      ? desc(applications.rating)
      : sort === "newest"
      ? desc(applications.createdAt)
      : desc(applications.downloads);

    const apps = await db
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
        categoryId: applications.categoryId,
      })
      .from(applications)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(apps);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch apps" }, { status: 500 });
  }
}

const appSchema = z.object({
  name: z.string().min(1).max(255),
  developer: z.string().min(1).max(255),
  categoryId: z.number().optional(),
  icon: z.string().url(),
  screenshots: z.array(z.string()).optional(),
  description: z.string().min(1),
  whatsNew: z.string().optional(),
  version: z.string().optional(),
  size: z.string().optional(),
  minAndroid: z.string().optional(),
  isFree: z.boolean().optional(),
  price: z.string().optional(),
  contentRating: z.string().optional(),
  website: z.string().optional(),
  email: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = appSchema.parse(body);
    const slug = slugify(data.name) + "-" + Date.now();

    const [app] = await db
      .insert(applications)
      .values({ ...data, slug, screenshots: data.screenshots || [] })
      .returning();

    return NextResponse.json(app);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create app" }, { status: 500 });
  }
}
