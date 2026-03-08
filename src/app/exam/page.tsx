"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { usePracticeQuestions, useAllStates } from "@/hooks/useQuestions";
import { useProgressStore } from "@/store/progress";
import { QuizCard } from "@/components/quiz/QuizCard";
import { SessionSummary } from "@/components/quiz/SessionSummary";
import { ExamTimer } from "@/components/quiz/ExamTimer";
import { cn } from "@/lib/utils";

const EXAM_DURATION = 60 * 60; // 60 minutes in seconds

export default function ExamPage() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const states = useAllStates();
  const { selectedState, setSelectedState, recordAttempt, updateStreak } = useProgressStore();
  const questions = usePracticeQuestions("exam");

  const timeExpired = timeLeft <= 0;
  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  // Timer
  useEffect(() => {
    if (!started || done) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [started, done]);

  const handleAnswer = useCallback((selectedIndex: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedIndex }));
    recordAttempt(currentQuestion, selectedIndex, "exam");
  }, [currentQuestion, recordAttempt]);

  const handleNext = useCallback(() => {
    if (isLast || timeExpired) {
      clearInterval(timerRef.current!);
      updateStreak();
      setDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [isLast, timeExpired, updateStreak]);

  const handleRestart = () => {
    setStarted(false);
    setTimeLeft(EXAM_DURATION);
    setCurrentIndex(0);
    setAnswers({});
    setDone(false);
  };


  if (done) {
    const correct = Object.entries(answers).filter(([qId, ans]) => {
      const q = questions.find((q) => q.id === Number(qId));
      return q && ans === q.correctAnswer;
    }).length;
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={handleRestart} className="text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
          ← Back to Exam
        </button>
        <SessionSummary total={questions.length} correct={correct} mode="exam" onRestart={handleRestart} />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Exam Simulation</h1>
              <p className="text-xs text-muted-foreground">Official format · 33 questions · 60 minutes</p>
            </div>
          </div>
        </header>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Questions", value: "33", sub: "30 general + 3 state" },
            { label: "Time", value: "60 min", sub: "Counts down" },
            { label: "Pass score", value: "67%", sub: "22/33 correct" },
          ].map((item) => (
            <div key={item.label} className="glass border border-border rounded-xl px-3 py-4 text-center">
              <p className="text-lg font-bold text-foreground tabular-nums">{item.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* State selector */}
        <div className="glass border border-border rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-muted-foreground mb-3">State-specific questions for:</p>
          <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto">
            {states.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedState(s)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-xs text-left transition-all",
                  selectedState === s
                    ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                    : "bg-foreground/[0.02] border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setStarted(true)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all"
        >
          <Trophy className="w-5 h-5" />
          Start Exam
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Exam header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-foreground">Exam Mode</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
        <ExamTimer timeLeft={timeLeft} totalTime={EXAM_DURATION} />
      </div>

      <AnimatePresence mode="wait">
        {currentQuestion && (
          <QuizCard
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            onAnswer={(idx) => handleAnswer(idx)}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
