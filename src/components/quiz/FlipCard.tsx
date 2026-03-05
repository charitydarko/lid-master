"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Question } from "@/types";
import { SmartText } from "./SmartText";
import { Globe, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  question: Question;
  onNext?: () => void;
  className?: string;
}

export function FlipCard({ question, onNext, className }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped((f) => !f);

  const correctOption = question.options[question.correctAnswer];
  const correctOption_en = question.options_en[question.correctAnswer];

  return (
    <div
      className={cn("perspective-1000 cursor-pointer select-none", className)}
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? "Showing answer. Click to flip back." : "Click to reveal answer"}
      onKeyDown={(e) => e.key === "Enter" || e.key === " " ? handleFlip() : undefined}
    >
      <motion.div
        className="relative w-full transform-style-3d"
        style={{ minHeight: "320px" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.55, type: "spring", stiffness: 80, damping: 15 }}
      >
        {/* FRONT — German question */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full glass border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between hover:border-primary/20 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <TopicBadge topic={question.topic} />
                <span className="text-xs text-muted-foreground">#{question.id}</span>
              </div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                <RotateCcw className="w-3 h-3" />
                Tap to flip
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center py-6">
              <p className="text-lg md:text-xl font-semibold text-foreground text-center leading-relaxed">
                <SmartText text={question.question} />
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground italic">
                {question.question_en}
              </p>
            </div>
          </div>
        </div>

        {/* BACK — English + correct answer */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="h-full glass border border-emerald-500/25 rounded-2xl p-6 flex flex-col justify-between bg-emerald-500/[0.03]">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Correct Answer</span>
              <span className="ml-auto text-xs text-muted-foreground">#{question.id}</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-4">
              {/* Correct option */}
              <div className="w-full px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-center">
                <p className="text-base font-semibold text-emerald-300">
                  {correctOption}
                </p>
                {correctOption_en && correctOption_en !== `Option ${question.correctAnswer + 1}` && (
                  <p className="text-xs text-emerald-300/60 mt-1 italic">
                    {correctOption_en}
                  </p>
                )}
              </div>

              {/* Explanation */}
              <div className="w-full">
                <p className="text-xs text-muted-foreground leading-relaxed text-center">
                  {question.explanation}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
                onNext?.();
              }}
              className="w-full py-2 rounded-xl bg-primary/20 border border-primary/25 text-primary text-sm font-medium hover:bg-primary/30 transition-all active:scale-95"
            >
              Next Card →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TopicBadge({ topic }: { topic: string }) {
  const config: Record<string, { label: string; color: string }> = {
    politik: { label: "Politik", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    geschichte: { label: "Geschichte", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
    gesellschaft: { label: "Gesellschaft", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
    staat: { label: "Staat", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  };
  const c = config[topic] ?? config.politik;
  return (
    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", c.color)}>
      {c.label}
    </span>
  );
}
