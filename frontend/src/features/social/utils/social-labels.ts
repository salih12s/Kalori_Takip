import type { PrivacyLevel } from "../types/social.types";

export const privacyLabels: Record<PrivacyLevel, string> = {
  PUBLIC: "Herkese Açık",
  FRIENDS: "Arkadaşlar",
  PRIVATE: "Gizli",
};

/** Two-letter fallback avatar text from a username. */
export function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

/** Localized short date, e.g. 30.06.2026. */
export function formatShortDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("tr-TR");
}
