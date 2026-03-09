"use client";

import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Target, BookCheck, Inbox } from "lucide-react";
import { usePracticeQuestions } from "@/hooks/useQuestions";
import { useProgressStore } from "@/store/progress";
import { QuizCard } from "@/components/quiz/QuizCard";
import { SessionSummary } from "@/components/quiz/SessionSummary";

export default function FocusPage() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  const { incorrectQuestionIds, recordAttempt, updateStreak } = useProgressStore();
  const focusQuestions = usePracticeQuestions("focus");

  // Snapshot questions when the session starts so that answering correctly
  // (which removes IDs from incorrectQuestionIds and re-runs useMemo) doesn't
  // reshuffle the list or drop questions out from under the current index.
  const sessionQuestionsRef = useRef(focusQuestions);
  const questions = started ? sessionQuestionsRef.current : focusQuestions;

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleAnswer = (idx: number) => {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: idx }));
    recordAttempt(current, idx, "focus");
  };

  const handleNext = () => {
    if (isLast) {
      updateStreak();
      setDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentIndex(0);
    setAnswers({});
    setDone(false);
    // Clear snapshot so the landing screen shows the live (updated) list
    sessionQuestionsRef.current = focusQuestions;
  };

  if (done) {
    const correct = Object.entries(answers).filter(([qId, ans]) => {
      const q = questions.find((q) => q.id === Number(qId));
      return q && ans === q.correctAnswer;
    }).length;
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={handleRestart} className="text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
          ← Back to Focus Mode
        </button>
        <SessionSummary total={questions.length} correct={correct} mode="focus" onRestart={handleRestart} />
      </div>
    );
  }

  if (!started || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center">
              <Target className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Focus Mode</h1>
              <p className="text-xs text-muted-foreground">Retry your incorrect answers</p>
            </div>
          </div>
        </header>

        {incorrectQuestionIds.length === 0 ? (
          <div className="glass border border-border rounded-2xl p-10 flex flex-col items-center gap-4 text-center">
            <BookCheck className="w-12 h-12 text-emerald-400" />
            <div>
              <p className="text-lg font-semibold text-foreground">No incorrect answers yet!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Practice some questions first to populate your focus queue.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="glass border border-rose-500/15 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Inbox className="w-5 h-5 text-rose-400" />
                <p className="text-sm font-medium text-foreground">
                  {incorrectQuestionIds.length} questions to review
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                These are questions you've answered incorrectly. Mastering them will improve your score significantly.
              </p>
            </div>

            <button
              onClick={() => {
                // Snapshot the current focus list before starting
                sessionQuestionsRef.current = focusQuestions;
                setStarted(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-400 transition-all active:scale-95"
            >
              <Target className="w-5 h-5" />
              Start Focus Session ({questions.length} Qs)
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={handleRestart}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        ← Back
      </button>
      <AnimatePresence mode="wait">
        {current && (
          <QuizCard
            key={current.id}
            question={current}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
