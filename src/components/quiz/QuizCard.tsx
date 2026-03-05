"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/types";
import { SmartText } from "./SmartText";
import { CheckCircle2, XCircle, ChevronRight, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
  onNext: () => void;
  showFlipOption?: boolean;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
}: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const answered = selected !== null;
  const isCorrect = selected === question.correctAnswer;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    onAnswer(idx, idx === question.correctAnswer);
  };

  const handleNext = () => {
    setSelected(null);
    setShowExplanation(false);
    onNext();
  };

  const topicConfig: Record<string, { label: string; color: string; dot: string }> = {
    politik: { label: "Politik", color: "text-blue-400", dot: "bg-blue-400" },
    geschichte: { label: "Geschichte", color: "text-amber-400", dot: "bg-amber-400" },
    gesellschaft: { label: "Gesellschaft", color: "text-purple-400", dot: "bg-purple-400" },
    staat: { label: "Staat", color: "text-emerald-400", dot: "bg-emerald-400" },
  };
  const tc = topicConfig[question.topic] ?? topicConfig.politik;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <div className="glass border border-white/[0.08] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", tc.dot)} />
            <span className={cn("text-xs font-medium", tc.color)}>{tc.label}</span>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {questionNumber} / {totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-white/[0.04]">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="px-5 pt-5 pb-4">
          <p className="text-base md:text-lg font-semibold text-foreground leading-relaxed">
            <SmartText text={question.question} />
          </p>
          {question.question_en && question.question_en !== `Question ${question.id} (translation pending)` && (
            <p className="text-xs text-muted-foreground mt-2 italic">{question.question_en}</p>
          )}
        </div>

        {/* Options */}
        <div className="px-5 pb-5 space-y-2">
          {question.options.map((option, idx) => {
            const isSelected = selected === idx;
            const isCorrectOption = idx === question.correctAnswer;

            let optionClass = "option-btn";
            if (answered) {
              if (isCorrectOption) optionClass += " correct";
              else if (isSelected && !isCorrect) optionClass += " incorrect";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={cn(
                  optionClass,
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all",
                  "bg-white/[0.03] border border-white/[0.07]",
                  !answered && "hover:bg-primary/8",
                  answered && "cursor-default"
                )}
                aria-label={`Option ${idx + 1}: ${option}`}
              >
                {/* Letter badge */}
                <span
                  className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                    answered && isCorrectOption
                      ? "bg-emerald-500 text-white"
                      : answered && isSelected && !isCorrect
                      ? "bg-rose-500 text-white"
                      : "bg-white/[0.07] text-muted-foreground"
                  )}
                >
                  {["A", "B", "C", "D"][idx]}
                </span>

                <span className="flex-1 text-foreground">{option}</span>

                {answered && isCorrectOption && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {answered && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Post-answer section */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-white/[0.06]"
            >
              {/* Result banner */}
              <div
                className={cn(
                  "flex items-center gap-2 px-5 py-3",
                  isCorrect ? "bg-emerald-500/10" : "bg-rose-500/10"
                )}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-sm font-medium text-rose-400">
                      Incorrect – correct answer above
                    </span>
                  </>
                )}
              </div>

              {/* Explanation toggle */}
              <div className="px-5 py-3 space-y-3">
                <button
                  onClick={() => setShowExplanation((s) => !s)}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  {showExplanation ? "Hide" : "Show"} explanation
                </button>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-muted-foreground leading-relaxed"
                    >
                      {question.explanation}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/15 border border-primary/25 text-primary text-sm font-medium hover:bg-primary/25 transition-all active:scale-95"
                >
                  Next Question
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
