import axios, { type AxiosInstance } from "axios";

import { authStorage } from "../features/auth/utils/auth-storage";
import { env } from "../lib/env";

/**
 * Shared axios instance for talking to the FitBoard backend.
 * Injects the bearer token when present and clears it on authenticated 401s.
 */
export const http: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach the stored auth token when available.
http.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: drop an invalid/expired token so route guards redirect.
// A 401 without a stored token (e.g. wrong login credentials) is left untouched
// so the form can show its own message.
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && authStorage.getToken()) {
      authStorage.clearToken();
    }
    return Promise.reject(error);
  }
);
