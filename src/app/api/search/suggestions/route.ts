import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { ilike, or, eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (q.length < 2) return NextResponse.json([]);

  const results = await db
    .select({
      id: applications.id,
      name: applications.name,
      slug: applications.slug,
      developer: applications.developer,
      icon: applications.icon,
    })
    .from(applications)
    .where(
      and(
        eq(applications.isActive, true),
        or(
          ilike(applications.name, `%${q}%`),
          ilike(applications.developer, `%${q}%`)
        )
      )
    )
    .limit(5);

  return NextResponse.json(results);
}
