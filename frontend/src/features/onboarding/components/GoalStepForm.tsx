import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName, secondaryButtonClassName } from "../../../lib/ui";
import { useOnboarding } from "../hooks/useOnboarding";
import { goalStepSchema, type GoalStepValues } from "../schemas/onboarding.schema";
import type { CreateGoalPayload, GoalType } from "../types/onboarding.types";

interface GoalStepFormProps {
  onBack: () => void;
  onComplete: () => void;
}

const goalTypeOptions: Array<{ value: GoalType; label: string }> = [
  { value: "LOSE_WEIGHT", label: "Kilo Vermek" },
  { value: "MAINTAIN_WEIGHT", label: "Kiloyu Korumak" },
  { value: "GAIN_WEIGHT", label: "Kilo Almak" },
  { value: "IMPROVE_FITNESS", label: "Formu Geliştirmek" },
];

function optionalNumber(value?: string): number | undefined {
  return value ? Number(value) : undefined;
}

function buildPayload(values: GoalStepValues): CreateGoalPayload {
  return {
    goalType: values.goalType as GoalType,
    dailyCalorieGoal: Number(values.dailyCalorieGoal),
    dailyProteinGoal: Number(values.dailyProteinGoal),
    dailyCarbGoal: optionalNumber(values.dailyCarbGoal),
    dailyFatGoal: optionalNumber(values.dailyFatGoal),
    dailyStepGoal: Number(values.dailyStepGoal),
    weeklyWorkoutGoal: Number(values.weeklyWorkoutGoal),
    targetWeightKg: optionalNumber(values.targetWeightKg),
  };
}

export function GoalStepForm({ onBack, onComplete }: GoalStepFormProps) {
  const { goalMutation } = useOnboarding();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalStepValues>({
    resolver: zodResolver(goalStepSchema),
    defaultValues: {
      goalType: "LOSE_WEIGHT",
      dailyCalorieGoal: "2300",
      dailyProteinGoal: "140",
      dailyCarbGoal: "250",
      dailyFatGoal: "70",
      dailyStepGoal: "10000",
      weeklyWorkoutGoal: "4",
      targetWeightKg: "",
    },
  });

  const onSubmit = (values: GoalStepValues) => {
    goalMutation.mutate(buildPayload(values), {
      onSuccess: () => {
        toast.success("Hedeflerin kaydedildi");
        onComplete();
      },
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Hedef tipi" htmlFor="goalType" error={errors.goalType?.message}>
        <select id="goalType" className={inputClassName} {...register("goalType")}>
          {goalTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Günlük kalori hedefi" htmlFor="dailyCalorieGoal" error={errors.dailyCalorieGoal?.message}>
          <input id="dailyCalorieGoal" inputMode="numeric" className={inputClassName} {...register("dailyCalorieGoal")} />
        </FormField>
        <FormField label="Günlük protein hedefi" htmlFor="dailyProteinGoal" error={errors.dailyProteinGoal?.message}>
          <input id="dailyProteinGoal" inputMode="numeric" className={inputClassName} {...register("dailyProteinGoal")} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Günlük karbonhidrat hedefi" htmlFor="dailyCarbGoal" error={errors.dailyCarbGoal?.message}>
          <input id="dailyCarbGoal" inputMode="numeric" className={inputClassName} {...register("dailyCarbGoal")} />
        </FormField>
        <FormField label="Günlük yağ hedefi" htmlFor="dailyFatGoal" error={errors.dailyFatGoal?.message}>
          <input id="dailyFatGoal" inputMode="numeric" className={inputClassName} {...register("dailyFatGoal")} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Günlük adım hedefi" htmlFor="dailyStepGoal" error={errors.dailyStepGoal?.message}>
          <input id="dailyStepGoal" inputMode="numeric" className={inputClassName} {...register("dailyStepGoal")} />
        </FormField>
        <FormField label="Haftalık spor hedefi" htmlFor="weeklyWorkoutGoal" error={errors.weeklyWorkoutGoal?.message}>
          <input id="weeklyWorkoutGoal" inputMode="numeric" className={inputClassName} {...register("weeklyWorkoutGoal")} />
        </FormField>
      </div>

      <FormField label="Hedef kilo" htmlFor="targetWeightKg" error={errors.targetWeightKg?.message}>
        <input id="targetWeightKg" inputMode="decimal" className={inputClassName} {...register("targetWeightKg")} />
      </FormField>

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <button type="button" onClick={onBack} className={secondaryButtonClassName}>
          Geri
        </button>
        <button type="submit" disabled={goalMutation.isPending} className={primaryButtonClassName}>
          {goalMutation.isPending ? "Kaydediliyor..." : "Kurulumu Bitir"}
        </button>
      </div>
    </form>
  );
}
