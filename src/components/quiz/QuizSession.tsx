"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Question, PracticeMode } from "@/types";
import { QuizCard } from "./QuizCard";
import { SessionSummary } from "./SessionSummary";
import { useProgressStore } from "@/store/progress";

interface QuizSessionProps {
  questions: Question[];
  mode: PracticeMode;
  timeLimit?: number; // seconds, for exam mode
}

export function QuizSession({ questions, mode, timeLimit }: QuizSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);
  const { recordAttempt, updateStreak } = useProgressStore();

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = useCallback(
    (selectedIndex: number, isCorrect: boolean) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedIndex }));
      recordAttempt(currentQuestion, selectedIndex, mode);
    },
    [currentQuestion, mode, recordAttempt]
  );

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      updateStreak();
      setDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [isLastQuestion, updateStreak]);

  const handleRestart = () => {
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
      <SessionSummary
        total={questions.length}
        correct={correct}
        mode={mode}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <QuizCard
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </AnimatePresence>
  );
}
