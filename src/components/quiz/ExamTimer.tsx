"use client";

import { motion } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamTimerProps {
  timeLeft: number; // seconds
  totalTime: number; // seconds
}

export function ExamTimer({ timeLeft, totalTime }: ExamTimerProps) {
  const pct = timeLeft / totalTime;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= 300; // 5 min
  const isDanger = timeLeft <= 60;   // 1 min

  // SVG ring
  const size = 48;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - pct * circumference;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all",
        isDanger
          ? "bg-rose-500/15 border-rose-500/30"
          : isWarning
          ? "bg-amber-500/15 border-amber-500/30"
          : "bg-white/[0.04] border-white/[0.08]"
      )}
      aria-label={`Time remaining: ${minutes} minutes ${seconds} seconds`}
      role="timer"
    >
      {/* Mini ring */}
      <svg width={size} height={size} className="-rotate-90 shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={3}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isDanger ? "#f43f5e" : isWarning ? "#f59e0b" : "#3b82f6"}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transition={{ duration: 1, ease: "linear" }}
        />
      </svg>

      <div className="flex flex-col items-start">
        <div
          className={cn(
            "font-mono font-bold text-sm tabular-nums flex items-center gap-1",
            isDanger ? "text-rose-400" : isWarning ? "text-amber-400" : "text-foreground"
          )}
        >
          {isDanger && <AlertTriangle className="w-3 h-3" />}
          {!isDanger && <Clock className="w-3 h-3 text-muted-foreground" />}
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
        <span className="text-[9px] text-muted-foreground leading-none">remaining</span>
      </div>
    </div>
  );
}
