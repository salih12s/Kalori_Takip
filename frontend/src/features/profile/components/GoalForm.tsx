import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { cn } from "../../../lib/cn";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName, secondaryButtonClassName } from "../../../lib/ui";
import { BmiTab } from "../../onboarding/components/goal-tabs/BmiTab";
import { CalorieTab } from "../../onboarding/components/goal-tabs/CalorieTab";
import { FfmiTab } from "../../onboarding/components/goal-tabs/FfmiTab";
import { ProteinTab } from "../../onboarding/components/goal-tabs/ProteinTab";
import { WaterTab } from "../../onboarding/components/goal-tabs/WaterTab";
import type { BmiResult, CalorieResult, FfmiResult, ProteinResult } from "../../onboarding/utils/health-calculations";
import { useCreateGoal } from "../hooks/useCreateGoal";
import { useUpdateGoal } from "../hooks/useUpdateGoal";
import { goalFormSchema, type GoalFormValues } from "../schemas/profile.schema";
import type { CreateGoalPayload, GoalResponse, GoalType, ProfileResponse } from "../types/profile.types";
import { goalTypeOptions } from "../utils/profile-labels";

interface GoalFormProps {
  goal: GoalResponse | null;
  profile: ProfileResponse | null;
}

type TabKey = "ffmi" | "bmi" | "water" | "protein" | "calorie" | "summary";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "ffmi", label: "Yağ Oranı / FFMI" },
  { key: "bmi", label: "BMI" },
  { key: "water", label: "Su" },
  { key: "protein", label: "Protein" },
  { key: "calorie", label: "Kalori" },
  { key: "summary", label: "Özet" },
];

function toDefaults(goal: GoalResponse | null): GoalFormValues {
  return {
    goalType: goal?.goalType ?? "LOSE_WEIGHT",
    dailyStepGoal: goal ? String(goal.dailyStepGoal) : "10000",
    weeklyWorkoutGoal: goal ? String(goal.weeklyWorkoutGoal) : "4",
  };
}

export function GoalForm({ goal, profile }: GoalFormProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [furthestReached, setFurthestReached] = useState(0);

  const [ffmiResult, setFfmiResult] = useState<FfmiResult | null>(null);
  const [bmiResult, setBmiResult] = useState<BmiResult | null>(null);
  const [waterLiters, setWaterLiters] = useState<number | null>(null);
  const [proteinResult, setProteinResult] = useState<ProteinResult | null>(null);
  const [calorieResult, setCalorieResult] = useState<CalorieResult | null>(null);

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

  const activeTab = tabs[activeIndex].key;

  const isTabComplete = (key: TabKey): boolean => {
    switch (key) {
      case "ffmi":
        return ffmiResult !== null;
      case "bmi":
        return bmiResult !== null;
      case "water":
        return waterLiters !== null;
      case "protein":
        return proteinResult !== null;
      case "calorie":
        return calorieResult !== null;
      case "summary":
        return true;
    }
  };

  const goToIndex = (index: number) => {
    setActiveIndex(index);
    setFurthestReached((prev) => Math.max(prev, index));
  };

  const handleNext = () => {
    if (!isTabComplete(activeTab)) return;
    goToIndex(Math.min(activeIndex + 1, tabs.length - 1));
  };

  const handleBack = () => {
    goToIndex(Math.max(activeIndex - 1, 0));
  };

  const onSubmit = (values: GoalFormValues) => {
    const payload: CreateGoalPayload = {
      goalType: values.goalType as GoalType,
      dailyCalorieGoal: calorieResult?.goalCalories ?? goal?.dailyCalorieGoal ?? 2300,
      dailyProteinGoal: proteinResult?.proteinGrams ?? goal?.dailyProteinGoal ?? 140,
      dailyStepGoal: Number(values.dailyStepGoal),
      weeklyWorkoutGoal: Number(values.weeklyWorkoutGoal),
      dailyWaterGoal: waterLiters ? Math.round(waterLiters * 1000) : (goal?.dailyWaterGoal ?? undefined),
      targetWeightKg: proteinResult?.targetWeightKg ?? goal?.targetWeightKg ?? undefined,
    };

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

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Hesaplayıcılar">
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            disabled={index > furthestReached}
            onClick={() => goToIndex(index)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-emerald-600 text-white"
                : index > furthestReached
                  ? "cursor-not-allowed bg-stone-50 text-stone-300 dark:bg-stone-900 dark:text-stone-700"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={activeTab === "ffmi" ? "block" : "hidden"}>
        <FfmiTab profile={profile} onResult={setFfmiResult} />
      </div>
      <div className={activeTab === "bmi" ? "block" : "hidden"}>
        <BmiTab profile={profile} onResult={setBmiResult} />
      </div>
      <div className={activeTab === "water" ? "block" : "hidden"}>
        <WaterTab profile={profile} onResult={setWaterLiters} />
      </div>
      <div className={activeTab === "protein" ? "block" : "hidden"}>
        <ProteinTab profile={profile} onResult={setProteinResult} />
      </div>
      <div className={activeTab === "calorie" ? "block" : "hidden"}>
        <CalorieTab
          profile={profile}
          initialBodyFatPercent={ffmiResult?.bodyFatPercent ?? null}
          initialTargetWeightKg={proteinResult?.targetWeightKg ?? null}
          onResult={setCalorieResult}
        />
      </div>

      {activeTab === "summary" ? (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm dark:border-stone-800 dark:bg-stone-900">
            <p className="font-semibold text-stone-800 dark:text-stone-100">Kaydedilecek hedefler</p>
            <dl className="mt-2 grid gap-1.5 sm:grid-cols-2">
              <div className="flex justify-between gap-3">
                <dt className="text-stone-500 dark:text-stone-400">Kalori</dt>
                <dd className="font-medium text-stone-800 dark:text-stone-100">
                  {calorieResult?.goalCalories ?? goal?.dailyCalorieGoal ?? "—"} kcal
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-stone-500 dark:text-stone-400">Protein</dt>
                <dd className="font-medium text-stone-800 dark:text-stone-100">
                  {proteinResult?.proteinGrams ?? goal?.dailyProteinGoal ?? "—"} g
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-stone-500 dark:text-stone-400">Su</dt>
                <dd className="font-medium text-stone-800 dark:text-stone-100">
                  {waterLiters
                    ? `${waterLiters.toFixed(1)} L`
                    : goal?.dailyWaterGoal
                      ? `${(goal.dailyWaterGoal / 1000).toFixed(1)} L`
                      : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-stone-500 dark:text-stone-400">Yağ Oranı / FFMI</dt>
                <dd className="font-medium text-stone-800 dark:text-stone-100">
                  {ffmiResult ? `%${ffmiResult.bodyFatPercent.toFixed(1)} / ${ffmiResult.ffmi.toFixed(1)}` : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-stone-500 dark:text-stone-400">Hedef kilo</dt>
                <dd className="font-medium text-stone-800 dark:text-stone-100">
                  {proteinResult ? `${proteinResult.targetWeightKg} kg` : goal?.targetWeightKg ? `${goal.targetWeightKg} kg` : "—"}
                </dd>
              </div>
            </dl>
          </div>

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
            <FormField label="Günlük adım hedefi" htmlFor="dailyStepGoal" error={errors.dailyStepGoal?.message}>
              <input id="dailyStepGoal" inputMode="numeric" className={inputClassName} {...register("dailyStepGoal")} />
            </FormField>
            <FormField
              label="Haftalık spor hedefi"
              htmlFor="weeklyWorkoutGoal"
              error={errors.weeklyWorkoutGoal?.message}
            >
              <input
                id="weeklyWorkoutGoal"
                inputMode="numeric"
                className={inputClassName}
                {...register("weeklyWorkoutGoal")}
              />
            </FormField>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={handleBack} className={secondaryButtonClassName}>
              Geri
            </button>
            <button type="submit" disabled={isPending} className={`${primaryButtonClassName} sm:w-auto`}>
              {isPending ? "Kaydediliyor..." : goal ? "Hedefi Güncelle" : "Hedef Oluştur"}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-between">
          <button type="button" onClick={handleBack} disabled={activeIndex === 0} className={secondaryButtonClassName}>
            Geri
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!isTabComplete(activeTab)}
            className={primaryButtonClassName}
          >
            İleri
          </button>
        </div>
      )}
    </section>
  );
}
