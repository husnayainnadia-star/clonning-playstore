"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Gamepad2,
  BookOpen,
  Tv,
  Users,
  Briefcase,
  Camera,
  DollarSign,
  Heart,
  ShoppingBag,
  Music,
  Wrench,
  Sparkles,
  TrendingUp,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Top Charts", href: "/charts", icon: TrendingUp },
  { label: "Editor's Choice", href: "/editors-choice", icon: Star },
  { label: "New Releases", href: "/new-releases", icon: Sparkles },
];

const categories = [
  { label: "Games", href: "/category/games", icon: Gamepad2, color: "#E8F5E9" },
  { label: "Education", href: "/category/education", icon: BookOpen, color: "#E3F2FD" },
  { label: "Entertainment", href: "/category/entertainment", icon: Tv, color: "#FFF3E0" },
  { label: "Social", href: "/category/social", icon: Users, color: "#FCE4EC" },
  { label: "Productivity", href: "/category/productivity", icon: Briefcase, color: "#E8EAF6" },
  { label: "Photography", href: "/category/photography", icon: Camera, color: "#F3E5F5" },
  { label: "Finance", href: "/category/finance", icon: DollarSign, color: "#E0F2F1" },
  { label: "Lifestyle", href: "/category/lifestyle", icon: Sparkles, color: "#FFF8E1" },
  { label: "Health & Fitness", href: "/category/health-fitness", icon: Heart, color: "#FFEBEE" },
  { label: "Shopping", href: "/category/shopping", icon: ShoppingBag, color: "#E0F7FA" },
  { label: "Music & Audio", href: "/category/music-audio", icon: Music, color: "#EDE7F6" },
  { label: "Tools", href: "/category/tools", icon: Wrench, color: "#F1F8E9" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0">
      <div className="sticky top-20 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#E6F4EF] text-[#01875F]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4">
          <div className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Categories
          </div>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = pathname === cat.href;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-full text-sm transition-colors",
                  isActive
                    ? "bg-[#E6F4EF] text-[#01875F] font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon className="h-3.5 w-3.5 text-gray-600" />
                </div>
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
