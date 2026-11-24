import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import AppCard from "@/components/apps/AppCard";
import Link from "next/link";
import { Star } from "lucide-react";

export default async function EditorsChoicePage() {
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
      .where(eq(applications.isEditor, true))
      .orderBy(desc(applications.downloads));
  } catch {
    // DB not configured yet
  }

  return (
    <div>
      <div className="mb-6">
        <nav className="text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#01875F]">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-900">Editor&apos;s Choice</span>
        </nav>
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
          <h1 className="text-2xl font-bold text-gray-900">Editor&apos;s Choice</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Handpicked apps and games of exceptional quality</p>
      </div>
      {apps.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm">No Editor&apos;s Choice apps yet.</div>
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
