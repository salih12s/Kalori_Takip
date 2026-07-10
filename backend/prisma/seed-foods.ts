import { PrismaClient } from "@prisma/client";

import { normalizeText } from "../src/shared/utils/normalize-text.js";
import { curatedFoods } from "./curated-foods.js";

const prisma = new PrismaClient();

const imageCache = new Map<string, string | null>();
const shouldFetchImages = process.env.SEED_FETCH_IMAGES === "true";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function resolveCommonsImage(food: (typeof curatedFoods)[number]): Promise<string | null> {
  if (!shouldFetchImages) return null;
  const knownImages: Record<string, string> = {
    oats: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Avena_sativa_L.jpg/330px-Avena_sativa_L.jpg",
    oatmeal: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Oatmeal_with_blueberries.jpg/330px-Oatmeal_with_blueberries.jpg"
  };
  const knownImage = knownImages[food.aliases[food.aliases.length - 1] ?? ""];
  if (knownImage) return knownImage;
  const query = `${food.aliases[food.aliases.length - 1] ?? food.name} food`;
  const cached = imageCache.get(query);
  if (cached !== undefined) return cached;

  try {
    // Commons throttles anonymous clients; keep the seed gentle and retry transient limits.
    await wait(300);
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: query,
      gsrnamespace: "6",
      gsrlimit: "8",
      prop: "imageinfo",
      iiprop: "url",
      iiurlwidth: "320",
      format: "json",
      origin: "*"
    });
    let response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
      headers: { "User-Agent": "FitBoard/0.1 food-seeder" }
    });
    if (response.status === 429) {
      await wait(2500);
      response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
        headers: { "User-Agent": "FitBoard/0.1 food-seeder" }
      });
    }
    if (!response.ok) throw new Error(`Commons responded ${response.status}`);
    const body = (await response.json()) as {
      query?: { pages?: Record<string, { imageinfo?: Array<{ thumburl?: string; url?: string }> }> };
    };
    const image = Object.values(body.query?.pages ?? {})
      .map((page) => page.imageinfo?.[0]?.thumburl ?? page.imageinfo?.[0]?.url)
      .find((url): url is string => Boolean(url && /\.(jpe?g|png|webp)(\?|$)/i.test(url)));
    if (image) {
      imageCache.set(query, image);
      return image;
    }

    // Open Food Facts exposes product photography for foods that Commons indexes poorly.
    const offParams = new URLSearchParams({
      search_terms: food.aliases[food.aliases.length - 1] ?? food.name,
      search_simple: "1",
      action: "process",
      json: "1",
      page_size: "5",
      fields: "image_front_url,image_url"
    });
    const offResponse = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${offParams}`, {
      headers: { "User-Agent": "FitBoard/0.1 food-seeder" }
    });
    const offBody = (await offResponse.json()) as { products?: Array<{ image_front_url?: string; image_url?: string }> };
    const offImage = offBody.products?.map((product) => product.image_front_url || product.image_url).find(Boolean) ?? null;
    imageCache.set(query, offImage);
    return offImage;
  } catch {
    imageCache.set(query, null);
    return null;
  }
}

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
  const imageUrl = food.imageUrl
    ?? existingFood?.imageUrl
    ?? await resolveCommonsImage(food);
  const foodData = {
    userId: null,
    name: food.name,
    imageUrl,
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
