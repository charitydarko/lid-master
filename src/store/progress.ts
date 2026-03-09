import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Question, QuestionAttempt, Topic, TopicStats, ExamSession, UserProgress, PracticeMode } from "@/types";

interface ProgressStore extends UserProgress {
  // Actions
  recordAttempt: (
    question: Question,
    selectedAnswer: number,
    mode: PracticeMode
  ) => void;
  setSelectedState: (state: string) => void;
  resetProgress: () => void;
  markMastered: (questionId: number) => void;
  addSession: (session: ExamSession) => void;
  updateStreak: () => void;
  getQuestionAccuracy: (questionId: number) => number | null;
}

const defaultTopicStats = (topic: Topic): TopicStats => ({
  topic,
  total: 0,
  correct: 0,
  incorrect: 0,
  skipped: 0,
  accuracy: 0,
});

const defaultProgress: UserProgress = {
  totalAttempts: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  skippedQuestions: 0,
  incorrectQuestionIds: [],
  masteredQuestionIds: [],
  topicStats: {
    politik: defaultTopicStats("politik"),
    geschichte: defaultTopicStats("geschichte"),
    gesellschaft: defaultTopicStats("gesellschaft"),
    staat: defaultTopicStats("staat"),
  },
  recentSessions: [],
  selectedState: "Nordrhein-Westfalen",
  streak: 0,
};

// Per-question attempt history stored separately for performance
const questionAttempts: Record<number, QuestionAttempt[]> = {};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...defaultProgress,

      recordAttempt: (question, selectedAnswer, mode) => {
        const isCorrect = selectedAnswer === question.correctAnswer;
        const attempt: QuestionAttempt = {
          questionId: question.id,
          selectedAnswer,
          isCorrect,
          timestamp: Date.now(),
          mode,
        };

        // Store attempt history
        if (!questionAttempts[question.id]) {
          questionAttempts[question.id] = [];
        }
        questionAttempts[question.id].push(attempt);

        set((state) => {
          const topic = question.topic;
          const topicStat = { ...state.topicStats[topic] };
          topicStat.total += 1;
          if (isCorrect) {
            topicStat.correct += 1;
          } else {
            topicStat.incorrect += 1;
          }
          topicStat.accuracy =
            topicStat.total > 0
              ? Math.round((topicStat.correct / topicStat.total) * 100)
              : 0;

          const incorrectIds = isCorrect
            ? state.incorrectQuestionIds
            : Array.from(new Set([...state.incorrectQuestionIds, question.id]));

          return {
            totalAttempts: state.totalAttempts + 1,
            correctAnswers: state.correctAnswers + (isCorrect ? 1 : 0),
            incorrectAnswers: state.incorrectAnswers + (isCorrect ? 0 : 1),
            incorrectQuestionIds: incorrectIds,
            topicStats: {
              ...state.topicStats,
              [topic]: topicStat,
            },
            lastStudied: Date.now(),
          };
        });
      },

      setSelectedState: (stateName) => {
        set({ selectedState: stateName });
      },

      markMastered: (questionId) => {
        set((state) => ({
          masteredQuestionIds: Array.from(
            new Set([...state.masteredQuestionIds, questionId])
          ),
          incorrectQuestionIds: state.incorrectQuestionIds.filter(
            (id) => id !== questionId
          ),
        }));
      },

      addSession: (session) => {
        set((state) => ({
          recentSessions: [session, ...state.recentSessions].slice(0, 20),
        }));
      },

      updateStreak: () => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => {
          if (state.lastStreakDate === today) return {};
          const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .split("T")[0];
          const newStreak =
            state.lastStreakDate === yesterday ? state.streak + 1 : 1;
          return { streak: newStreak, lastStreakDate: today };
        });
      },

      getQuestionAccuracy: (questionId) => {
        const attempts = questionAttempts[questionId];
        if (!attempts || attempts.length === 0) return null;
        const correct = attempts.filter((a) => a.isCorrect).length;
        return Math.round((correct / attempts.length) * 100);
      },

      resetProgress: () => {
        Object.keys(questionAttempts).forEach(
          (k) => delete questionAttempts[Number(k)]
        );
        set({ ...defaultProgress });
      },
    }),
    {
      name: "lid-master-progress",
      partialize: (state) => ({
        totalAttempts: state.totalAttempts,
        correctAnswers: state.correctAnswers,
        incorrectAnswers: state.incorrectAnswers,
        skippedQuestions: state.skippedQuestions,
        incorrectQuestionIds: state.incorrectQuestionIds,
        masteredQuestionIds: state.masteredQuestionIds,
        topicStats: state.topicStats,
        recentSessions: state.recentSessions,
        selectedState: state.selectedState,
        streak: state.streak,
        lastStreakDate: state.lastStreakDate,
        lastStudied: state.lastStudied,
      }),
    }
  )
);
