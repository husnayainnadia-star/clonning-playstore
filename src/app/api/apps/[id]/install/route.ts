import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { installations, applications } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ status: "not_installed" });
  }

  const [install] = await db
    .select({ status: installations.status })
    .from(installations)
    .where(
      and(
        eq(installations.userId, session.user.id!),
        eq(installations.appId, parseInt(id))
      )
    )
    .limit(1);

  return NextResponse.json({ status: install?.status || "not_installed" });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appId = parseInt(id);

  // Upsert installation
  await db
    .insert(installations)
    .values({ userId: session.user.id!, appId, status: "installed" })
    .onConflictDoUpdate({
      target: [installations.userId, installations.appId],
      set: { status: "installed", updatedAt: new Date() },
    });

  // Increment downloads
  await db
    .update(applications)
    .set({ downloads: sql`${applications.downloads} + 1` })
    .where(eq(applications.id, appId));

  return NextResponse.json({ success: true, status: "installed" });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db
    .delete(installations)
    .where(
      and(
        eq(installations.userId, session.user.id!),
        eq(installations.appId, parseInt(id))
      )
    );

  return NextResponse.json({ success: true });
}
