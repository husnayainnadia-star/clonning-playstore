
import { db } from "@/lib/db";
import { applications, categories } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import AppCard from "@/components/apps/AppCard";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} Apps – Google Play` };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { sort = "downloads", page = "1" } = await searchParams;

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (!category) notFound();

  const pageNum = parseInt(page);
  const limit = 24;
  const offset = (pageNum - 1) * limit;

  const orderBy = sort === "rating" ? desc(applications.rating)
    : sort === "newest" ? desc(applications.createdAt)
    : desc(applications.downloads);

  const apps = await db
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
    .where(eq(applications.categoryId, category.id))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const sortOptions = [
    { value: "downloads", label: "Most popular" },
    { value: "rating", label: "Top rated" },
    { value: "newest", label: "Newest" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <nav className="text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#01875F]">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        {category.description && (
          <p className="text-sm text-gray-500 mt-1">{category.description}</p>
        )}
      </div>

      {/* Sort tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {sortOptions.map((opt) => (
          <Link
            key={opt.value}
            href={`/category/${slug}?sort=${opt.value}`}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              sort === opt.value
                ? "bg-[#01875F] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#01875F] hover:text-[#01875F]"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {apps.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No apps found in this category yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {apps.map((app) => (
              <AppCard key={app.id} {...app} variant="default" />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            {pageNum > 1 && (
              <Link
                href={`/category/${slug}?sort=${sort}&page=${pageNum - 1}`}
                className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#01875F] hover:text-[#01875F]"
              >
                Previous
              </Link>
            )}
            {apps.length === limit && (
              <Link
                href={`/category/${slug}?sort=${sort}&page=${pageNum + 1}`}
                className="px-4 py-2 rounded-full bg-[#01875F] text-white text-sm"
              >
                Next
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
