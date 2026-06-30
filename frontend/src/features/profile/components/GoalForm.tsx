import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName } from "../../../lib/ui";
import { useCreateGoal } from "../hooks/useCreateGoal";
import { useUpdateGoal } from "../hooks/useUpdateGoal";
import { goalFormSchema, type GoalFormValues } from "../schemas/profile.schema";
import type { CreateGoalPayload, GoalResponse, GoalType } from "../types/profile.types";
import { goalTypeOptions } from "../utils/profile-labels";

interface GoalFormProps {
  goal: GoalResponse | null;
}

function optionalNumber(value?: string): number | undefined {
  return value ? Number(value) : undefined;
}

function buildPayload(values: GoalFormValues): CreateGoalPayload {
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

function toDefaults(goal: GoalResponse | null): GoalFormValues {
  if (!goal) {
    return {
      goalType: "LOSE_WEIGHT",
      dailyCalorieGoal: "2300",
      dailyProteinGoal: "140",
      dailyCarbGoal: "250",
      dailyFatGoal: "70",
      dailyStepGoal: "10000",
      weeklyWorkoutGoal: "4",
      targetWeightKg: "",
    };
  }
  return {
    goalType: goal.goalType,
    dailyCalorieGoal: String(goal.dailyCalorieGoal),
    dailyProteinGoal: String(goal.dailyProteinGoal),
    dailyCarbGoal: goal.dailyCarbGoal != null ? String(goal.dailyCarbGoal) : "",
    dailyFatGoal: goal.dailyFatGoal != null ? String(goal.dailyFatGoal) : "",
    dailyStepGoal: String(goal.dailyStepGoal),
    weeklyWorkoutGoal: String(goal.weeklyWorkoutGoal),
    targetWeightKg: goal.targetWeightKg != null ? String(goal.targetWeightKg) : "",
  };
}

export function GoalForm({ goal }: GoalFormProps) {
  const createMutation = useCreateGoal();
  const updateMutation = useUpdateGoal();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: toDefaults(goal),
  });

  const onSubmit = (values: GoalFormValues) => {
    const payload = buildPayload(values);
    if (goal) {
      updateMutation.mutate(
        { goalId: goal.id, payload },
        {
          onSuccess: () => toast.success("Hedef güncellendi."),
          onError: (error) => toast.error(getApiErrorMessage(error)),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => toast.success("Hedef oluşturuldu."),
        onError: (error) => toast.error(getApiErrorMessage(error)),
      });
    }
  };

  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-stone-900">Hedef Bilgileri</h2>

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
          <FormField label="Günlük karbonhidrat hedefi" htmlFor="dailyCarbGoal" error={errors.dailyCarbGoal?.message}>
            <input id="dailyCarbGoal" inputMode="numeric" className={inputClassName} {...register("dailyCarbGoal")} />
          </FormField>
          <FormField label="Günlük yağ hedefi" htmlFor="dailyFatGoal" error={errors.dailyFatGoal?.message}>
            <input id="dailyFatGoal" inputMode="numeric" className={inputClassName} {...register("dailyFatGoal")} />
          </FormField>
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

        <button type="submit" disabled={isPending} className={`${primaryButtonClassName} sm:w-auto`}>
          {isPending ? "Kaydediliyor..." : goal ? "Hedefi Güncelle" : "Hedef Oluştur"}
        </button>
      </form>
    </section>
  );
}
