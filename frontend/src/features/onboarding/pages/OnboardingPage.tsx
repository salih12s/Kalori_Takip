import { useQuery } from "@tanstack/react-query";
import { Flame } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { routePaths } from "../../../app/router/routes";
import { ErrorState } from "../../../components/shared/ErrorState";
import { FullScreenLoader } from "../../../components/shared/FullScreenLoader";
import { onboardingApi } from "../api/onboarding.api";
import { GoalStepForm } from "../components/GoalStepForm";
import { OnboardingProgress } from "../components/OnboardingProgress";
import { ProfileStepForm } from "../components/ProfileStepForm";
import { useOnboardingStatus } from "../hooks/useOnboarding";

export function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const navigate = useNavigate();
  const status = useOnboardingStatus();
  const profileQuery = useQuery({
    queryKey: ["onboarding-profile"],
    queryFn: onboardingApi.getMyProfile,
  });

  if (status.isLoading || profileQuery.isLoading) {
    return <FullScreenLoader label="Kurulum hazırlanıyor..." />;
  }

  if (status.data) {
    return <Navigate to={routePaths.dashboard} replace />;
  }

  if (profileQuery.isError) {
    return (
      <div className="grid min-h-screen place-items-center bg-stone-50 px-4">
        <div className="w-full max-w-xl">
          <ErrorState
            title="Kurulum yüklenemedi"
            description="Profil bilgileri alınırken bir sorun oluştu."
            onRetry={() => void profileQuery.refetch()}
          />
        </div>
      </div>
    );
  }

  const finishOnboarding = () => {
    toast.success("Kurulum tamamlandı");
    navigate(routePaths.dashboard, { replace: true });
  };

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-600 text-white">
              <Flame size={21} />
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Kurulumu Tamamla</h1>
          <p className="mt-2 text-sm text-stone-500">
            Sana uygun hedefleri hesaplayabilmek için kısa bir profil oluşturalım.
          </p>
        </div>

        <OnboardingProgress currentStep={step} />

        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          {step === 1 ? (
            <ProfileStepForm profile={profileQuery.data ?? null} onComplete={() => setStep(2)} />
          ) : (
            <GoalStepForm onBack={() => setStep(1)} onComplete={finishOnboarding} />
          )}
        </section>
      </div>
    </main>
  );
}
