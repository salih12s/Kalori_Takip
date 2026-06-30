import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName } from "../../../lib/ui";
import { useAddActivity } from "../hooks/useAddActivity";
import { activityEntrySchema, type ActivityEntryFormValues } from "../schemas/activity.schema";
import type { ActivityType } from "../types/activity.types";
import { activityTypeLabels, activityTypes } from "../utils/activity-labels";

function optionalNumber(value?: string): number | undefined {
  return value ? Number(value) : undefined;
}

export function ActivityEntryForm({ date }: { date: string }) {
  const addMutation = useAddActivity();
  const { register, reset, handleSubmit, formState: { errors } } = useForm<ActivityEntryFormValues>({
    resolver: zodResolver(activityEntrySchema),
    defaultValues: { activityType: "RUN", steps: "", distanceKm: "", durationMinutes: "", caloriesBurned: "", note: "" },
  });

  const onSubmit = (values: ActivityEntryFormValues) => {
    addMutation.mutate(
      {
        date,
        activityType: values.activityType as ActivityType,
        steps: optionalNumber(values.steps),
        distanceKm: optionalNumber(values.distanceKm),
        durationMinutes: optionalNumber(values.durationMinutes),
        caloriesBurned: optionalNumber(values.caloriesBurned),
        note: values.note?.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Aktivite eklendi.");
          reset();
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
      }
    );
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Aktivite Ekle</h2>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <FormField label="Aktivite tipi" htmlFor="activityType" error={errors.activityType?.message}>
          <select id="activityType" className={inputClassName} {...register("activityType")}>
            {activityTypes.map((type) => <option key={type} value={type}>{activityTypeLabels[type]}</option>)}
          </select>
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Adım" htmlFor="steps" error={errors.steps?.message}><input id="steps" inputMode="numeric" className={inputClassName} {...register("steps")} /></FormField>
          <FormField label="Mesafe (km)" htmlFor="distanceKm" error={errors.distanceKm?.message}><input id="distanceKm" inputMode="decimal" className={inputClassName} {...register("distanceKm")} /></FormField>
          <FormField label="Süre (dk)" htmlFor="durationMinutes" error={errors.durationMinutes?.message}><input id="durationMinutes" inputMode="numeric" className={inputClassName} {...register("durationMinutes")} /></FormField>
          <FormField label="Yakılan kalori" htmlFor="caloriesBurned" error={errors.caloriesBurned?.message}><input id="caloriesBurned" inputMode="numeric" className={inputClassName} {...register("caloriesBurned")} /></FormField>
        </div>
        <FormField label="Not" htmlFor="activityNote" error={errors.note?.message}><textarea id="activityNote" rows={3} className={inputClassName} {...register("note")} /></FormField>
        <button type="submit" disabled={addMutation.isPending} className={primaryButtonClassName}>{addMutation.isPending ? "Ekleniyor..." : "Aktivite Ekle"}</button>
      </form>
    </section>
  );
}
