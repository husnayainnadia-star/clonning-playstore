import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { installations, applications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const library = await db
    .select({
      installId: installations.id,
      status: installations.status,
      installedAt: installations.installedAt,
      app: {
        id: applications.id,
        name: applications.name,
        slug: applications.slug,
        developer: applications.developer,
        icon: applications.icon,
        rating: applications.rating,
        isFree: applications.isFree,
        price: applications.price,
        size: applications.size,
        version: applications.version,
      },
    })
    .from(installations)
    .leftJoin(applications, eq(installations.appId, applications.id))
    .where(eq(installations.userId, session.user.id!))
    .orderBy(desc(installations.installedAt));

  return NextResponse.json(library);
}
