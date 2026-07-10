import type { ExternalFoodSearchResult } from "./external-food.types.js";

type OpenFoodFactsProduct = {
  code?: string;
  product_name?: string;
  product_name_en?: string;
  generic_name?: string;
  brands?: string;
  image_front_url?: string;
  image_url?: string;
  serving_quantity?: string | number;
  serving_size?: string;
  nutriments?: Record<string, string | number | undefined>;
};

function numberFrom(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function roundMacro(value: number | null): number | null {
  if (value == null || value < 0) {
    return null;
  }

  return Math.round(value * 100) / 100;
}

function cleanName(product: OpenFoodFactsProduct): string | null {
  const name = product.product_name || product.product_name_en || product.generic_name;

  return name?.trim() || null;
}

export function mapOpenFoodFactsProduct(product: OpenFoodFactsProduct): ExternalFoodSearchResult | null {
  const code = product.code?.trim();
  const name = cleanName(product);

  if (!code || !name) {
    return null;
  }

  const nutriments = product.nutriments ?? {};
  const calories = numberFrom(nutriments["energy-kcal_100g"] ?? nutriments["energy-kcal"]);

  if (calories == null) {
    return null;
  }

  const servingQuantity = numberFrom(product.serving_quantity) ?? 100;

  return {
    externalId: `openfoodfacts:${code}`,
    provider: "OPEN_FOOD_FACTS",
    name,
    imageUrl: product.image_front_url || product.image_url || null,
    servingSize: servingQuantity > 0 ? servingQuantity : 100,
    servingUnit: product.serving_size?.trim() || "g",
    calories: Math.round(calories),
    protein: roundMacro(numberFrom(nutriments.proteins_100g)) ?? 0,
    carbs: roundMacro(numberFrom(nutriments.carbohydrates_100g)) ?? 0,
    fat: roundMacro(numberFrom(nutriments.fat_100g)) ?? 0,
    fiber: roundMacro(numberFrom(nutriments.fiber_100g)),
    sugar: roundMacro(numberFrom(nutriments.sugars_100g)),
    aliases: [product.brands, product.generic_name].filter((value): value is string => Boolean(value?.trim()))
  };
}
