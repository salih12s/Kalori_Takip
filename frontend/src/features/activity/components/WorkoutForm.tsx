import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName } from "../../../lib/ui";
import { useAddWorkout } from "../hooks/useAddWorkout";
import { workoutSchema, type WorkoutFormValues } from "../schemas/activity.schema";
import type { WorkoutType } from "../types/activity.types";
import { workoutTypeLabels, workoutTypes } from "../utils/activity-labels";

function optionalInt(value?: string): number | undefined {
  return value ? Number(value) : undefined;
}

function parseMuscles(value?: string): string[] {
  return (value ?? "").split(",").map((item) => item.trim()).filter(Boolean);
}

export function WorkoutForm({ date }: { date: string }) {
  const addMutation = useAddWorkout();
  const { register, reset, handleSubmit, formState: { errors } } = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: { title: "", workoutType: "WEIGHT_TRAINING", muscleGroups: "", durationMinutes: "", caloriesBurned: "", intensity: "", note: "" },
  });

  const onSubmit = (values: WorkoutFormValues) => {
    addMutation.mutate(
      {
        date,
        title: values.title.trim(),
        workoutType: values.workoutType as WorkoutType,
        muscleGroups: parseMuscles(values.muscleGroups),
        durationMinutes: Number(values.durationMinutes),
        caloriesBurned: optionalInt(values.caloriesBurned),
        intensity: optionalInt(values.intensity),
        note: values.note?.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Spor kaydı eklendi.");
          reset();
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
      }
    );
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Spor Kaydı Ekle</h2>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <FormField label="Başlık" htmlFor="workoutTitle" error={errors.title?.message}><input id="workoutTitle" className={inputClassName} {...register("title")} /></FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Antrenman tipi" htmlFor="workoutType" error={errors.workoutType?.message}>
            <select id="workoutType" className={inputClassName} {...register("workoutType")}>{workoutTypes.map((type) => <option key={type} value={type}>{workoutTypeLabels[type]}</option>)}</select>
          </FormField>
          <FormField label="Süre (dk)" htmlFor="workoutDuration" error={errors.durationMinutes?.message}><input id="workoutDuration" inputMode="numeric" className={inputClassName} {...register("durationMinutes")} /></FormField>
          <FormField label="Yakılan kalori" htmlFor="workoutCalories" error={errors.caloriesBurned?.message}><input id="workoutCalories" inputMode="numeric" className={inputClassName} {...register("caloriesBurned")} /></FormField>
          <FormField label="Yoğunluk" htmlFor="intensity" error={errors.intensity?.message}><input id="intensity" inputMode="numeric" placeholder="1-10" className={inputClassName} {...register("intensity")} /></FormField>
        </div>
        <FormField label="Kas grupları" htmlFor="muscleGroups" error={errors.muscleGroups?.message}><input id="muscleGroups" placeholder="chest, triceps" className={inputClassName} {...register("muscleGroups")} /></FormField>
        <FormField label="Not" htmlFor="workoutNote" error={errors.note?.message}><textarea id="workoutNote" rows={3} className={inputClassName} {...register("note")} /></FormField>
        <button type="submit" disabled={addMutation.isPending} className={primaryButtonClassName}>{addMutation.isPending ? "Ekleniyor..." : "Spor Kaydı Ekle"}</button>
      </form>
    </section>
  );
}
