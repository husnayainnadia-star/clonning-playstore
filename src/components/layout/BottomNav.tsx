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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-pb">
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
                "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors",
                isActive ? "text-[#01875F]" : "text-gray-500"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "stroke-[#01875F]")} />
              <span className={cn("text-[10px]", isActive && "font-medium text-[#01875F]")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
