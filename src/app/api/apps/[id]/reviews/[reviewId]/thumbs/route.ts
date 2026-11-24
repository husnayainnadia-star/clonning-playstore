import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const { reviewId } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [updated] = await db
    .update(reviews)
    .set({ thumbsUp: sql`${reviews.thumbsUp} + 1` })
    .where(eq(reviews.id, parseInt(reviewId)))
    .returning({ thumbsUp: reviews.thumbsUp });

  return NextResponse.json({ thumbsUp: updated.thumbsUp });
}
