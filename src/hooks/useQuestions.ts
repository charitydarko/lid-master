import { useMemo } from "react";
import questionsData from "@/data/questions.json";
import { Question, Topic, PracticeMode } from "@/types";
import { useProgressStore } from "@/store/progress";

const allQuestions = questionsData as {
  metadata: { version: string; totalGeneral: number; states: string[] };
  general: Question[];
  states: Record<string, Question[]>;
};

export function useAllQuestions() {
  return useMemo(() => allQuestions.general, []);
}

export function useStateQuestions(stateName: string) {
  return useMemo(
    () => allQuestions.states[stateName] ?? [],
    [stateName]
  );
}

export function useAllStates() {
  return allQuestions.metadata.states;
}

export function useQuestionsByTopic(topic: Topic) {
  return useMemo(
    () => allQuestions.general.filter((q) => q.topic === topic),
    [topic]
  );
}

export function usePracticeQuestions(mode: PracticeMode, state?: string) {
  const { incorrectQuestionIds, selectedState } = useProgressStore();
  const targetState = state ?? selectedState;

  return useMemo(() => {
    switch (mode) {
      case "topic":
        return allQuestions.general;

      case "random": {
        const all = [...allQuestions.general];
        const stateQs = allQuestions.states[targetState] ?? [];
        return shuffle([...all, ...stateQs]);
      }

      case "state":
        return allQuestions.states[targetState] ?? [];

      case "exam": {
        // 30 random general + 3 state-specific
        const shuffledGeneral = shuffle([...allQuestions.general]).slice(0, 30);
        const stateQs = allQuestions.states[targetState] ?? [];
        const shuffledState = shuffle([...stateQs]).slice(0, 3);
        return shuffle([...shuffledGeneral, ...shuffledState]);
      }

      case "flashcard":
        return allQuestions.states[targetState] ?? [];

      case "focus": {
        const focusSet = allQuestions.general.filter((q) =>
          incorrectQuestionIds.includes(q.id)
        );
        const stateIncorrect = (allQuestions.states[targetState] ?? []).filter(
          (q) => incorrectQuestionIds.includes(q.id)
        );
        return shuffle([...focusSet, ...stateIncorrect]);
      }

      default:
        return allQuestions.general;
    }
  }, [mode, targetState, incorrectQuestionIds]);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
