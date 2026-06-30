import { MealType, Prisma } from "@prisma/client";

import { prisma } from "../../database/prisma.js";
import type { CreateFoodInput, ImportExternalFoodInput } from "./nutrition.types.js";

const mealTypes = [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER, MealType.SNACK];
type FoodSearchScope = "curated" | "cache" | "all";

type FoodEntrySnapshot = {
  foodId: string;
  foodNameSnapshot: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
};

export const nutritionRepository = {
  searchFoods(query: string, normalizedQuery: string, scope: FoodSearchScope) {
    const scopeWhere: Prisma.FoodWhereInput =
      scope === "curated"
        ? {
            userId: null,
            source: "LOCAL",
            externalProvider: null,
            externalId: null
          }
        : scope === "cache"
          ? {
              OR: [{ source: "OPEN_FOOD_FACTS" }, { source: "USER_CREATED" }, { userId: { not: null } }]
            }
          : {};

    return prisma.food.findMany({
      where: {
        deletedAt: null,
        AND: [scopeWhere],
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { normalizedName: { contains: normalizedQuery, mode: "insensitive" } },
          { aliases: { some: { alias: { contains: query, mode: "insensitive" } } } },
          { aliases: { some: { normalizedAlias: { contains: normalizedQuery, mode: "insensitive" } } } }
        ]
      },
      include: { aliases: true },
      orderBy: { name: "asc" },
      take: 60
    });
  },

  createFood(userId: string, input: CreateFoodInput, normalizedName: string, aliases: { alias: string; normalizedAlias: string }[]) {
    return prisma.food.create({
      data: {
        userId,
        name: input.name,
        normalizedName,
        servingSize: input.servingSize,
        servingUnit: input.servingUnit,
        calories: input.calories,
        protein: input.protein,
        carbs: input.carbs,
        fat: input.fat,
        fiber: input.fiber,
        sugar: input.sugar,
        source: "USER_CREATED",
        aliases: {
          create: aliases
        }
      },
      include: { aliases: true }
    });
  },

  findImportedFood(provider: string, externalId: string) {
    return prisma.food.findFirst({
      where: { externalProvider: provider, externalId, deletedAt: null },
      include: { aliases: true }
    });
  },

  importExternalFood(
    userId: string,
    input: ImportExternalFoodInput,
    normalizedName: string,
    aliases: { alias: string; normalizedAlias: string }[]
  ) {
    return prisma.food.create({
      data: {
        userId,
        name: input.name,
        normalizedName,
        servingSize: input.servingSize,
        servingUnit: input.servingUnit,
        calories: input.calories,
        protein: input.protein,
        carbs: input.carbs,
        fat: input.fat,
        fiber: input.fiber ?? null,
        sugar: input.sugar ?? null,
        source: "OPEN_FOOD_FACTS",
        externalProvider: input.provider,
        externalId: input.externalId,
        cachedAt: new Date(),
        aliases: {
          create: aliases
        }
      },
      include: { aliases: true }
    });
  },

  findFoodById(foodId: string) {
    return prisma.food.findFirst({
      where: { id: foodId, deletedAt: null }
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
