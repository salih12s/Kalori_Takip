import { Check } from "lucide-react";

import { cn } from "../../../lib/cn";

interface OnboardingProgressProps {
  currentStep: 1 | 2;
}

const steps = [
  { id: 1, label: "Profil" },
  { id: 2, label: "Hedefler" },
] as const;

export function OnboardingProgress({ currentStep }: OnboardingProgressProps) {
  return (
    <div className="grid grid-cols-2 gap-3" aria-label="Kurulum adımları">
      {steps.map((step) => {
        const isComplete = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium",
              isActive || isComplete
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-stone-200 bg-white text-stone-500"
            )}
          >
            <span
              className={cn(
                "grid h-7 w-7 place-items-center rounded-full text-xs font-bold",
                isComplete || isActive ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-500"
              )}
            >
              {isComplete ? <Check size={14} /> : step.id}
            </span>
            <span>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
