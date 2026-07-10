import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSaveMeasurement, useMeasurements } from "../hooks/useMeasurements";

const fields = [["weightKg", "Kilo (kg)"], ["neckCm", "Boyun (cm)"], ["waistCm", "Bel (cm)"], ["shoulderCm", "Omuz (cm)"], ["hipCm", "Kalça (cm)"]] as const;
type Key = typeof fields[number][0];

export function MeasurementHistoryCard() {
  const query = useMeasurements();
  const save = useSaveMeasurement();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [values, setValues] = useState<Partial<Record<Key, string>>>({});
  const rows = query.data ?? [];
  const chart = useMemo(() => rows.filter((row) => row.weightKg != null).slice(-12), [rows]);
  const max = Math.max(...chart.map((row) => row.weightKg ?? 0), 1);
  const min = Math.min(...chart.map((row) => row.weightKg ?? max), max);
  const points = chart.map((row, index) => `${chart.length === 1 ? 50 : (index / (chart.length - 1)) * 100},${90 - (((row.weightKg ?? min) - min) / Math.max(max - min, 1)) * 75}`).join(" ");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate({ date, ...Object.fromEntries(fields.map(([key]) => [key, values[key] ? Number(values[key]) : null])) } as never);
  };

  return <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm xl:col-span-2">
    <h2 className="text-lg font-semibold text-stone-900">Ölçüm geçmişi</h2>
    <p className="mt-1 text-sm text-stone-500">Haftalık kilo ve beden ölçülerini kaydet, değişimi takip et.</p>
    <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <label className="text-xs font-medium text-stone-600">Tarih<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm" /></label>
      {fields.map(([key, label]) => <label key={key} className="text-xs font-medium text-stone-600">{label}<input type="number" step="0.1" min="0" value={values[key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))} className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm" /></label>)}
      <button disabled={save.isPending} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">{save.isPending ? "Kaydediliyor…" : "Ölçümü kaydet"}</button>
    </form>
    {chart.length > 0 && <div className="mt-6"><div className="mb-2 flex justify-between text-sm"><span className="font-semibold text-stone-700">Kilo grafiği</span><span className="text-stone-500">{chart[chart.length - 1]?.weightKg} kg</span></div><svg viewBox="0 0 100 100" className="h-40 w-full overflow-visible rounded-xl bg-emerald-50/50" role="img" aria-label="Kilo geçmişi grafiği"><polyline points={points} fill="none" stroke="#059669" strokeWidth="2" vectorEffect="non-scaling-stroke" />{chart.map((row, i) => <circle key={row.date} cx={chart.length === 1 ? 50 : (i / (chart.length - 1)) * 100} cy={90 - (((row.weightKg ?? min) - min) / Math.max(max - min, 1)) * 75} r="2" fill="#047857" />)}</svg></div>}
  </section>;
}
