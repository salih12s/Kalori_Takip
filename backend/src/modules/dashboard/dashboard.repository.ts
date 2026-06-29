import { prisma } from "../../database/prisma.js";

export const dashboardRepository = {
  getOrCreateTodayData(userId: string, date: Date) {
    return prisma.$transaction(async (tx) => {
      const dailyLog = await tx.dailyLog.upsert({
        where: { userId_date: { userId, date } },
        update: {},
        create: { userId, date }
      });

      const existingProfile = await tx.profile.findUnique({
        where: { userId }
      });
      const profile = existingProfile ?? (await tx.profile.create({ data: { userId } }));

      const goal = await tx.userGoal.findFirst({
        where: { userId, isActive: true },
        orderBy: { createdAt: "desc" }
      });

      const meals = await tx.meal.findMany({
        where: { userId, date },
        include: { entries: true }
      });

      const activityEntryCount = await tx.activityEntry.count({
        where: { userId, date }
      });

      return { dailyLog, profile, goal, meals, activityEntryCount };
    });
  },

  getWeeklyData(userId: string, startDate: Date, endDate: Date) {
    return prisma.$transaction(async (tx) => {
      const goal = await tx.userGoal.findFirst({
        where: { userId, isActive: true },
        orderBy: { createdAt: "desc" }
      });

      const dailyLogs = await tx.dailyLog.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          meals: { include: { entries: true } },
          activityEntries: true
        },
        orderBy: { date: "asc" }
      });

      return { goal, dailyLogs };
    });
  }
};
