import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName } from "../../../lib/ui";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { profileFormSchema, type ProfileFormValues } from "../schemas/profile.schema";
import type { Gender, PrivacyLevel, ProfileResponse, UpdateProfilePayload } from "../types/profile.types";
import { genderOptions, privacyOptions } from "../utils/profile-labels";

interface ProfileFormProps {
  profile: ProfileResponse;
}

function buildPayload(values: ProfileFormValues): UpdateProfilePayload {
  const payload: UpdateProfilePayload = {
    fullName: values.fullName.trim(),
    gender: values.gender as Gender,
    birthDate: values.birthDate,
    heightCm: Number(values.heightCm),
    currentWeightKg: Number(values.currentWeightKg),
    privacyLevel: values.privacyLevel as PrivacyLevel,
  };
  const bio = values.bio?.trim();
  if (bio) payload.bio = bio;
  return payload;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const updateMutation = useUpdateProfile();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: profile.fullName ?? "",
      bio: profile.bio ?? "",
      gender: profile.gender ?? "",
      birthDate: profile.birthDate ? profile.birthDate.slice(0, 10) : "",
      heightCm: profile.heightCm != null ? String(profile.heightCm) : "",
      currentWeightKg: profile.currentWeightKg != null ? String(profile.currentWeightKg) : "",
      privacyLevel: profile.privacyLevel ?? "FRIENDS",
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    updateMutation.mutate(buildPayload(values), {
      onSuccess: () => toast.success("Profil güncellendi."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-stone-900">Profil Bilgileri</h2>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Ad Soyad" htmlFor="fullName" error={errors.fullName?.message}>
          <input id="fullName" className={inputClassName} {...register("fullName")} />
        </FormField>

        <FormField label="Kısa açıklama" htmlFor="bio" error={errors.bio?.message}>
          <input id="bio" className={inputClassName} {...register("bio")} />
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

        <button type="submit" disabled={updateMutation.isPending} className={`${primaryButtonClassName} sm:w-auto`}>
          {updateMutation.isPending ? "Kaydediliyor..." : "Profili Kaydet"}
        </button>
      </form>
    </section>
  );
}
