import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName } from "../../../lib/ui";
import { useAddWaterLog } from "../hooks/useAddWaterLog";
import { waterLogSchema, type WaterLogFormValues } from "../schemas/activity.schema";

export function WaterLogForm({ date }: { date: string }) {
  const addMutation = useAddWaterLog();
  const { register, reset, handleSubmit, formState: { errors } } = useForm<WaterLogFormValues>({
    resolver: zodResolver(waterLogSchema),
    defaultValues: { amountMl: "500" },
  });

  const onSubmit = (values: WaterLogFormValues) => {
    addMutation.mutate({ date, amountMl: Number(values.amountMl) }, {
      onSuccess: () => {
        toast.success("Su kaydı eklendi.");
        reset();
      },
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Su Ekle</h2>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <FormField label="Su miktarı (ml)" htmlFor="amountMl" error={errors.amountMl?.message}>
          <input id="amountMl" inputMode="numeric" className={inputClassName} {...register("amountMl")} />
        </FormField>
        <button type="submit" disabled={addMutation.isPending} className={primaryButtonClassName}>{addMutation.isPending ? "Ekleniyor..." : "Su Kaydı Ekle"}</button>
      </form>
    </section>
  );
}
