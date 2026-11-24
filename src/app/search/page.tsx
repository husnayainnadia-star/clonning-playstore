import { db } from "@/lib/db";
import { applications, categories } from "@/lib/db/schema";
import { ilike, or, eq, and } from "drizzle-orm";
import AppCard from "@/components/apps/AppCard";
import { Search } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "", category } = await searchParams;

  let results: any[] = [];
  let allCategories: any[] = [];

  try {
    allCategories = await db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(categories);

    if (q.trim()) {
      const conditions: any[] = [
        eq(applications.isActive, true),
        or(
          ilike(applications.name, `%${q}%`),
          ilike(applications.developer, `%${q}%`),
          ilike(applications.description, `%${q}%`)
        ),
      ];

      if (category) {
        const [cat] = await db
          .select({ id: categories.id })
          .from(categories)
          .where(eq(categories.slug, category))
          .limit(1);
        if (cat) conditions.push(eq(applications.categoryId, cat.id));
      }

      results = await db
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
          reviewCount: applications.reviewCount,
        })
        .from(applications)
        .where(and(...conditions))
        .limit(50);
    }
  } catch {
    // DB not configured yet
  }

  return (
    <div>
      <div className="mb-6">
        {q ? (
          <h1 className="text-xl font-semibold text-gray-900">
            {results.length > 0
              ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${q}"`
              : `No results for "${q}"`}
          </h1>
        ) : (
          <h1 className="text-xl font-semibold text-gray-900">Search</h1>
        )}
      </div>

      {/* Category filter */}
      {q && allCategories.length > 0 && (
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          <Link
            href={`/search?q=${encodeURIComponent(q)}`}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !category ? "bg-[#01875F] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#01875F]"
            }`}
          >
            All
          </Link>
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?q=${encodeURIComponent(q)}&category=${cat.slug}`}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat.slug
                  ? "bg-[#01875F] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#01875F]"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((app) => (
            <AppCard key={app.id} {...app} variant="default" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 flex flex-col items-center gap-3">
          <Search className="h-12 w-12 text-gray-200" />
          <p className="text-gray-500">
            {q ? "No results found. Try a different keyword." : "Search for apps, games, and more"}
          </p>
        </div>
      )}
    </div>
  );
}
