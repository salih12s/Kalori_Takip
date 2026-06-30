import axios, { type AxiosInstance } from "axios";

import { env } from "../lib/env";

/**
 * Shared axios instance for talking to the FitBoard backend.
 * Auth wiring is intentionally a placeholder for now (Phase 8 is layout only).
 */
export const http: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: placeholder for future auth token injection.
http.interceptors.request.use((config) => {
  // const token = getAuthToken();
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: keep a single place for basic error handling.
http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
