import { useEffect, useMemo, useState } from "react";

import { FormField } from "../../../../components/shared/FormField";
import { inputClassName } from "../../../../lib/ui";
import type { ProfileResponse } from "../../types/onboarding.types";
import {
  calculateProtein,
  type ProteinFatKnowledge,
  type ProteinResult,
} from "../../utils/health-calculations";
import { CalculatorResultCard } from "./CalculatorResultCard";

interface ProteinTabProps {
  profile: ProfileResponse | null;
  onResult: (result: ProteinResult | null) => void;
}

export function ProteinTab({ profile, onResult }: ProteinTabProps) {
  const [currentWeightKg] = useState(
    profile?.currentWeightKg ? String(profile.currentWeightKg) : "70"
  );
  const [targetWeightKg, setTargetWeightKg] = useState(
    profile?.currentWeightKg ? String(profile.currentWeightKg) : "70"
  );
  const [fatKnowledge, setFatKnowledge] = useState<ProteinFatKnowledge>("HIGH");
  const [exactFatPercent, setExactFatPercent] = useState("15");
  const [training, setTraining] = useState(false);

  const result = useMemo(() => {
    const target = Number(targetWeightKg);
    if (!target || target < 20 || target > 400) return null;
    return calculateProtein({
      targetWeightKg: target,
      fatKnowledge,
      exactFatPercent: fatKnowledge === "EXACT" ? Number(exactFatPercent) : undefined,
      training,
    });
  }, [targetWeightKg, fatKnowledge, exactFatPercent, training]);

  useEffect(() => {
    onResult(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <div className="space-y-4">
      <FormField label="Vücut Ağırlığı (kg)" htmlFor="protein-weight">
        <input id="protein-weight" className={inputClassName} value={currentWeightKg} disabled />
      </FormField>

      <FormField label="Yağ Oranı" htmlFor="protein-fat">
        <div className="space-y-2">
          {(
            [
              { value: "HIGH", label: "Yağ Oranım Yüksek" },
              { value: "LOW", label: "Yağ Oranım Düşük" },
              { value: "EXACT", label: "Yağ Oranımı Net Olarak Biliyorum" },
            ] as const
          ).map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200">
              <input
                type="radio"
                name="protein-fat-knowledge"
                checked={fatKnowledge === option.value}
                onChange={() => setFatKnowledge(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </FormField>

      {fatKnowledge === "EXACT" ? (
        <FormField label="Vücut Yağ Oranı (%)" htmlFor="protein-exact-fat">
          <input
            id="protein-exact-fat"
            inputMode="decimal"
            className={inputClassName}
            value={exactFatPercent}
            onChange={(e) => setExactFatPercent(e.target.value)}
          />
        </FormField>
      ) : null}

      <FormField label="Hedef Kilo (kg)" htmlFor="protein-target">
        <input
          id="protein-target"
          inputMode="decimal"
          className={inputClassName}
          value={targetWeightKg}
          onChange={(e) => setTargetWeightKg(e.target.value)}
        />
      </FormField>

      <FormField label="Aktivite ve Amacınız" htmlFor="protein-training">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200">
            <input type="radio" name="protein-training" checked={!training} onChange={() => setTraining(false)} />
            Spor Yapmıyorum
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200">
            <input type="radio" name="protein-training" checked={training} onChange={() => setTraining(true)} />
            Spor &amp; Vücut Geliştirme Yapıyorum
          </label>
        </div>
      </FormField>

      {result ? (
        <CalculatorResultCard
          title="Günlük Protein Hedefi"
          stats={[{ label: "Protein", value: `${result.proteinGrams} gr / gün` }]}
          footnote="Hayvansal veya bitkisel, tüm protein kaynakları geçerlidir."
        />
      ) : (
        <p className="text-sm text-stone-400">Hedef kilonu girerek sonucu gör.</p>
      )}
    </div>
  );
}
