"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Trophy, Zap, BarChart3, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const dockItems = [
  { href: "/", icon: BookOpen, label: "Practice" },
  { href: "/exam", icon: Trophy, label: "Exam" },
  { href: "/flashcard", icon: Zap, label: "Flash" },
  { href: "/focus", icon: Target, label: "Focus" },
  { href: "/analytics", icon: BarChart3, label: "Stats" },
];

export function BottomDock() {
  const pathname = usePathname();

  return (
    <div className="bottom-dock border-t border-white/[0.06] bg-background/80">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {dockItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all active:scale-90"
              aria-current={active ? "page" : undefined}
            >
              <div
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200",
                  active
                    ? "bg-primary/20 border border-primary/30 glow-blue"
                    : "text-muted-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
