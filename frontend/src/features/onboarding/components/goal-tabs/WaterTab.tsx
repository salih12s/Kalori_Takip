import { useEffect, useMemo, useState } from "react";

import { FormField } from "../../../../components/shared/FormField";
import { inputClassName } from "../../../../lib/ui";
import type { ProfileResponse } from "../../types/onboarding.types";
import {
  calculateWater,
  type Climate,
  type WaterActivityLevel,
} from "../../utils/health-calculations";
import { CalculatorResultCard } from "./CalculatorResultCard";

interface WaterTabProps {
  profile: ProfileResponse | null;
  onResult: (liters: number | null) => void;
}

const activityOptions: Array<{ value: WaterActivityLevel; label: string }> = [
  { value: "SEDENTARY", label: "Sedanter (Az hareketli)" },
  { value: "ACTIVE", label: "Aktif (Düzenli egzersiz)" },
  { value: "VERY_ACTIVE", label: "Çok Aktif (Yoğun egzersiz)" },
];

const climateOptions: Array<{ value: Climate; label: string }> = [
  { value: "COOL", label: "Serin" },
  { value: "TEMPERATE", label: "Ilıman" },
  { value: "HOT_HUMID", label: "Sıcak ve Nemli" },
  { value: "DESERT_TROPICAL", label: "Çöl veya Tropik" },
];

function defaultActivity(profile: ProfileResponse | null): WaterActivityLevel {
  switch (profile?.activityLevel) {
    case "SEDENTARY":
      return "SEDENTARY";
    case "LIGHT":
    case "MODERATE":
      return "ACTIVE";
    case "ACTIVE":
    case "VERY_ACTIVE":
      return "VERY_ACTIVE";
    default:
      return "SEDENTARY";
  }
}

export function WaterTab({ profile, onResult }: WaterTabProps) {
  const [weightKg, setWeightKg] = useState(
    profile?.currentWeightKg ? String(profile.currentWeightKg) : "70"
  );
  const [activityLevel, setActivityLevel] = useState<WaterActivityLevel>(defaultActivity(profile));
  const [climate, setClimate] = useState<Climate>("TEMPERATE");
  const [pregnant, setPregnant] = useState(false);
  const [breastfeeding, setBreastfeeding] = useState(false);

  const result = useMemo(() => {
    const w = Number(weightKg);
    if (!w || w < 20 || w > 400) return null;
    return calculateWater({ weightKg: w, activityLevel, climate, pregnant, breastfeeding });
  }, [weightKg, activityLevel, climate, pregnant, breastfeeding]);

  useEffect(() => {
    onResult(result ? result.liters : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <div className="space-y-4">
      <FormField label="Vücut Ağırlığınız (kg)" htmlFor="water-weight">
        <input
          id="water-weight"
          inputMode="decimal"
          className={inputClassName}
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
        />
      </FormField>

      <FormField label="Günlük Aktivite Seviyesi" htmlFor="water-activity">
        <select
          id="water-activity"
          className={inputClassName}
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as WaterActivityLevel)}
        >
          {activityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="İklim Koşulları" htmlFor="water-climate">
        <select
          id="water-climate"
          className={inputClassName}
          value={climate}
          onChange={(e) => setClimate(e.target.value as Climate)}
        >
          {climateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
        <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200">
          <input type="checkbox" checked={pregnant} onChange={(e) => setPregnant(e.target.checked)} />
          Hamileyim
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200">
          <input
            type="checkbox"
            checked={breastfeeding}
            onChange={(e) => setBreastfeeding(e.target.checked)}
          />
          Emziriyorum
        </label>
      </div>

      {result ? (
        <CalculatorResultCard
          title="Günlük Su İhtiyacı"
          stats={[
            { label: "Su ihtiyacı", value: `${result.liters.toFixed(1)} litre / gün` },
            { label: "Kaç bardak?", value: `${result.cups.toFixed(1)} bardak` },
          ]}
        />
      ) : (
        <p className="text-sm text-stone-400">Vücut ağırlığını girerek sonucu gör.</p>
      )}
    </div>
  );
}
