import { prisma } from "../../database/prisma.js";
import type { MeasurementInput } from "./measurements.validation.js";

const dateOf = (date: string) => new Date(`${date}T00:00:00.000Z`);
const map = (item: any) => ({ ...item, weightKg: item.weightKg == null ? null : Number(item.weightKg), neckCm: item.neckCm == null ? null : Number(item.neckCm), waistCm: item.waistCm == null ? null : Number(item.waistCm), shoulderCm: item.shoulderCm == null ? null : Number(item.shoulderCm), hipCm: item.hipCm == null ? null : Number(item.hipCm) });

export const measurementsService = {
  async list(userId: string) {
    const rows = await prisma.measurementLog.findMany({ where: { userId }, orderBy: { date: "asc" }, take: 52 });
    return rows.map(map);
  },
  async upsert(userId: string, input: MeasurementInput) {
    const row = await prisma.measurementLog.upsert({
      where: { userId_date: { userId, date: dateOf(input.date) } },
      create: { userId, ...input, date: dateOf(input.date) },
      update: { ...input, date: dateOf(input.date) }
    });
    return map(row);
  }
};
