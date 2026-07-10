import { useEffect, useMemo, useState } from "react";

import { FormField } from "../../../../components/shared/FormField";
import { inputClassName } from "../../../../lib/ui";
import type { ActivityLevel, Gender, ProfileResponse } from "../../types/onboarding.types";
import { calculateCalorieNeeds, type CalorieGoal, type CalorieResult } from "../../utils/health-calculations";
import { CalculatorResultCard } from "./CalculatorResultCard";

interface CalorieTabProps {
  profile: ProfileResponse | null;
  initialBodyFatPercent: number | null;
  initialTargetWeightKg: number | null;
  onResult: (result: CalorieResult | null) => void;
}

const genderOptions: Array<{ value: Gender; label: string }> = [
  { value: "MALE", label: "Erkek" },
  { value: "FEMALE", label: "Kadın" },
];

const activityOptions: Array<{ value: ActivityLevel; label: string }> = [
  { value: "SEDENTARY", label: "Sedanter, hareketsiz iş ve hayat" },
  { value: "LIGHT", label: "Hareketsiz iş ve haftada 1-2 seans spor" },
  { value: "MODERATE", label: "Orta aktivite, haftada 3-5 gün vücut geliştirme" },
  { value: "ACTIVE", label: "Haftada 4-5 yüksek kondisyon gerektiren spor" },
  { value: "VERY_ACTIVE", label: "Aşırı hareketli beden işi veya 5-7 seans çok yoğun kondisyon" },
];

const goalOptions: Array<{ value: CalorieGoal; label: string }> = [
  { value: "LOSE", label: "Yağ Kaybetme" },
  { value: "MAINTAIN", label: "İdare-i maslahat" },
  { value: "GAIN", label: "Kütle Kazanma" },
];

export function CalorieTab({
  profile,
  initialBodyFatPercent,
  initialTargetWeightKg,
  onResult,
}: CalorieTabProps) {
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "MALE");
  const [weightKg, setWeightKg] = useState(
    initialTargetWeightKg
      ? String(initialTargetWeightKg)
      : profile?.currentWeightKg
        ? String(profile.currentWeightKg)
        : "70"
  );
  const [bodyFatPercent, setBodyFatPercent] = useState(
    initialBodyFatPercent ? initialBodyFatPercent.toFixed(1) : "20"
  );
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile?.activityLevel ?? "MODERATE");
  const [goal, setGoal] = useState<CalorieGoal>("LOSE");

  // Once the FFMI tab computes a body-fat estimate, adopt it here (still editable).
  useEffect(() => {
    if (initialBodyFatPercent) setBodyFatPercent(initialBodyFatPercent.toFixed(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBodyFatPercent]);

  // Once the Protein tab's target weight is known, use it as the calorie basis:
  // the user is dieting toward that weight, not their current one.
  useEffect(() => {
    if (initialTargetWeightKg) setWeightKg(String(initialTargetWeightKg));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTargetWeightKg]);

  const result = useMemo(() => {
    const w = Number(weightKg);
    const fat = Number(bodyFatPercent);
    if (!w || w < 20 || w > 400 || !fat || fat < 3 || fat > 60) return null;
    return calculateCalorieNeeds({ weightKg: w, bodyFatPercent: fat, activityLevel, goal });
  }, [weightKg, bodyFatPercent, activityLevel, goal]);

  useEffect(() => {
    onResult(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <div className="space-y-4">
      <FormField label="Cinsiyet" htmlFor="calorie-gender">
        <select
          id="calorie-gender"
          className={inputClassName}
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
        >
          {genderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Hedef Kilo (kg)" htmlFor="calorie-weight">
          <input
            id="calorie-weight"
            inputMode="decimal"
            className={inputClassName}
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
        </FormField>
        <FormField label="Yağ Oranı (%)" htmlFor="calorie-fat">
          <input
            id="calorie-fat"
            inputMode="decimal"
            className={inputClassName}
            value={bodyFatPercent}
            onChange={(e) => setBodyFatPercent(e.target.value)}
          />
        </FormField>
      </div>
      <p className="-mt-2 text-xs text-stone-400">
        Kalori hedefin ulaşmak istediğin kiloya göre hesaplanır (Protein sekmesindeki hedef kilo). Yağ oranı,
        Yağ Oranı sekmesindeki sonuçtan alındı — ikisini de istersen değiştir.
      </p>

      <FormField label="Aktivite Düzeyi" htmlFor="calorie-activity">
        <select
          id="calorie-activity"
          className={inputClassName}
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
        >
          {activityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Amacınız" htmlFor="calorie-goal">
        <select
          id="calorie-goal"
          className={inputClassName}
          value={goal}
          onChange={(e) => setGoal(e.target.value as CalorieGoal)}
        >
          {goalOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      {result ? (
        <CalculatorResultCard
          title="Günlük Kalori İhtiyacı"
          stats={[
            { label: "Bazal Metabolizma Hızı (BMR)", value: `${result.bmr} kcal / gün` },
            { label: '"Böyle Devam" Dozu (TDEE)', value: `${result.tdee} kcal / gün` },
            { label: "Hedef kalori", value: `${result.goalCalories} kcal / gün` },
          ]}
        />
      ) : (
        <p className="text-sm text-stone-400">Hedef kilo ve yağ oranını girerek sonucu gör.</p>
      )}
    </div>
  );
}
