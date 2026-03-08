"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, Home, Target } from "lucide-react";
import Link from "next/link";
import { PracticeMode } from "@/types";
import { cn } from "@/lib/utils";
import { useConfetti } from "@/hooks/useConfetti";

interface SessionSummaryProps {
  total: number;
  correct: number;
  mode: PracticeMode;
  onRestart: () => void;
}

export function SessionSummary({ total, correct, mode, onRestart }: SessionSummaryProps) {
  const score = Math.round((correct / total) * 100);
  const passed = mode === "exam" ? score >= 67 : score >= 50;
  const incorrect = total - correct;
  const fireConfetti = useConfetti();

  useEffect(() => {
    fireConfetti(score);
  }, [score, fireConfetti]);

  const getEmoji = () => {
    if (score === 100) return "🎉";
    if (score >= 80) return "🌟";
    if (score >= 67) return "✅";
    if (score >= 50) return "📚";
    return "💪";
  };

  const getMessage = () => {
    if (score === 100) return "Perfect Score!";
    if (score >= 80) return "Excellent work!";
    if (score >= 67) return mode === "exam" ? "You passed!" : "Great job!";
    if (score >= 50) return "Keep studying!";
    return "Keep going – practice makes perfect!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass border border-border rounded-2xl overflow-hidden"
    >
      {/* Score header */}
      <div
        className={cn(
          "flex flex-col items-center gap-3 px-6 py-8",
          passed ? "bg-emerald-500/[0.05]" : "bg-rose-500/[0.05]"
        )}
      >
        <div className="text-5xl">{getEmoji()}</div>
        <div className="text-center">
          <p className="text-3xl font-bold tabular-nums text-foreground">{score}%</p>
          <p
            className={cn(
              "text-sm font-medium mt-1",
              passed ? "text-emerald-400" : "text-rose-400"
            )}
          >
            {getMessage()}
          </p>
        </div>

        {mode === "exam" && (
          <div
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold border",
              passed
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-rose-500/15 text-rose-400 border-rose-500/30"
            )}
          >
            {passed ? "PASSED" : "NOT PASSED"} — Passing score: 67%
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-y border-border">
        <StatBox label="Correct" value={correct} color="text-emerald-400" />
        <StatBox label="Incorrect" value={incorrect} color="text-rose-400" />
        <StatBox label="Total" value={total} color="text-foreground" />
      </div>

      {/* Score bar */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Score</span>
          <span className="tabular-nums">{correct}/{total}</span>
        </div>
        <div className="h-2 bg-foreground/[0.07] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              passed ? "bg-emerald-500" : "bg-rose-500"
            )}
          />
        </div>
        {mode === "exam" && (
          <div
            className="w-px h-4 bg-amber-400/60 absolute"
            style={{ left: "67%" }}
            aria-label="Passing threshold: 67%"
          />
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 flex flex-col gap-2">
        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/15 border border-primary/25 text-primary text-sm font-medium hover:bg-primary/25 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/focus"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-foreground/[0.05] border border-border text-sm text-muted-foreground hover:text-foreground transition-all active:scale-95"
          >
            <Target className="w-4 h-4" />
            Focus Mode
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-foreground/[0.05] border border-border text-sm text-muted-foreground hover:text-foreground transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center py-4 gap-1">
      <span className={cn("text-2xl font-bold tabular-nums", color)}>{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
