import { z } from "zod";

const numberText = (message: string) =>
  z.string().min(1, message).refine((value) => Number.isFinite(Number(value)), message);

const positiveNumberText = (message: string) =>
  numberText(message).refine((value) => Number(value) > 0, message);

const nonNegativeNumberText = (message: string) =>
  numberText(message).refine((value) => Number(value) >= 0, message);

const optionalNonNegativeNumberText = (message: string) =>
  z.string().optional().refine((value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0), message);

export const addFoodEntrySchema = z.object({
  quantity: positiveNumberText("Miktar 0'dan büyük olmalıdır"),
  unit: z.string().trim().min(1, "Birim zorunludur").max(32, "Birim çok uzun"),
});

export type AddFoodEntryFormValues = z.infer<typeof addFoodEntrySchema>;

export const createFoodSchema = z.object({
  name: z.string().trim().min(1, "Yemek adı zorunludur").max(160, "Yemek adı çok uzun"),
  servingSize: positiveNumberText("Porsiyon miktarı 0'dan büyük olmalıdır"),
  servingUnit: z.string().trim().min(1, "Porsiyon birimi zorunludur").max(32, "Porsiyon birimi çok uzun"),
  calories: nonNegativeNumberText("Kalori 0 veya daha büyük olmalıdır"),
  protein: nonNegativeNumberText("Protein 0 veya daha büyük olmalıdır"),
  carbs: nonNegativeNumberText("Karbonhidrat 0 veya daha büyük olmalıdır"),
  fat: nonNegativeNumberText("Yağ 0 veya daha büyük olmalıdır"),
  fiber: optionalNonNegativeNumberText("Lif 0 veya daha büyük olmalıdır"),
  sugar: optionalNonNegativeNumberText("Şeker 0 veya daha büyük olmalıdır"),
  aliases: z.string().max(500, "Alternatif adlar çok uzun").optional(),
});

export type CreateFoodFormValues = z.infer<typeof createFoodSchema>;
