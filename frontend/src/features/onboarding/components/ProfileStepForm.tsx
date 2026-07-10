import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName } from "../../../lib/ui";
import { activityLevelOptions } from "../../profile/utils/profile-labels";
import { useOnboarding } from "../hooks/useOnboarding";
import { profileStepSchema, type ProfileStepValues } from "../schemas/onboarding.schema";
import type {
  ActivityLevel,
  Gender,
  PrivacyLevel,
  ProfileResponse,
  UpdateProfilePayload,
} from "../types/onboarding.types";

interface ProfileStepFormProps {
  profile: ProfileResponse | null;
  onComplete: (profile: ProfileResponse) => void;
}

const genderOptions: Array<{ value: Gender; label: string }> = [
  { value: "MALE", label: "Erkek" },
  { value: "FEMALE", label: "Kadın" },
];

const privacyOptions: Array<{ value: PrivacyLevel; label: string }> = [
  { value: "PUBLIC", label: "Herkese Açık" },
  { value: "FRIENDS", label: "Arkadaşlar" },
  { value: "PRIVATE", label: "Gizli" },
];

function buildPayload(values: ProfileStepValues): UpdateProfilePayload {
  return {
    fullName: values.fullName.trim(),
    gender: values.gender as Gender,
    birthDate: values.birthDate,
    heightCm: Number(values.heightCm),
    currentWeightKg: Number(values.currentWeightKg),
    activityLevel: values.activityLevel as ActivityLevel,
    privacyLevel: values.privacyLevel as PrivacyLevel,
  };
}

export function ProfileStepForm({ profile, onComplete }: ProfileStepFormProps) {
  const { profileMutation } = useOnboarding();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileStepValues>({
    resolver: zodResolver(profileStepSchema),
    defaultValues: {
      fullName: "",
      gender: "",
      birthDate: "",
      heightCm: "",
      currentWeightKg: "",
      activityLevel: "",
      privacyLevel: "FRIENDS",
    },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      fullName: profile.fullName ?? "",
      gender: profile.gender ?? "",
      birthDate: profile.birthDate?.slice(0, 10) ?? "",
      heightCm: profile.heightCm ? String(profile.heightCm) : "",
      currentWeightKg: profile.currentWeightKg ? String(profile.currentWeightKg) : "",
      activityLevel: profile.activityLevel ?? "",
      privacyLevel: profile.privacyLevel,
    });
  }, [profile, reset]);

  const onSubmit = (values: ProfileStepValues) => {
    const payload = buildPayload(values);
    profileMutation.mutate(payload, {
      onSuccess: (savedProfile) => {
        toast.success("Profil bilgilerin kaydedildi");
        onComplete(savedProfile);
      },
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Ad Soyad" htmlFor="fullName" error={errors.fullName?.message}>
        <input id="fullName" className={inputClassName} {...register("fullName")} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Cinsiyet" htmlFor="gender" error={errors.gender?.message}>
          <select id="gender" className={inputClassName} {...register("gender")}>
            <option value="">Seçiniz</option>
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Doğum tarihi" htmlFor="birthDate" error={errors.birthDate?.message}>
          <input id="birthDate" type="date" className={inputClassName} {...register("birthDate")} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Boy (cm)" htmlFor="heightCm" error={errors.heightCm?.message}>
          <input id="heightCm" inputMode="numeric" className={inputClassName} {...register("heightCm")} />
        </FormField>

        <FormField label="Kilo (kg)" htmlFor="currentWeightKg" error={errors.currentWeightKg?.message}>
          <input id="currentWeightKg" inputMode="decimal" className={inputClassName} {...register("currentWeightKg")} />
        </FormField>
      </div>

      <FormField label="Aktivite seviyesi" htmlFor="activityLevel" error={errors.activityLevel?.message}>
        <select id="activityLevel" className={inputClassName} {...register("activityLevel")}>
          <option value="">Seçiniz</option>
          {activityLevelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Gizlilik" htmlFor="privacyLevel" error={errors.privacyLevel?.message}>
        <select id="privacyLevel" className={inputClassName} {...register("privacyLevel")}>
          {privacyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <button type="submit" disabled={profileMutation.isPending} className={primaryButtonClassName}>
        {profileMutation.isPending ? "Kaydediliyor..." : "Devam Et"}
      </button>
    </form>
  );
}
