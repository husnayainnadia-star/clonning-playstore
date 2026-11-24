
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") redirect("/");

  const allUsers = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, image: users.image, createdAt: users.createdAt })
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Manage Users ({allUsers.length})</h1>
      </div>
      <AdminUsersTable users={allUsers} currentUserId={session.user!.id!} />
    </div>
  );
}
