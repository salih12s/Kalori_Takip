import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName, secondaryButtonClassName } from "../../../lib/ui";
import { useAddFoodEntry } from "../hooks/useAddFoodEntry";
import { addFoodEntrySchema, type AddFoodEntryFormValues } from "../schemas/nutrition.schema";
import type { FoodResponse, MealType } from "../types/nutrition.types";
import { mealLabels } from "../utils/meal-labels";
import { FoodSearchInput } from "./FoodSearchInput";

interface AddFoodEntryDialogProps {
  open: boolean;
  date: string;
  mealType: MealType;
  onClose: () => void;
}

export function AddFoodEntryDialog({ open, date, mealType, onClose }: AddFoodEntryDialogProps) {
  const [selectedFood, setSelectedFood] = useState<FoodResponse | null>(null);
  const addMutation = useAddFoodEntry();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AddFoodEntryFormValues>({
    resolver: zodResolver(addFoodEntrySchema),
    defaultValues: { quantity: "1", unit: "" },
  });

  useEffect(() => {
    if (selectedFood) {
      reset({ quantity: "1", unit: selectedFood.servingUnit });
    }
  }, [selectedFood, reset]);

  useEffect(() => {
    if (!open) {
      setSelectedFood(null);
      reset({ quantity: "1", unit: "" });
    }
  }, [open, reset]);

  if (!open) return null;

  const onSubmit = (values: AddFoodEntryFormValues) => {
    if (!selectedFood) {
      toast.error("Lütfen bir yemek seç.");
      return;
    }

    addMutation.mutate(
      {
        date,
        mealType,
        foodId: selectedFood.id,
        quantity: Number(values.quantity),
        unit: values.unit.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Yemek öğüne eklendi.");
          onClose();
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/30 px-4">
      <section className="w-full max-w-lg rounded-xl border border-stone-200 bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Yemek Ekle</h2>
            <p className="text-sm text-stone-500">{mealLabels[mealType]} öğününe kayıt ekle.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X size={18} />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Yemek">
            <FoodSearchInput selectedFood={selectedFood} onSelect={setSelectedFood} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Miktar" htmlFor="quantity" error={errors.quantity?.message}>
              <input id="quantity" inputMode="decimal" className={inputClassName} {...register("quantity")} />
            </FormField>
            <FormField label="Birim" htmlFor="unit" error={errors.unit?.message}>
              <input id="unit" className={inputClassName} {...register("unit")} />
            </FormField>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={onClose} className={secondaryButtonClassName}>
              İptal
            </button>
            <button type="submit" disabled={addMutation.isPending} className={primaryButtonClassName}>
              {addMutation.isPending ? "Ekleniyor..." : "Yemek Ekle"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
