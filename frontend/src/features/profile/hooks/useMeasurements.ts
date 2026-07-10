import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { measurementsApi } from "../api/measurements.api";
import type { MeasurementInput } from "../types/measurement.types";

export function useMeasurements() {
  return useQuery({ queryKey: ["measurements"], queryFn: measurementsApi.list });
}

export function useSaveMeasurement() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (input: MeasurementInput) => measurementsApi.save(input), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["measurements"] }) });
}
