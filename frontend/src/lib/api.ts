import { http } from "../services/http";

/**
 * Thin, typed convenience wrapper over the shared axios instance.
 * Returns response data directly so feature hooks stay concise.
 * Not heavily used yet — Phase 8 only establishes the foundation.
 */
export const api = {
  async get<TResponse>(url: string, params?: unknown): Promise<TResponse> {
    const { data } = await http.get<TResponse>(url, { params });
    return data;
  },
  async post<TResponse>(url: string, body?: unknown): Promise<TResponse> {
    const { data } = await http.post<TResponse>(url, body);
    return data;
  },
  async put<TResponse>(url: string, body?: unknown): Promise<TResponse> {
    const { data } = await http.put<TResponse>(url, body);
    return data;
  },
  async patch<TResponse>(url: string, body?: unknown): Promise<TResponse> {
    const { data } = await http.patch<TResponse>(url, body);
    return data;
  },
  async delete<TResponse>(url: string): Promise<TResponse> {
    const { data } = await http.delete<TResponse>(url);
    return data;
  },
};
