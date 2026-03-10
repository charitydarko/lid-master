/**
 * Permanent question groups A–E.
 * The 300 general questions are split into 5 fixed slices of 60 by their
 * position in questions.json — order never changes, so groups are stable
 * across app updates. Questions within each group are always served in the
 * same fixed order (no shuffle).
 */

import questionsData from "@/data/questions.json";
import type { Question } from "@/types";

export type GroupId = "A" | "B" | "C" | "D" | "E";

export interface QuestionGroup {
  id: GroupId;
  /** Human label shown in the UI */
  label: string;
  questions: Question[];
  /** Tailwind colour token used for accents */
  color: "blue" | "purple" | "amber" | "emerald" | "rose";
  activeClass: string;
  badgeClass: string;
  barClass: string;
}

const general = questionsData.general as Question[];
const SIZE = 60; // 300 / 5 = 60 exactly

export const QUESTION_GROUPS: QuestionGroup[] = [
  {
    id: "A",
    label: "Group A",
    questions: general.slice(0, SIZE),
    color: "blue",
    activeClass:
      "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
    badgeClass:
      "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30",
    barClass: "bg-blue-500",
  },
  {
    id: "B",
    label: "Group B",
    questions: general.slice(SIZE, SIZE * 2),
    color: "purple",
    activeClass:
      "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
    badgeClass:
      "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30",
    barClass: "bg-purple-500",
  },
  {
    id: "C",
    label: "Group C",
    questions: general.slice(SIZE * 2, SIZE * 3),
    color: "amber",
    activeClass:
      "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
    badgeClass:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
    barClass: "bg-amber-500",
  },
  {
    id: "D",
    label: "Group D",
    questions: general.slice(SIZE * 3, SIZE * 4),
    color: "emerald",
    activeClass:
      "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    badgeClass:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
    barClass: "bg-emerald-500",
  },
  {
    id: "E",
    label: "Group E",
    questions: general.slice(SIZE * 4),
    color: "rose",
    activeClass:
      "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
    badgeClass:
      "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30",
    barClass: "bg-rose-500",
  },
];

/** Derive per-group stats from persisted store arrays */
export function computeGroupStats(
  group: QuestionGroup,
  attemptedIds: number[],
  incorrectIds: number[]
): { attempted: number; correct: number; total: number; mastered: boolean } {
  const groupIdSet = new Set(group.questions.map((q) => q.id));
  const attempted = attemptedIds.filter((id) => groupIdSet.has(id));
  const correct = attempted.filter((id) => !incorrectIds.includes(id));
  const total = group.questions.length;
  // Mastered: ≥ 80% of group answered correctly AND ≥ 80% attempted
  const mastered =
    total > 0 &&
    attempted.length / total >= 0.8 &&
    correct.length / total >= 0.8;
  return { attempted: attempted.length, correct: correct.length, total, mastered };
}
