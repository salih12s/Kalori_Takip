import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName, secondaryButtonClassName } from "../../../lib/ui";
import { useCreateChallenge } from "../hooks/useCreateChallenge";
import { createChallengeSchema, type CreateChallengeFormValues } from "../schemas/challenge.schema";
import type { ChallengeType } from "../types/challenge.types";
import { challengeTypeOptions, defaultUnitByType } from "../utils/challenge-labels";

interface CreateChallengeDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateChallengeDialog({ open, onClose }: CreateChallengeDialogProps) {
  const createMutation = useCreateChallenge();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateChallengeFormValues>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "STEPS",
      targetValue: "",
      unit: "adım",
      startsAt: "",
      endsAt: "",
      isPublic: true,
    },
  });

  if (!open) return null;

  const typeField = register("type");

  const closeDialog = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: CreateChallengeFormValues) => {
    createMutation.mutate(
      {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        type: values.type as ChallengeType,
        targetValue: Number(values.targetValue),
        unit: values.unit.trim(),
        startsAt: values.startsAt,
        endsAt: values.endsAt,
        isPublic: values.isPublic,
      },
      {
        onSuccess: () => {
          toast.success("Challenge oluşturuldu.");
          closeDialog();
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/30 px-4 py-6">
      <section className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-stone-200 bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Yeni Challenge Oluştur</h2>
            <p className="text-sm text-stone-500">Bir hedef belirle ve arkadaşlarını davet et.</p>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Kapat"
            className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X size={18} />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Başlık" htmlFor="title" error={errors.title?.message}>
            <input id="title" className={inputClassName} {...register("title")} />
          </FormField>

          <FormField label="Açıklama" htmlFor="description" error={errors.description?.message}>
            <input id="description" className={inputClassName} {...register("description")} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Challenge türü" htmlFor="type" error={errors.type?.message}>
              <select
                id="type"
                className={inputClassName}
                {...typeField}
                onChange={(event) => {
                  void typeField.onChange(event);
                  setValue("unit", defaultUnitByType[event.target.value as ChallengeType]);
                }}
              >
                {challengeTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Birim" htmlFor="unit" error={errors.unit?.message}>
              <input id="unit" className={inputClassName} {...register("unit")} />
            </FormField>

            <FormField label="Hedef değer" htmlFor="targetValue" error={errors.targetValue?.message}>
              <input id="targetValue" inputMode="numeric" className={inputClassName} {...register("targetValue")} />
            </FormField>

            <div className="flex items-center gap-2 pt-7">
              <input id="isPublic" type="checkbox" className="h-4 w-4 rounded border-stone-300" {...register("isPublic")} />
              <label htmlFor="isPublic" className="text-sm font-medium text-stone-700">
                Herkese açık
              </label>
            </div>

            <FormField label="Başlangıç tarihi" htmlFor="startsAt" error={errors.startsAt?.message}>
              <input id="startsAt" type="date" className={inputClassName} {...register("startsAt")} />
            </FormField>

            <FormField label="Bitiş tarihi" htmlFor="endsAt" error={errors.endsAt?.message}>
              <input id="endsAt" type="date" className={inputClassName} {...register("endsAt")} />
            </FormField>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={closeDialog} className={secondaryButtonClassName}>
              İptal
            </button>
            <button type="submit" disabled={createMutation.isPending} className={primaryButtonClassName}>
              {createMutation.isPending ? "Oluşturuluyor..." : "Challenge Oluştur"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
