import { useEffect, useMemo, useState } from "react";

import { FormField } from "../../../../components/shared/FormField";
import { inputClassName } from "../../../../lib/ui";
import type { Gender, ProfileResponse } from "../../types/onboarding.types";
import { calculateFfmi, type FfmiResult } from "../../utils/health-calculations";
import { CalculatorResultCard } from "./CalculatorResultCard";

interface FfmiTabProps {
  profile: ProfileResponse | null;
  onResult: (result: FfmiResult | null) => void;
}

const genderOptions: Array<{ value: Gender; label: string }> = [
  { value: "MALE", label: "Erkek" },
  { value: "FEMALE", label: "Kadın" },
];

export function FfmiTab({ profile, onResult }: FfmiTabProps) {
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "MALE");
  const [heightCm, setHeightCm] = useState(profile?.heightCm ? String(profile.heightCm) : "170");
  const [weightKg, setWeightKg] = useState(
    profile?.currentWeightKg ? String(profile.currentWeightKg) : "70"
  );
  const [neckCm, setNeckCm] = useState("40");
  const [waistCm, setWaistCm] = useState("80");
  const [shoulderCm, setShoulderCm] = useState("120");
  const [hipCm, setHipCm] = useState("95");

  const result = useMemo(() => {
    const h = Number(heightCm);
    const w = Number(weightKg);
    const neck = Number(neckCm);
    const waist = Number(waistCm);
    const shoulder = Number(shoulderCm);
    const hip = Number(hipCm);
    if (!h || !w || !neck || !waist || waist <= neck) return null;
    return calculateFfmi({
      gender,
      heightCm: h,
      weightKg: w,
      neckCm: neck,
      waistCm: waist,
      shoulderCm: gender === "MALE" ? shoulder : undefined,
      hipCm: gender === "FEMALE" ? hip : undefined,
    });
  }, [gender, heightCm, weightKg, neckCm, waistCm, shoulderCm, hipCm]);

  useEffect(() => {
    onResult(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <div className="space-y-4">
      <FormField label="Cinsiyet" htmlFor="ffmi-gender">
        <select
          id="ffmi-gender"
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
        <FormField label="Boy (cm)" htmlFor="ffmi-height">
          <input
            id="ffmi-height"
            inputMode="numeric"
            className={inputClassName}
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
        </FormField>
        <FormField label="Kilo (kg)" htmlFor="ffmi-weight">
          <input
            id="ffmi-weight"
            inputMode="decimal"
            className={inputClassName}
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Boyun Çevresi (cm)" htmlFor="ffmi-neck">
          <input
            id="ffmi-neck"
            inputMode="decimal"
            className={inputClassName}
            value={neckCm}
            onChange={(e) => setNeckCm(e.target.value)}
          />
        </FormField>
        <FormField label="Bel Çevresi (cm)" htmlFor="ffmi-waist">
          <input
            id="ffmi-waist"
            inputMode="decimal"
            className={inputClassName}
            value={waistCm}
            onChange={(e) => setWaistCm(e.target.value)}
          />
        </FormField>
      </div>

      {gender === "MALE" ? (
        <FormField label="Omuz Çevresi (cm)" htmlFor="ffmi-shoulder">
          <input
            id="ffmi-shoulder"
            inputMode="decimal"
            className={inputClassName}
            value={shoulderCm}
            onChange={(e) => setShoulderCm(e.target.value)}
          />
        </FormField>
      ) : (
        <FormField label="Kalça Çevresi (cm)" htmlFor="ffmi-hip">
          <input
            id="ffmi-hip"
            inputMode="decimal"
            className={inputClassName}
            value={hipCm}
            onChange={(e) => setHipCm(e.target.value)}
          />
        </FormField>
      )}

      {result ? (
        <CalculatorResultCard
          title="FFMI Endeksi"
          stats={[
            { label: "FFMI", value: `${result.ffmi.toFixed(2)} (${result.ffmiCategory})` },
            { label: "Vücut Yağ Oranı", value: `%${result.bodyFatPercent.toFixed(1)}` },
            { label: "Yağsız Kütle", value: `${result.leanMassKg.toFixed(1)} kg` },
            ...(result.shoulderWaistRatio
              ? [{ label: "Omuz/Bel Oranı", value: result.shoulderWaistRatio.toFixed(2) }]
              : []),
          ]}
          footnote="Ortalama: 18-20 · Atletik: 20-22 · Kaslı: 22-25 · 25+ muhtemel doping sınırı (erkek referansı)."
        />
      ) : (
        <p className="text-sm text-stone-400">Boy, kilo, boyun ve bel çevreni girerek sonucu gör.</p>
      )}
    </div>
  );
}
