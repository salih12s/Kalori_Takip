import { PrismaClient } from "@prisma/client";

import { normalizeText } from "../src/shared/utils/normalize-text.js";
import { curatedFoods } from "./curated-foods.js";

const prisma = new PrismaClient();

async function upsertCuratedFood(food: (typeof curatedFoods)[number]) {
  const normalizedName = normalizeText(food.name);
  const aliases = [food.name, ...food.aliases].map((alias) => ({
    alias,
    normalizedAlias: normalizeText(alias)
  }));
  const existingFood = await prisma.food.findFirst({
    where: {
      userId: null,
      source: "LOCAL",
      externalProvider: null,
      externalId: null,
      normalizedName
    }
  });
  const foodData = {
    userId: null,
    name: food.name,
    normalizedName,
    servingSize: food.servingSize,
    servingUnit: food.servingUnit,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    fiber: food.fiber,
    sugar: food.sugar,
    source: "LOCAL" as const,
    externalProvider: null,
    externalId: null,
    cachedAt: null,
    deletedAt: null
  };

  if (existingFood) {
    await prisma.food.update({
      where: { id: existingFood.id },
      data: foodData
    });
    await prisma.foodAlias.createMany({
      data: aliases.map((alias) => ({ foodId: existingFood.id, ...alias })),
      skipDuplicates: true
    });
    return;
  }

  await prisma.food.create({
    data: {
      ...foodData,
      aliases: { create: aliases }
    }
  });
}

async function main() {
  for (const food of curatedFoods) {
    await upsertCuratedFood(food);
  }

  console.log(`Seeded ${curatedFoods.length} curated foods.`);
}

main()
  .catch((error) => {
    console.error("Curated food seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
