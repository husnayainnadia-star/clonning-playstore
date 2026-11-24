"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
  createdAt: Date;
}

export default function AdminUsersTable({ users: initialUsers, currentUserId }: { users: User[]; currentUserId: string }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const handleRoleChange = async (id: string, role: string) => {
    if (id === currentUserId) return;
    setUpdating(id);
    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });
      setUsers((u) => u.map((user) => (user.id === id ? { ...user, role } : user)));
    } finally {
      setUpdating(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="search"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm mb-4 h-9 px-3 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#01875F]/30"
      />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Joined</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#01875F]/10 flex items-center justify-center shrink-0 overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-medium text-[#01875F]">
                            {user.name?.[0]?.toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900">{user.name || "—"}</div>
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        {user.id === currentUserId && (
                          <span className="text-xs text-[#01875F]">(you)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      disabled={user.id === currentUserId || updating === user.id}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-xs rounded-full px-2 py-1 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#01875F]/30 disabled:opacity-50"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
