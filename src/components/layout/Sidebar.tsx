"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  BarChart3,
  Brain,
  Trophy,
  Zap,
  Target,
  Settings,
  GraduationCap,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/store/progress";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/", icon: BookOpen, label: "Practice", description: "Study questions" },
  { href: "/exam", icon: Trophy, label: "Exam Sim", description: "33-question test" },
  { href: "/flashcard", icon: Zap, label: "Flashcards", description: "Rapid-fire state Qs" },
  { href: "/focus", icon: Target, label: "Focus Mode", description: "Your weak spots" },
  { href: "/analytics", icon: BarChart3, label: "Analytics", description: "Your heatmap" },
  { href: "/settings", icon: Settings, label: "Settings", description: "Preferences" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { totalAttempts, correctAnswers, streak } = useProgressStore();
  const accuracy =
    totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

  return (
    <div className="flex flex-col h-full glass border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center glow-blue">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-bold text-sm tracking-tight text-foreground">LiD Master</p>
          <p className="text-[10px] text-muted-foreground">Leben in Deutschland</p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-border">
        <StatChip label="Accuracy" value={`${accuracy}%`} color="text-primary" />
        <StatChip label="Attempts" value={totalAttempts.toString()} color="text-emerald-500 dark:text-emerald-400" />
        <StatChip
          label="Streak"
          value={`${streak}d`}
          color="text-amber-500 dark:text-amber-400"
          glow={streak > 0}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group",
                active
                  ? "bg-primary/15 border border-primary/25 text-primary glow-blue"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
              )}
              aria-current={active ? "page" : undefined}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <div className="min-w-0">
                <p className={cn("font-medium leading-none", active && "text-primary")}>
                  {item.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  {item.description}
                </p>
              </div>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Download PDF */}
      <div className="px-3 pb-2">
        <a
          href="/LiD-Master-Questions.pdf"
          download="LiD-Master-Questions.pdf"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group w-full text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] border border-dashed border-border hover:border-primary/30"
        >
          <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
            <Download className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium leading-none text-xs">Download PDF</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">460 Q&amp;As · 436 KB</p>
          </div>
        </a>
      </div>

      {/* Progress ring footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <ProgressRing value={accuracy} size={44} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">Overall Progress</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {correctAnswers}/{totalAttempts} correct
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

function StatChip({
  label,
  value,
  color,
  glow,
}: {
  label: string;
  value: string;
  color: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center py-2 rounded-lg bg-foreground/[0.03] border border-border",
        glow && "pulse-amber"
      )}
    >
      <span className={cn("text-sm font-bold tabular-nums", color)}>{value}</span>
      <span className="text-[9px] text-muted-foreground mt-0.5">{label}</span>
    </div>
  );
}

function ProgressRing({ value, size }: { value: number; size: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--ring-track)"
        strokeWidth={4}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgb(59,130,246)"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
    </svg>
  );
}
