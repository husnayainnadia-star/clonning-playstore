import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const [app] = await db
      .select({
        id: applications.id,
        name: applications.name,
        slug: applications.slug,
        developer: applications.developer,
        icon: applications.icon,
        screenshots: applications.screenshots,
        description: applications.description,
        whatsNew: applications.whatsNew,
        version: applications.version,
        size: applications.size,
        minAndroid: applications.minAndroid,
        downloads: applications.downloads,
        rating: applications.rating,
        reviewCount: applications.reviewCount,
        isFree: applications.isFree,
        price: applications.price,
        contentRating: applications.contentRating,
        isEditor: applications.isEditor,
        isFeatured: applications.isFeatured,
        website: applications.website,
        email: applications.email,
        lastUpdated: applications.lastUpdated,
        categoryId: applications.categoryId,
      })
      .from(applications)
      .where(eq(applications.id, parseInt(id)))
      .limit(1);

    if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(app);
  } catch {
    return NextResponse.json({ error: "Failed to fetch app" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const [updated] = await db
      .update(applications)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(applications.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update app" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.delete(applications).where(eq(applications.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete app" }, { status: 500 });
  }
}
