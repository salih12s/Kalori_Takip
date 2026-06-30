import { addDays, formatDateOnly, todayDateOnly } from "./date.js";

/** Minimal DailyLog shape needed to decide whether a day counts as active. */
export type StreakSignalLog = {
  date: Date;
  totalCalories: number;
  totalSteps: number;
  isWorkoutDay: boolean;
  isOffDay: boolean;
  waterMl: number;
  dailyScore: number;
};

function isActiveDay(log: StreakSignalLog): boolean {
  return (
    log.totalCalories > 0 ||
    log.totalSteps > 0 ||
    log.isWorkoutDay ||
    log.isOffDay ||
    log.waterMl > 0 ||
    log.dailyScore > 0
  );
}

/**
 * Streaks are derived only from existing DailyLog rows (none are created).
 * currentStreak counts consecutive active days ending today; longestStreak is
 * the longest active-day run across all available logs.
 */
export function computeStreaks(logs: StreakSignalLog[]): {
  currentStreak: number;
  longestStreak: number;
  activeDates: Set<string>;
} {
  const activeDates = new Set(logs.filter(isActiveDay).map((log) => formatDateOnly(log.date)));

  let currentStreak = 0;
  let cursor = todayDateOnly();
  while (activeDates.has(formatDateOnly(cursor))) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  let longestStreak = 0;
  let run = 0;
  let previousTime: number | null = null;
  for (const dateString of [...activeDates].sort()) {
    const time = new Date(`${dateString}T00:00:00.000Z`).getTime();
    run = previousTime !== null && time - previousTime === 86_400_000 ? run + 1 : 1;
    if (run > longestStreak) {
      longestStreak = run;
    }
    previousTime = time;
  }

  return { currentStreak, longestStreak, activeDates };
}

export function countActiveDaysInRange(
  activeDates: Set<string>,
  startDate: Date,
  endDate: Date
): number {
  let count = 0;
  for (let cursor = startDate; cursor.getTime() <= endDate.getTime(); cursor = addDays(cursor, 1)) {
    if (activeDates.has(formatDateOnly(cursor))) {
      count += 1;
    }
  }
  return count;
}
