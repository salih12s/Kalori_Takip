import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName } from "../../../lib/ui";
import { useOnboarding } from "../hooks/useOnboarding";
import { profileStepSchema, type ProfileStepValues } from "../schemas/onboarding.schema";
import type { Gender, PrivacyLevel, ProfileResponse, UpdateProfilePayload } from "../types/onboarding.types";

interface ProfileStepFormProps {
  profile: ProfileResponse | null;
  onComplete: () => void;
}

const genderOptions: Array<{ value: Gender; label: string }> = [
  { value: "MALE", label: "Erkek" },
  { value: "FEMALE", label: "Kadın" },
  { value: "OTHER", label: "Diğer" },
  { value: "PREFER_NOT_TO_SAY", label: "Belirtmek istemiyorum" },
];

const privacyOptions: Array<{ value: PrivacyLevel; label: string }> = [
  { value: "PUBLIC", label: "Herkese Açık" },
  { value: "FRIENDS", label: "Arkadaşlar" },
  { value: "PRIVATE", label: "Gizli" },
];

function buildPayload(values: ProfileStepValues): UpdateProfilePayload {
  return {
    fullName: values.fullName.trim(),
    bio: values.bio?.trim() || undefined,
    gender: values.gender as Gender,
    birthDate: values.birthDate,
    heightCm: Number(values.heightCm),
    currentWeightKg: Number(values.currentWeightKg),
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
      bio: "",
      gender: "PREFER_NOT_TO_SAY",
      birthDate: "",
      heightCm: "",
      currentWeightKg: "",
      privacyLevel: "FRIENDS",
    },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      fullName: profile.fullName ?? "",
      bio: profile.bio ?? "",
      gender: profile.gender ?? "PREFER_NOT_TO_SAY",
      birthDate: profile.birthDate?.slice(0, 10) ?? "",
      heightCm: profile.heightCm ? String(profile.heightCm) : "",
      currentWeightKg: profile.currentWeightKg ? String(profile.currentWeightKg) : "",
      privacyLevel: profile.privacyLevel,
    });
  }, [profile, reset]);

  const onSubmit = (values: ProfileStepValues) => {
    profileMutation.mutate(buildPayload(values), {
      onSuccess: () => {
        toast.success("Profil bilgilerin kaydedildi");
        onComplete();
      },
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Ad Soyad" htmlFor="fullName" error={errors.fullName?.message}>
        <input id="fullName" className={inputClassName} {...register("fullName")} />
      </FormField>

      <FormField label="Kısa açıklama" htmlFor="bio" error={errors.bio?.message}>
        <textarea id="bio" rows={3} className={inputClassName} {...register("bio")} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Cinsiyet" htmlFor="gender" error={errors.gender?.message}>
          <select id="gender" className={inputClassName} {...register("gender")}>
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
