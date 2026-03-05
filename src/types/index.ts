export type Topic = "politik" | "geschichte" | "gesellschaft" | "staat";
export type QuestionType = "general" | "state";
export type PracticeMode =
  | "topic"
  | "random"
  | "state"
  | "exam"
  | "flashcard"
  | "focus";

export interface Question {
  id: number;
  type: QuestionType;
  topic: Topic;
  state?: string;
  question: string;
  question_en: string;
  options: string[];
  options_en: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuestionAttempt {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timestamp: number;
  mode: PracticeMode;
}

export interface TopicStats {
  topic: Topic;
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
}

export interface ExamSession {
  id: string;
  startTime: number;
  endTime?: number;
  questions: Question[];
  answers: Record<number, number>;
  score?: number;
  passed?: boolean;
  state?: string;
}

export interface UserProgress {
  totalAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  incorrectQuestionIds: number[];
  masteredQuestionIds: number[];
  topicStats: Record<Topic, TopicStats>;
  recentSessions: ExamSession[];
  selectedState: string;
  lastStudied?: number;
  streak: number;
  lastStreakDate?: string;
}

export interface GermanTerm {
  term: string;
  definition: string;
  definition_en: string;
}
