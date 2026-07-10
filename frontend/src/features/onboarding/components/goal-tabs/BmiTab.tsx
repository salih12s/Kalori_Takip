import { useEffect, useMemo, useState } from "react";

import { FormField } from "../../../../components/shared/FormField";
import { inputClassName } from "../../../../lib/ui";
import type { Gender, ProfileResponse } from "../../types/onboarding.types";
import { calculateBmi, type BmiResult } from "../../utils/health-calculations";
import { CalculatorResultCard } from "./CalculatorResultCard";

interface BmiTabProps {
  profile: ProfileResponse | null;
  onResult: (result: BmiResult | null) => void;
}

const genderOptions: Array<{ value: Gender; label: string }> = [
  { value: "MALE", label: "Erkek" },
  { value: "FEMALE", label: "Kadın" },
];

export function BmiTab({ profile, onResult }: BmiTabProps) {
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "MALE");
  const [heightCm, setHeightCm] = useState(profile?.heightCm ? String(profile.heightCm) : "170");
  const [weightKg, setWeightKg] = useState(
    profile?.currentWeightKg ? String(profile.currentWeightKg) : "70"
  );

  const result = useMemo(() => {
    const h = Number(heightCm);
    const w = Number(weightKg);
    if (!h || !w || h < 80 || h > 250 || w < 20 || w > 400) return null;
    return calculateBmi(h, w);
  }, [heightCm, weightKg]);

  useEffect(() => {
    onResult(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <div className="space-y-4">
      <FormField label="Cinsiyet" htmlFor="bmi-gender">
        <select
          id="bmi-gender"
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
        <FormField label="Boy (cm)" htmlFor="bmi-height">
          <input
            id="bmi-height"
            inputMode="numeric"
            className={inputClassName}
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
        </FormField>
        <FormField label="Kilo (kg)" htmlFor="bmi-weight">
          <input
            id="bmi-weight"
            inputMode="decimal"
            className={inputClassName}
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
        </FormField>
      </div>

      {result ? (
        <CalculatorResultCard
          title="VKİ (BMI) Sonucu"
          stats={[
            { label: "BMI", value: `${result.bmi.toFixed(2)} kg/m²` },
            { label: "Kategori", value: result.category },
            {
              label: "İdeal kilo aralığı",
              value: `${result.idealWeightMinKg.toFixed(1)} - ${result.idealWeightMaxKg.toFixed(1)} kg`,
            },
          ]}
          footnote="18,5'den az: Zayıf · 18,5-24,9: İdeal · 25-29,9: Kilolu · 30+: Obez"
        />
      ) : (
        <p className="text-sm text-stone-400">Boy ve kilo girerek sonucu gör.</p>
      )}
    </div>
  );
}
