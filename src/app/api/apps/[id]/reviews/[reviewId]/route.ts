import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  const { id, reviewId } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = (session.user as any).role === "admin";

  const condition = isAdmin
    ? eq(reviews.id, parseInt(reviewId))
    : and(eq(reviews.id, parseInt(reviewId)), eq(reviews.userId, session.user.id!));

  await db.delete(reviews).where(condition);
  return NextResponse.json({ success: true });
}
