import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName } from "../../../lib/ui";
import { useSetOffDay } from "../hooks/useSetOffDay";
import { offDaySchema, type OffDayFormValues } from "../schemas/activity.schema";
import type { ActivityTotalsResponse } from "../types/activity.types";

export function OffDayCard({ date, totals }: { date: string; totals: ActivityTotalsResponse }) {
  const setOffDayMutation = useSetOffDay();
  const { register, reset, watch, handleSubmit, formState: { errors } } = useForm<OffDayFormValues>({
    resolver: zodResolver(offDaySchema),
    defaultValues: { isOffDay: totals.isOffDay, note: totals.note ?? "" },
  });
  const isOffDay = watch("isOffDay");

  useEffect(() => {
    reset({ isOffDay: totals.isOffDay, note: totals.note ?? "" });
  }, [totals.isOffDay, totals.note, reset]);

  const onSubmit = (values: OffDayFormValues) => {
    setOffDayMutation.mutate(
      { date, isOffDay: values.isOffDay, note: values.note?.trim() || undefined },
      {
        onSuccess: () => toast.success(values.isOffDay ? "Dinlenme günü olarak işaretlendi." : "Dinlenme günü kaldırıldı."),
        onError: (error) => toast.error(getApiErrorMessage(error)),
      }
    );
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Dinlenme Günü</h2>
      <p className="mt-1 text-sm text-stone-500">{totals.isOffDay ? "Bu gün dinlenme günü olarak işaretli." : "Bu gün dinlenme günü olarak işaretli değil."}</p>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
          <input type="checkbox" className="h-4 w-4 rounded border-stone-300 text-emerald-600" {...register("isOffDay")} />
          Dinlenme günü olarak işaretle
        </label>
        <FormField label="Not" htmlFor="offDayNote" error={errors.note?.message}>
          <textarea id="offDayNote" rows={3} disabled={!isOffDay} className={inputClassName} {...register("note")} />
        </FormField>
        <button type="submit" disabled={setOffDayMutation.isPending} className={primaryButtonClassName}>{setOffDayMutation.isPending ? "Kaydediliyor..." : "Kaydet"}</button>
      </form>
    </section>
  );
}
