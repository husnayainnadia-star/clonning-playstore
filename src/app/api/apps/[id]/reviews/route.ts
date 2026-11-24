import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews, applications, users } from "@/lib/db/schema";
import { eq, and, avg, count, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(255).optional(),
  body: z.string().max(5000).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appId = parseInt(id);

  const reviewList = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      thumbsUp: reviews.thumbsUp,
      createdAt: reviews.createdAt,
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.appId, appId))
    .orderBy(sql`${reviews.thumbsUp} DESC, ${reviews.createdAt} DESC`);

  return NextResponse.json(reviewList);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const appId = parseInt(id);

  try {
    const body = await req.json();
    const { rating, title, body: reviewBody } = reviewSchema.parse(body);

    // Check existing review
    const existing = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(and(eq(reviews.userId, session.user.id!), eq(reviews.appId, appId)))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "You already reviewed this app" }, { status: 400 });
    }

    const [review] = await db
      .insert(reviews)
      .values({ userId: session.user.id!, appId, rating, title, body: reviewBody })
      .returning();

    // Update app rating
    await updateAppRating(appId);

    const [user] = await db
      .select({ id: users.id, name: users.name, image: users.image })
      .from(users)
      .where(eq(users.id, session.user.id!))
      .limit(1);

    return NextResponse.json({ ...review, user });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const appId = parseInt(id);

  try {
    const body = await req.json();
    const { rating, title, body: reviewBody } = reviewSchema.parse(body);

    const [updated] = await db
      .update(reviews)
      .set({ rating, title, body: reviewBody, updatedAt: new Date() })
      .where(and(eq(reviews.userId, session.user.id!), eq(reviews.appId, appId)))
      .returning();

    await updateAppRating(appId);

    const [user] = await db
      .select({ id: users.id, name: users.name, image: users.image })
      .from(users)
      .where(eq(users.id, session.user.id!))
      .limit(1);

    return NextResponse.json({ ...updated, user });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

async function updateAppRating(appId: number) {
  const [result] = await db
    .select({
      avg: avg(reviews.rating),
      cnt: count(reviews.id),
    })
    .from(reviews)
    .where(eq(reviews.appId, appId));

  await db
    .update(applications)
    .set({
      rating: result.avg ? String(parseFloat(result.avg as string).toFixed(2)) : "0",
      reviewCount: result.cnt,
    })
    .where(eq(applications.id, appId));
}
