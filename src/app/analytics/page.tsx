"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Target, Flame, Calendar, Award } from "lucide-react";
import { useProgressStore } from "@/store/progress";
import { Topic } from "@/types";
import { cn } from "@/lib/utils";
import questionsData from "@/data/questions.json";

const TOPIC_CONFIG: Record<Topic, { label: string; color: string; bg: string; border: string }> = {
  politik: {
    label: "Politik",
    color: "text-blue-400",
    bg: "bg-blue-500",
    border: "border-blue-500/30",
  },
  geschichte: {
    label: "Geschichte",
    color: "text-amber-400",
    bg: "bg-amber-500",
    border: "border-amber-500/30",
  },
  gesellschaft: {
    label: "Gesellschaft",
    color: "text-purple-400",
    bg: "bg-purple-500",
    border: "border-purple-500/30",
  },
  staat: {
    label: "Staat",
    color: "text-emerald-400",
    bg: "bg-emerald-500",
    border: "border-emerald-500/30",
  },
};

// Build heatmap data: 300 general questions arranged in a grid
const general = (questionsData as { general: { id: number; topic: Topic }[] }).general;

export default function AnalyticsPage() {
  const {
    totalAttempts,
    correctAnswers,
    incorrectAnswers,
    topicStats,
    streak,
    incorrectQuestionIds,
    masteredQuestionIds,
  } = useProgressStore();

  const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
  const topics: Topic[] = ["politik", "geschichte", "gesellschaft", "staat"];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center glow-blue">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-xs text-muted-foreground">Knowledge heatmap & performance</p>
          </div>
        </div>
      </header>

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<TrendingUp className="w-4 h-4 text-primary" />}
          label="Overall Accuracy"
          value={`${accuracy}%`}
          sub={`${correctAnswers} correct of ${totalAttempts}`}
          color="text-primary"
          bar={accuracy}
          barColor="bg-primary"
        />
        <StatCard
          icon={<Flame className="w-4 h-4 text-amber-400" />}
          label="Study Streak"
          value={`${streak} days`}
          sub="Keep it up!"
          color="text-amber-400"
          glow={streak > 0}
        />
        <StatCard
          icon={<Target className="w-4 h-4 text-rose-400" />}
          label="Need Review"
          value={incorrectQuestionIds.length.toString()}
          sub="in Focus Mode"
          color="text-rose-400"
        />
        <StatCard
          icon={<Award className="w-4 h-4 text-emerald-400" />}
          label="Mastered"
          value={masteredQuestionIds.length.toString()}
          sub="questions"
          color="text-emerald-400"
        />
      </div>

      {/* Topic breakdown */}
      <div className="glass border border-white/[0.08] rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Topic Performance</h2>
        <div className="space-y-4">
          {topics.map((topic) => {
            const stat = topicStats[topic];
            const cfg = TOPIC_CONFIG[topic];
            return (
              <div key={topic}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={cn("text-xs font-medium", cfg.color)}>{cfg.label}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
                    <span className="text-emerald-400">{stat.correct}</span>
                    <span>/</span>
                    <span>{stat.total}</span>
                    <span className="text-foreground font-semibold ml-1">{stat.accuracy}%</span>
                  </div>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.accuracy}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn("h-full rounded-full", cfg.bg)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Knowledge Heatmap */}
      <div className="glass border border-white/[0.08] rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-1">Knowledge Heatmap</h2>
        <p className="text-xs text-muted-foreground mb-4">300 general questions — color shows status</p>

        <div className="flex flex-wrap gap-1">
          {general.map((q) => {
            const isIncorrect = incorrectQuestionIds.includes(q.id);
            const isMastered = masteredQuestionIds.includes(q.id);
            const cfg = TOPIC_CONFIG[q.topic];

            return (
              <div
                key={q.id}
                className="heatmap-cell w-4 h-4"
                style={{
                  background: isMastered
                    ? "rgb(16,185,129)"
                    : isIncorrect
                    ? "rgb(244,63,94)"
                    : "rgba(255,255,255,0.07)",
                  opacity: isMastered || isIncorrect ? 1 : 0.5,
                }}
                title={`Q${q.id} • ${cfg.label}${isMastered ? " • Mastered" : isIncorrect ? " • Needs review" : ""}`}
                aria-label={`Question ${q.id}`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          {[
            { color: "bg-emerald-500", label: "Mastered" },
            { color: "bg-rose-500", label: "Needs review" },
            { color: "bg-white/10", label: "Not attempted" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={cn("w-3 h-3 rounded-sm", l.color)} />
              <span className="text-[10px] text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent performance graph placeholder */}
      {totalAttempts === 0 && (
        <div className="glass border border-white/[0.08] rounded-2xl p-8 text-center">
          <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No data yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start practicing to see your performance analytics here.
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  bar,
  barColor,
  glow,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
  bar?: number;
  barColor?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass border border-white/[0.08] rounded-xl p-4 flex flex-col gap-2",
        glow && "pulse-amber"
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
      <p className={cn("text-xl font-bold tabular-nums", color)}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
      {bar !== undefined && barColor && (
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${bar}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn("h-full rounded-full", barColor)}
          />
        </div>
      )}
    </div>
  );
}
