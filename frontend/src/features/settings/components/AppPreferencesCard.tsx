import { useState } from "react";

import { FormField } from "../../../components/shared/FormField";
import { inputClassName } from "../../../lib/ui";

/** Local-only UI preferences. Persisted to localStorage; no backend involved. */
const THEME_KEY = "fitboard_pref_theme";
const UNIT_KEY = "fitboard_pref_unit";

function readPref(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writePref(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore storage errors */
  }
}

const themeOptions = [
  { value: "system", label: "Sistem varsayılanı" },
  { value: "light", label: "Açık" },
  { value: "dark", label: "Koyu" },
];

const unitOptions = [
  { value: "metric", label: "Metrik sistem" },
  { value: "imperial", label: "İngiliz sistemi" },
];

export function AppPreferencesCard() {
  const [theme, setTheme] = useState(() => readPref(THEME_KEY, "system"));
  const [unit, setUnit] = useState(() => readPref(UNIT_KEY, "metric"));

  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-stone-900">Uygulama Tercihleri</h2>
        <p className="text-sm text-stone-500">Tercihlerin yalnızca bu cihazda saklanır.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Tema tercihi" htmlFor="themePref">
          <select
            id="themePref"
            className={inputClassName}
            value={theme}
            onChange={(event) => {
              setTheme(event.target.value);
              writePref(THEME_KEY, event.target.value);
            }}
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Birim tercihi" htmlFor="unitPref">
          <select
            id="unitPref"
            className={inputClassName}
            value={unit}
            onChange={(event) => {
              setUnit(event.target.value);
              writePref(UNIT_KEY, event.target.value);
            }}
          >
            {unitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </section>
  );
}
