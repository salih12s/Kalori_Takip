import { isAxiosError } from "axios";

import { http } from "../services/http";

/** Standard backend response envelope: { success, message, data }. */
export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data?: TData;
}

/**
 * Thin, typed convenience wrapper over the shared axios instance.
 * Returns the response body (the envelope) directly so callers can read `.data`.
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

/** Maps known backend (English) messages to Turkish user-facing copy. */
const errorMessageMap: Record<string, string> = {
  "Invalid email or password": "E-posta veya şifre hatalı.",
  "Email is already in use": "Bu e-posta zaten kullanılıyor.",
  "Username is already in use": "Bu kullanıcı adı zaten kullanılıyor.",
  "User not found": "Kullanıcı bulunamadı.",
};

/**
 * Extracts a Turkish, user-facing message from an API/network error.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Bir hata oluştu. Lütfen tekrar dene."
): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return "Sunucuya ulaşılamıyor. Lütfen bağlantını kontrol et.";
    }
    const backendMessage = (error.response.data as { message?: string } | undefined)?.message;
    if (backendMessage) {
      return errorMessageMap[backendMessage] ?? backendMessage;
    }
  }
  return fallback;
}
