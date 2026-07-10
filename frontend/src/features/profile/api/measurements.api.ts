import { api, type ApiResponse } from "../../../lib/api";
import type { MeasurementInput, MeasurementLog } from "../types/measurement.types";

export const measurementsApi = {
  async list() {
    const response = await api.get<ApiResponse<{ measurements: MeasurementLog[] }>>("/measurements");
    return response.data?.measurements ?? [];
  },
  async save(input: MeasurementInput) {
    const response = await api.post<ApiResponse<{ measurement: MeasurementLog }>>("/measurements", input);
    return response.data!.measurement;
  }
};
