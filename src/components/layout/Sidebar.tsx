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
    <aside className="hidden w-[220px] shrink-0 lg:block">
      <div className="sticky top-20 space-y-0.5 pr-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-r-full px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#c8ede0] text-[#0b3d2e]"
                  : "text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124]"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-[#0b3d2e]" : "text-[#5f6368]")} />
              {item.label}
            </Link>
          );
        })}

        <div className="my-4 border-t border-[#e8eaed]" />
        <div className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f6368]">
          Categories
        </div>
        <div className="space-y-0.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = pathname === cat.href;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={cn(
                  "flex items-center gap-4 rounded-r-full px-4 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-[#c8ede0] font-medium text-[#0b3d2e]"
                    : "text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124]"
                )}
              >
                <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-[#0b3d2e]" : "text-[#5f6368]")} />
                <span className="truncate">{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
