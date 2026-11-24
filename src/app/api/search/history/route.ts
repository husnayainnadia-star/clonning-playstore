import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { searchHistory } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { query } = await req.json();
  if (!query?.trim()) return NextResponse.json({ error: "Empty query" }, { status: 400 });

  await db.insert(searchHistory).values({ userId: session.user.id!, query: query.trim() });

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json([]);

  const history = await db
    .select({ id: searchHistory.id, query: searchHistory.query, createdAt: searchHistory.createdAt })
    .from(searchHistory)
    .where(eq(searchHistory.userId, session.user.id!))
    .orderBy(desc(searchHistory.createdAt))
    .limit(10);

  return NextResponse.json(history);
}
