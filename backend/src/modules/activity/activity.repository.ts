import { ActivityType, Prisma } from "@prisma/client";

import { prisma } from "../../database/prisma.js";
import type { CreateActivityInput, CreateWaterLogInput, CreateWorkoutInput, SetOffDayInput } from "./activity.types.js";

export const activityRepository = {
  getDay(userId: string, date: Date) {
    return prisma.$transaction(async (tx) => {
      const dailyLog = await getOrCreateDailyLog(tx, userId, date);
      const [activities, workouts, waterLogs] = await Promise.all([
        tx.activityEntry.findMany({ where: { userId, date }, orderBy: { createdAt: "asc" } }),
        tx.workoutSession.findMany({ where: { userId, date }, orderBy: { createdAt: "asc" } }),
        tx.waterLog.findMany({ where: { userId, date }, orderBy: { createdAt: "asc" } })
      ]);

      return { dailyLog, activities, workouts, waterLogs };
    });
  },

  createActivity(userId: string, input: CreateActivityInput) {
    return prisma.$transaction(async (tx) => {
      const dailyLog = await getOrCreateDailyLog(tx, userId, input.date);
      const activity = await tx.activityEntry.create({
        data: {
          userId,
          dailyLogId: dailyLog.id,
          date: input.date,
          activityType: input.activityType,
          steps: input.steps ?? 0,
          distanceKm: input.distanceKm ?? 0,
          durationMinutes: input.durationMinutes ?? 0,
          caloriesBurned: input.caloriesBurned ?? 0,
          note: input.note
        }
      });
      const totals = await recalculateDailyActivityTotals(tx, dailyLog.id);

      return { activity, dailyLog: totals };
    });
  },

  deleteActivity(userId: string, activityId: string) {
    return prisma.$transaction(async (tx) => {
      const activity = await tx.activityEntry.findFirst({ where: { id: activityId, userId } });

      if (!activity) {
        return null;
      }

      await tx.activityEntry.delete({ where: { id: activityId } });
      const dailyLog = await recalculateDailyActivityTotals(tx, activity.dailyLogId);

      return { dailyLog };
    });
  },

  setOffDay(userId: string, input: SetOffDayInput) {
    return prisma.$transaction(async (tx) => {
      const dailyLog = await getOrCreateDailyLog(tx, userId, input.date);

      return tx.dailyLog.update({
        where: { id: dailyLog.id },
        data: {
          isOffDay: input.isOffDay,
          note: input.note
        }
      });
    });
  },

  createWorkout(userId: string, input: CreateWorkoutInput) {
    return prisma.$transaction(async (tx) => {
      const dailyLog = await getOrCreateDailyLog(tx, userId, input.date);
      const workout = await tx.workoutSession.create({
        data: {
          userId,
          dailyLogId: dailyLog.id,
          date: input.date,
          title: input.title,
          workoutType: input.workoutType,
          muscleGroups: input.muscleGroups,
          durationMinutes: input.durationMinutes,
          caloriesBurned: input.caloriesBurned ?? 0,
          intensity: input.intensity,
          note: input.note
        }
      });
      const totals = await recalculateDailyActivityTotals(tx, dailyLog.id);

      return { workout, dailyLog: totals };
    });
  },

  deleteWorkout(userId: string, workoutId: string) {
    return prisma.$transaction(async (tx) => {
      const workout = await tx.workoutSession.findFirst({ where: { id: workoutId, userId } });

      if (!workout) {
        return null;
      }

      await tx.workoutSession.delete({ where: { id: workoutId } });
      const dailyLog = await recalculateDailyActivityTotals(tx, workout.dailyLogId);

      return { dailyLog };
    });
  },

  createWaterLog(userId: string, input: CreateWaterLogInput) {
    return prisma.$transaction(async (tx) => {
      const dailyLog = await getOrCreateDailyLog(tx, userId, input.date);
      const waterLog = await tx.waterLog.create({
        data: {
          userId,
          dailyLogId: dailyLog.id,
          date: input.date,
          amountMl: input.amountMl
        }
      });
      const totals = await recalculateDailyActivityTotals(tx, dailyLog.id);

      return { waterLog, dailyLog: totals };
    });
  },

  deleteWaterLog(userId: string, waterLogId: string) {
    return prisma.$transaction(async (tx) => {
      const waterLog = await tx.waterLog.findFirst({ where: { id: waterLogId, userId } });

      if (!waterLog) {
        return null;
      }

      await tx.waterLog.delete({ where: { id: waterLogId } });
      const dailyLog = await recalculateDailyActivityTotals(tx, waterLog.dailyLogId);

      return { dailyLog };
    });
  }
};

async function getOrCreateDailyLog(tx: Prisma.TransactionClient, userId: string, date: Date) {
  return tx.dailyLog.upsert({
    where: { userId_date: { userId, date } },
    update: {},
    create: { userId, date }
  });
}

async function recalculateDailyActivityTotals(tx: Prisma.TransactionClient, dailyLogId: string) {
  const [activitySum, workoutSum, waterSum] = await Promise.all([
    tx.activityEntry.aggregate({
      where: { dailyLogId },
      _sum: { steps: true, distanceKm: true, durationMinutes: true, caloriesBurned: true }
    }),
    tx.workoutSession.aggregate({
      where: { dailyLogId },
      _sum: { durationMinutes: true, caloriesBurned: true },
      _count: { id: true }
    }),
    tx.waterLog.aggregate({
      where: { dailyLogId },
      _sum: { amountMl: true }
    })
  ]);

  const runDistance = await sumDistanceByType(tx, dailyLogId, ActivityType.RUN);
  const walkDistance = await sumDistanceByType(tx, dailyLogId, ActivityType.WALK);
  const activityWorkoutMinutes = await sumDurationByType(tx, dailyLogId, ActivityType.WORKOUT);
  const workoutMinutes = (workoutSum._sum.durationMinutes ?? 0) + activityWorkoutMinutes;
  const burnedCalories = (activitySum._sum.caloriesBurned ?? 0) + (workoutSum._sum.caloriesBurned ?? 0);

  return tx.dailyLog.update({
    where: { id: dailyLogId },
    data: {
      totalSteps: activitySum._sum.steps ?? 0,
      totalRunKm: runDistance,
      totalWalkKm: walkDistance,
      totalWorkoutMinutes: workoutMinutes,
      totalBurnedCalories: burnedCalories,
      waterMl: waterSum._sum.amountMl ?? 0,
      isWorkoutDay: workoutMinutes > 0 || workoutSum._count.id > 0
    }
  });
}

async function sumDistanceByType(tx: Prisma.TransactionClient, dailyLogId: string, activityType: ActivityType) {
  const aggregate = await tx.activityEntry.aggregate({
    where: { dailyLogId, activityType },
    _sum: { distanceKm: true }
  });

  return aggregate._sum.distanceKm ?? 0;
}

async function sumDurationByType(tx: Prisma.TransactionClient, dailyLogId: string, activityType: ActivityType) {
  const aggregate = await tx.activityEntry.aggregate({
    where: { dailyLogId, activityType },
    _sum: { durationMinutes: true }
  });

  return aggregate._sum.durationMinutes ?? 0;
}
