"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, History, Users, Shuffle, Map, ChevronRight, GraduationCap
} from "lucide-react";
import { usePracticeQuestions, useAllStates } from "@/hooks/useQuestions";
import { useProgressStore } from "@/store/progress";
import { QuizSession } from "@/components/quiz/QuizSession";
import { Topic, PracticeMode } from "@/types";
import { cn } from "@/lib/utils";

type ActiveMode = "topic" | "random" | "state" | null;
type SelectedTopic = Topic | "all";

import questionsData from "@/data/questions.json";

const _general = questionsData.general as { topic: string }[];
const _topicCounts = _general.reduce<Record<string, number>>((acc, q) => {
  acc[q.topic] = (acc[q.topic] || 0) + 1;
  return acc;
}, {});

const TOPICS: { id: SelectedTopic; label: string; icon: typeof BookOpen; color: string; count: number }[] = [
  { id: "all", label: "All Topics", icon: GraduationCap, color: "text-blue-500 dark:text-blue-400", count: _general.length },
  { id: "politik", label: "Politik", icon: BookOpen, color: "text-blue-500 dark:text-blue-400", count: _topicCounts["politik"] ?? 0 },
  { id: "geschichte", label: "Geschichte", icon: History, color: "text-amber-500 dark:text-amber-400", count: _topicCounts["geschichte"] ?? 0 },
  { id: "gesellschaft", label: "Gesellschaft", icon: Users, color: "text-purple-500 dark:text-purple-400", count: _topicCounts["gesellschaft"] ?? 0 },
];

export default function PracticePage() {
  const [activeMode, setActiveMode] = useState<ActiveMode>(null);
  const [selectedTopic, setSelectedTopic] = useState<SelectedTopic>("all");
  const [startSession, setStartSession] = useState(false);
  const states = useAllStates();
  const { selectedState, setSelectedState } = useProgressStore();

  const practiceMode: PracticeMode =
    activeMode === "topic" ? "topic" : activeMode === "random" ? "random" : "state";

  const questions = usePracticeQuestions(practiceMode);
  const filteredQuestions =
    selectedTopic !== "all" && activeMode === "topic"
      ? questions.filter((q) => q.topic === selectedTopic)
      : questions;

  if (startSession && filteredQuestions.length > 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => setStartSession(false)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          ← Back to Practice
        </button>
        <QuizSession questions={filteredQuestions} mode={practiceMode} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Practice</h1>
        <p className="text-sm text-muted-foreground mt-1">
          300 general + 10 state-specific questions
        </p>
      </header>

      {/* Mode Selection */}
      <div className="space-y-3 mb-8">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
          Practice Mode
        </p>

        <ModeCard
          active={activeMode === "topic"}
          onClick={() => setActiveMode(activeMode === "topic" ? null : "topic")}
          icon={<BookOpen className="w-5 h-5" />}
          title="Topic-wise"
          description="Study by Politik, Geschichte, or Gesellschaft"
          color="blue"
        />

        <ModeCard
          active={activeMode === "random"}
          onClick={() => setActiveMode(activeMode === "random" ? null : "random")}
          icon={<Shuffle className="w-5 h-5" />}
          title="Random Mix"
          description="All 310 questions in random order"
          color="purple"
        />

        <ModeCard
          active={activeMode === "state"}
          onClick={() => setActiveMode(activeMode === "state" ? null : "state")}
          icon={<Map className="w-5 h-5" />}
          title="State-Specific"
          description="10 questions for your Bundesland"
          color="emerald"
        />
      </div>

      {/* Topic filter */}
      <AnimatePresence>
        {activeMode === "topic" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">
              Select Topic
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  className={cn(
                    "flex flex-col gap-1.5 px-4 py-3 rounded-xl border text-left transition-all",
                    selectedTopic === t.id
                      ? "bg-primary/15 border-primary/30 text-primary"
                      : "bg-foreground/[0.04] border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                  )}
                >
                  <t.icon className={cn("w-4 h-4", selectedTopic === t.id ? "text-primary" : t.color)} />
                  <span className="text-sm font-medium">{t.label}</span>
                  <span className="text-[10px] text-muted-foreground">{t.count} questions</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* State picker */}
      <AnimatePresence>
        {activeMode === "state" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">
              Select Bundesland
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {states.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedState(s)}
                  className={cn(
                    "px-3 py-2.5 rounded-xl border text-xs text-left transition-all",
                    selectedState === s
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-foreground/[0.04] border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start button */}
      <AnimatePresence>
        {activeMode && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => setStartSession(true)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all active:scale-95 glow-blue"
          >
            Start Practicing
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModeCard({
  active,
  onClick,
  icon,
  title,
  description,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "purple" | "emerald";
}) {
  const activeStyles = {
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-4 px-4 py-4 rounded-xl border transition-all w-full text-left",
        active
          ? activeStyles[color]
          : "bg-foreground/[0.04] border-border hover:border-foreground/20"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
        active ? "bg-foreground/10" : "bg-foreground/[0.06]"
      )}>
        <span className={cn(active ? activeStyles[color].split(" ")[2] : "text-muted-foreground")}>
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <ChevronRight className={cn(
        "w-4 h-4 shrink-0 transition-all text-muted-foreground",
        active && "rotate-90"
      )} />
    </button>
  );
}
