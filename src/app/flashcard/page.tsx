"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap, ChevronLeft, ChevronRight, Map } from "lucide-react";
import { useStateQuestions, useAllStates } from "@/hooks/useQuestions";
import { useProgressStore } from "@/store/progress";
import { FlipCard } from "@/components/quiz/FlipCard";
import { cn } from "@/lib/utils";

export default function FlashcardPage() {
  const states = useAllStates();
  const { selectedState, setSelectedState } = useProgressStore();
  const questions = useStateQuestions(selectedState);
  const [index, setIndex] = useState(0);
  const [showPicker, setShowPicker] = useState(false);

  const current = questions[index];
  const total = questions.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center glow-blue">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Flashcards</h1>
              <p className="text-xs text-muted-foreground">Rapid-fire state questions</p>
            </div>
          </div>
          <button
            onClick={() => setShowPicker((s) => !s)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-white/[0.08] text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Map className="w-3.5 h-3.5" />
            {selectedState}
          </button>
        </div>
      </header>

      {/* State picker overlay */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 glass border border-white/[0.08] rounded-xl p-4"
          >
            <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto">
              {states.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedState(s);
                    setIndex(0);
                    setShowPicker(false);
                  }}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-xs text-left transition-all",
                    selectedState === s
                      ? "bg-primary/15 border-primary/30 text-primary"
                      : "bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 mb-6">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "bg-primary w-6" : "bg-white/20 w-1.5 hover:bg-white/40"
            )}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>

      {/* Card counter */}
      <p className="text-center text-xs text-muted-foreground mb-4 tabular-nums">
        {index + 1} / {total}
      </p>

      {/* Flip card */}
      {current && (
        <div className="min-h-80">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
            >
              <FlipCard
                question={current}
                onNext={next}
                className="w-full"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prev}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/[0.08] text-sm text-muted-foreground hover:text-foreground transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <span className="text-xs text-muted-foreground">Tap card to flip</span>
        <button
          onClick={next}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/[0.08] text-sm text-muted-foreground hover:text-foreground transition-all active:scale-95"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
