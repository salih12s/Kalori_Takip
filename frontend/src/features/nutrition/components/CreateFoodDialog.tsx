import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName, secondaryButtonClassName } from "../../../lib/ui";
import { useCreateFood } from "../hooks/useCreateFood";
import { createFoodSchema, type CreateFoodFormValues } from "../schemas/nutrition.schema";

interface CreateFoodDialogProps {
  open: boolean;
  onClose: () => void;
}

function optionalNumber(value?: string): number | undefined {
  return value ? Number(value) : undefined;
}

function parseAliases(value?: string): string[] | undefined {
  const aliases = (value ?? "")
    .split(",")
    .map((alias) => alias.trim())
    .filter(Boolean);

  return aliases.length > 0 ? aliases : undefined;
}

export function CreateFoodDialog({ open, onClose }: CreateFoodDialogProps) {
  const createMutation = useCreateFood();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFoodFormValues>({
    resolver: zodResolver(createFoodSchema),
    defaultValues: {
      name: "",
      servingSize: "1",
      servingUnit: "adet",
      calories: "",
      protein: "0",
      carbs: "0",
      fat: "0",
      fiber: "",
      sugar: "",
      aliases: "",
    },
  });

  if (!open) return null;

  const closeDialog = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: CreateFoodFormValues) => {
    createMutation.mutate(
      {
        name: values.name.trim(),
        servingSize: Number(values.servingSize),
        servingUnit: values.servingUnit.trim(),
        calories: Number(values.calories),
        protein: Number(values.protein),
        carbs: Number(values.carbs),
        fat: Number(values.fat),
        fiber: optionalNumber(values.fiber),
        sugar: optionalNumber(values.sugar),
        aliases: parseAliases(values.aliases),
      },
      {
        onSuccess: () => {
          toast.success("Yemek oluşturuldu.");
          closeDialog();
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-stone-950/40 px-4 py-6">
      <motion.section
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-stone-200 bg-white p-5 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Manuel Yemek Ekle</h2>
            <p className="text-sm text-stone-500">
              Dış kaynakta bulamadığın yemekleri manuel ekleyebilirsin.
            </p>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Kapat"
            className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X size={18} />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Yemek adı" htmlFor="foodName" error={errors.name?.message}>
            <input id="foodName" className={inputClassName} {...register("name")} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Porsiyon miktarı" htmlFor="servingSize" error={errors.servingSize?.message}>
              <input id="servingSize" inputMode="decimal" className={inputClassName} {...register("servingSize")} />
            </FormField>
            <FormField label="Porsiyon birimi" htmlFor="servingUnit" error={errors.servingUnit?.message}>
              <input id="servingUnit" className={inputClassName} {...register("servingUnit")} />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Kalori" htmlFor="calories" error={errors.calories?.message}>
              <input id="calories" inputMode="numeric" className={inputClassName} {...register("calories")} />
            </FormField>
            <FormField label="Protein" htmlFor="protein" error={errors.protein?.message}>
              <input id="protein" inputMode="decimal" className={inputClassName} {...register("protein")} />
            </FormField>
            <FormField label="Karbonhidrat" htmlFor="carbs" error={errors.carbs?.message}>
              <input id="carbs" inputMode="decimal" className={inputClassName} {...register("carbs")} />
            </FormField>
            <FormField label="Yağ" htmlFor="fat" error={errors.fat?.message}>
              <input id="fat" inputMode="decimal" className={inputClassName} {...register("fat")} />
            </FormField>
            <FormField label="Lif" htmlFor="fiber" error={errors.fiber?.message}>
              <input id="fiber" inputMode="decimal" className={inputClassName} {...register("fiber")} />
            </FormField>
            <FormField label="Şeker" htmlFor="sugar" error={errors.sugar?.message}>
              <input id="sugar" inputMode="decimal" className={inputClassName} {...register("sugar")} />
            </FormField>
          </div>

          <FormField label="Alternatif adlar" htmlFor="aliases" error={errors.aliases?.message}>
            <input id="aliases" placeholder="egg, haşlanmış yumurta" className={inputClassName} {...register("aliases")} />
          </FormField>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={closeDialog} className={secondaryButtonClassName}>
              İptal
            </button>
            <button type="submit" disabled={createMutation.isPending} className={primaryButtonClassName}>
              {createMutation.isPending ? "Oluşturuluyor..." : "Manuel Yemek Ekle"}
            </button>
          </div>
        </form>
      </motion.section>
    </div>
  );
}
