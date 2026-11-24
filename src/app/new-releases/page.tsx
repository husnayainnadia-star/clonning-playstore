import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import AppCard from "@/components/apps/AppCard";
import Link from "next/link";

export default async function NewReleasesPage() {
  let apps: any[] = [];
  try {
    apps = await db
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
      })
      .from(applications)
      .where(eq(applications.isActive, true))
      .orderBy(desc(applications.createdAt))
      .limit(50);
  } catch {
    // DB not configured yet
  }

  return (
    <div>
      <div className="mb-6">
        <nav className="text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#01875F]">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-900">New Releases</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">New Releases</h1>
        <p className="text-sm text-gray-500 mt-1">The latest apps and games</p>
      </div>
      {apps.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm">
          No apps yet. Configure your database and run <code className="bg-gray-100 px-1.5 py-0.5 rounded">npm run db:seed</code>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {apps.map((app) => (
            <AppCard key={app.id} {...app} variant="default" />
          ))}
        </div>
      )}
    </div>
  );
}
