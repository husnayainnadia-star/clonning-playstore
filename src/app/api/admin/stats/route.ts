import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications, users, reviews, installations } from "@/lib/db/schema";
import { count, sum } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [[{ totalApps }], [{ totalUsers }], [{ totalReviews }], [{ totalDownloads }]] =
    await Promise.all([
      db.select({ totalApps: count() }).from(applications),
      db.select({ totalUsers: count() }).from(users),
      db.select({ totalReviews: count() }).from(reviews),
      db.select({ totalDownloads: sum(applications.downloads) }).from(applications),
    ]);

  return NextResponse.json({
    totalApps,
    totalUsers,
    totalReviews,
    totalDownloads: totalDownloads || 0,
  });
}
