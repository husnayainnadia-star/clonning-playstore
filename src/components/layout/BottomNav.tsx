"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, Gamepad2, Download, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Top Charts", href: "/charts", icon: TrendingUp },
  { label: "Games", href: "/category/games", icon: Gamepad2 },
  { label: "Library", href: "/library", icon: Download },
  { label: "Account", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="safe-area-pb fixed bottom-0 left-0 right-0 z-50 border-t border-[#e8eaed] bg-white lg:hidden">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const href = (item.href === "/profile" || item.href === "/library") && !session
            ? "/auth/signin"
            : item.href;

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs transition-colors",
                isActive ? "text-[#01875f]" : "text-[#5f6368]"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "stroke-[#01875f]" : "stroke-[#5f6368]")} />
              <span className={cn("text-[11px]", isActive ? "font-medium text-[#01875f]" : "text-[#5f6368]")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
