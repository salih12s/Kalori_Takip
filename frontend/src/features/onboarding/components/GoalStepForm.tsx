import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { cn } from "../../../lib/cn";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName, secondaryButtonClassName } from "../../../lib/ui";
import { useOnboarding } from "../hooks/useOnboarding";
import { goalStepSchema, type GoalStepValues } from "../schemas/onboarding.schema";
import type { CreateGoalPayload, GoalType, ProfileResponse } from "../types/onboarding.types";
import type { BmiResult, CalorieResult, FfmiResult, ProteinResult } from "../utils/health-calculations";
import { BmiTab } from "./goal-tabs/BmiTab";
import { CalorieTab } from "./goal-tabs/CalorieTab";
import { FfmiTab } from "./goal-tabs/FfmiTab";
import { ProteinTab } from "./goal-tabs/ProteinTab";
import { WaterTab } from "./goal-tabs/WaterTab";

interface GoalStepFormProps {
  profile: ProfileResponse | null;
  onBack: () => void;
  onComplete: () => void;
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

const goalTypeOptions: Array<{ value: GoalType; label: string }> = [
  { value: "LOSE_WEIGHT", label: "Kilo Vermek" },
  { value: "MAINTAIN_WEIGHT", label: "Kiloyu Korumak" },
  { value: "GAIN_WEIGHT", label: "Kilo Almak" },
  { value: "IMPROVE_FITNESS", label: "Formu Geliştirmek" },
];

export function GoalStepForm({ profile, onBack, onComplete }: GoalStepFormProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [furthestReached, setFurthestReached] = useState(0);

  const [ffmiResult, setFfmiResult] = useState<FfmiResult | null>(null);
  const [bmiResult, setBmiResult] = useState<BmiResult | null>(null);
  const [waterLiters, setWaterLiters] = useState<number | null>(null);
  const [proteinResult, setProteinResult] = useState<ProteinResult | null>(null);
  const [calorieResult, setCalorieResult] = useState<CalorieResult | null>(null);

  const { goalMutation } = useOnboarding();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalStepValues>({
    resolver: zodResolver(goalStepSchema),
    defaultValues: {
      goalType: "LOSE_WEIGHT",
      dailyStepGoal: "10000",
      weeklyWorkoutGoal: "4",
    },
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

  const handleBack = () => {
    if (activeIndex === 0) {
      onBack();
      return;
    }
    goToIndex(activeIndex - 1);
  };

  const handleNext = () => {
    if (!isTabComplete(activeTab)) return;
    goToIndex(Math.min(activeIndex + 1, tabs.length - 1));
  };

  const onSubmit = (values: GoalStepValues) => {
    const payload: CreateGoalPayload = {
      goalType: values.goalType as GoalType,
      dailyCalorieGoal: calorieResult?.goalCalories ?? 2300,
      dailyProteinGoal: proteinResult?.proteinGrams ?? 140,
      dailyStepGoal: Number(values.dailyStepGoal),
      weeklyWorkoutGoal: Number(values.weeklyWorkoutGoal),
      dailyWaterGoal: waterLiters ? Math.round(waterLiters * 1000) : undefined,
      targetWeightKg: proteinResult?.targetWeightKg,
    };

    goalMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Hedeflerin kaydedildi");
        onComplete();
      },
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <div className="space-y-4">
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
            <p className="font-semibold text-stone-800 dark:text-stone-100">Hesaplanan hedeflerin</p>
            <dl className="mt-2 grid gap-1.5 sm:grid-cols-2">
              <div className="flex justify-between gap-3">
                <dt className="text-stone-500 dark:text-stone-400">Kalori</dt>
                <dd className="font-medium text-stone-800 dark:text-stone-100">
                  {calorieResult ? `${calorieResult.goalCalories} kcal` : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-stone-500 dark:text-stone-400">Protein</dt>
                <dd className="font-medium text-stone-800 dark:text-stone-100">
                  {proteinResult ? `${proteinResult.proteinGrams} g` : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-stone-500 dark:text-stone-400">Su</dt>
                <dd className="font-medium text-stone-800 dark:text-stone-100">
                  {waterLiters ? `${waterLiters.toFixed(1)} L` : "—"}
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
                  {proteinResult ? `${proteinResult.targetWeightKg} kg` : "—"}
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
            <button type="submit" disabled={goalMutation.isPending} className={primaryButtonClassName}>
              {goalMutation.isPending ? "Kaydediliyor..." : "Kurulumu Bitir"}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={handleBack} className={secondaryButtonClassName}>
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
    </div>
  );
}
