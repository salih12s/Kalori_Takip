import { MealType, Prisma } from "@prisma/client";

import { prisma } from "../../database/prisma.js";
import type { CreateFoodInput } from "./nutrition.types.js";

const mealTypes = [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER, MealType.SNACK];

type FoodEntrySnapshot = {
  foodId: string;
  foodNameSnapshot: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export const nutritionRepository = {
  searchFoods(query: string, normalizedQuery: string) {
    return prisma.food.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { name: { contains: normalizedQuery, mode: "insensitive" } },
          { aliases: { some: { alias: { contains: query, mode: "insensitive" } } } },
          { aliases: { some: { alias: { contains: normalizedQuery, mode: "insensitive" } } } }
        ]
      },
      include: { aliases: true },
      orderBy: { name: "asc" },
      take: 20
    });
  },

  createFood(userId: string, input: CreateFoodInput, normalizedAliases: string[]) {
    return prisma.food.create({
      data: {
        userId,
        name: input.name,
        servingSize: input.servingSize,
        servingUnit: input.servingUnit,
        calories: input.calories,
        protein: input.protein,
        carbs: input.carbs,
        fat: input.fat,
        source: "USER_CREATED",
        aliases: {
          create: normalizedAliases.map((alias) => ({ alias }))
        }
      },
      include: { aliases: true }
    });
  },

  findFoodById(foodId: string) {
    return prisma.food.findUnique({
      where: { id: foodId }
    });
  },

  getOrCreateDailyLogWithMeals(userId: string, date: Date) {
    return prisma.$transaction(async (tx) => {
      const dailyLog = await tx.dailyLog.upsert({
        where: { userId_date: { userId, date } },
        update: {},
        create: { userId, date }
      });

      for (const mealType of mealTypes) {
        await tx.meal.upsert({
          where: { userId_date_mealType: { userId, date, mealType } },
          update: {},
          create: {
            userId,
            dailyLogId: dailyLog.id,
            mealType,
            date
          }
        });
      }

      const meals = await tx.meal.findMany({
        where: { userId, date },
        include: { entries: { orderBy: { createdAt: "asc" } } },
        orderBy: { mealType: "asc" }
      });

      return { dailyLog, meals };
    });
  },

  createFoodEntry(userId: string, date: Date, mealType: MealType, snapshot: FoodEntrySnapshot) {
    return prisma.$transaction(async (tx) => {
      const dailyLog = await tx.dailyLog.upsert({
        where: { userId_date: { userId, date } },
        update: {},
        create: { userId, date }
      });

      const meal = await tx.meal.upsert({
        where: { userId_date_mealType: { userId, date, mealType } },
        update: { dailyLogId: dailyLog.id },
        create: {
          userId,
          dailyLogId: dailyLog.id,
          mealType,
          date
        }
      });

      const entry = await tx.foodEntry.create({
        data: {
          mealId: meal.id,
          ...snapshot
        }
      });

      const totals = await recalculateDailyTotals(tx, dailyLog.id);

      return { entry, dailyLog: totals };
    });
  },

  deleteFoodEntry(userId: string, entryId: string) {
    return prisma.$transaction(async (tx) => {
      const entry = await tx.foodEntry.findFirst({
        where: {
          id: entryId,
          meal: { userId }
        },
        include: { meal: true }
      });

      if (!entry) {
        return null;
      }

      await tx.foodEntry.delete({
        where: { id: entryId }
      });

      const dailyLog = await recalculateDailyTotals(tx, entry.meal.dailyLogId);

      return { dailyLog };
    });
  }
};

async function recalculateDailyTotals(tx: Prisma.TransactionClient, dailyLogId: string) {
  const aggregate = await tx.foodEntry.aggregate({
    where: { meal: { dailyLogId } },
    _sum: {
      calories: true,
      protein: true,
      carbs: true,
      fat: true
    }
  });

  return tx.dailyLog.update({
    where: { id: dailyLogId },
    data: {
      totalCalories: aggregate._sum.calories ?? 0,
      totalProtein: aggregate._sum.protein ?? 0,
      totalCarbs: aggregate._sum.carbs ?? 0,
      totalFat: aggregate._sum.fat ?? 0
    }
  });
}
