
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { applications, categories } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import AppForm from "@/components/admin/AppForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAppPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") redirect("/");

  const [app] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, parseInt(id)))
    .limit(1);

  if (!app) notFound();

  const cats = await db.select().from(categories).orderBy(asc(categories.name));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/apps" className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Edit App: {app.name}</h1>
      </div>
      <AppForm categories={cats} app={app as any} />
    </div>
  );
}
