export interface MeasurementLog {
  id: string;
  date: string;
  weightKg: number | null;
  neckCm: number | null;
  waistCm: number | null;
  shoulderCm: number | null;
  hipCm: number | null;
}

export type MeasurementInput = Omit<MeasurementLog, "id">;
