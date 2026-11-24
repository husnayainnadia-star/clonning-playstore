
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { applications, categories } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import AdminAppTable from "@/components/admin/AdminAppTable";
import { Plus, ArrowLeft } from "lucide-react";

export default async function AdminAppsPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") redirect("/");

  const apps = await db
    .select({
      id: applications.id,
      name: applications.name,
      slug: applications.slug,
      developer: applications.developer,
      icon: applications.icon,
      downloads: applications.downloads,
      rating: applications.rating,
      reviewCount: applications.reviewCount,
      isFree: applications.isFree,
      isActive: applications.isActive,
      isFeatured: applications.isFeatured,
      isEditor: applications.isEditor,
      categoryName: categories.name,
      createdAt: applications.createdAt,
    })
    .from(applications)
    .leftJoin(categories, eq(applications.categoryId, categories.id))
    .orderBy(desc(applications.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Manage Apps ({apps.length})</h1>
        </div>
        <Link
          href="/admin/apps/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#01875F] text-white rounded-full text-sm font-medium hover:bg-[#016d4d] transition-colors"
        >
          <Plus className="h-4 w-4" /> Add App
        </Link>
      </div>

      <AdminAppTable apps={apps} />
    </div>
  );
}
