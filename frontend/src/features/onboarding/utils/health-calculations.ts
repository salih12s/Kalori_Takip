import type { ActivityLevel, Gender } from "../types/onboarding.types";

/**
 * Five independent calculators, each reverse-engineered from its own
 * agirsaglam.com page (BMI, water, protein, calorie/TDEE, FFMI). Each page
 * asks for different inputs and produces a different number for things like
 * "protein" or "water" — they are intentionally NOT unified into one shared
 * formula. Coefficients were calibrated by probing the live calculators with
 * known inputs and solving for the constants that reproduce their outputs
 * (documented per function). Treat all results as estimates, same as the
 * source site does.
 */

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

// ---------------------------------------------------------------------------
// 1. BMI — https://www.agirsaglam.com/vucut-kitle-indeksi-bmi/
// Inputs: gender (display only), height, weight. Standard WHO formula —
// confirmed exact match: 170cm/70kg -> 24.22 kg/m², ideal range 53.46-71.96kg.
// ---------------------------------------------------------------------------

export interface BmiResult {
  bmi: number;
  category: string;
  idealWeightMinKg: number;
  idealWeightMaxKg: number;
}

export function getBmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Zayıf";
  if (bmi < 25) return "İdeal";
  if (bmi < 30) return "Kilolu";
  return "Obez";
}

export function calculateBmi(heightCm: number, weightKg: number): BmiResult {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return {
    bmi,
    category: getBmiCategory(bmi),
    idealWeightMinKg: 18.5 * heightM * heightM,
    idealWeightMaxKg: 24.9 * heightM * heightM,
  };
}

// ---------------------------------------------------------------------------
// 2. Su — https://www.agirsaglam.com/gunluk-su-ihtiyaci-hesaplama/
// Inputs: weight, a 3-tier activity level (NOT the same 5-tier scale used
// elsewhere in the app), climate, pregnancy/breastfeeding. Reverse-engineered
// from the live widget (70kg baseline = 2.3L):
//   base = weight * 0.033 L/kg
//   + activity bonus: Sedanter 0 / Aktif +0.5 / Çok Aktif +0.9
//   + climate adjust: Serin -0.2 / Ilıman 0 / Sıcak ve Nemli +0.5 / Çöl +0.9
//   + Hamileyim +0.4, Emziriyorum +0.8
// All confirmed against multiple live data points. Cups = liters / 0.25L,
// confirmed exact (2.3L -> 9.2 bardak).
// ---------------------------------------------------------------------------

export type WaterActivityLevel = "SEDENTARY" | "ACTIVE" | "VERY_ACTIVE";
export type Climate = "COOL" | "TEMPERATE" | "HOT_HUMID" | "DESERT_TROPICAL";

const WATER_ACTIVITY_BONUS_L: Record<WaterActivityLevel, number> = {
  SEDENTARY: 0,
  ACTIVE: 0.5,
  VERY_ACTIVE: 0.9,
};

const WATER_CLIMATE_ADJUST_L: Record<Climate, number> = {
  COOL: -0.2,
  TEMPERATE: 0,
  HOT_HUMID: 0.5,
  DESERT_TROPICAL: 0.9,
};

export interface WaterResult {
  liters: number;
  cups: number;
}

export function calculateWater(params: {
  weightKg: number;
  activityLevel: WaterActivityLevel;
  climate: Climate;
  pregnant?: boolean;
  breastfeeding?: boolean;
}): WaterResult {
  let liters = params.weightKg * 0.033;
  liters += WATER_ACTIVITY_BONUS_L[params.activityLevel];
  liters += WATER_CLIMATE_ADJUST_L[params.climate];
  if (params.pregnant) liters += 0.4;
  if (params.breastfeeding) liters += 0.8;
  liters = clamp(round1(liters), 0.5, 8);
  const cups = round1(liters / 0.25);
  return { liters, cups };
}

// ---------------------------------------------------------------------------
// 3. Protein — https://www.agirsaglam.com/gunluk-protein-ihtiyaci-hesaplama/
// Inputs: target weight (current weight is collected but does NOT affect the
// result — confirmed by testing), body-fat awareness (Yüksek/Düşük/exact %),
// whether the user trains. Reverse-engineered from 4 live data points at
// target=70kg: fat 10/15/25/30% -> 130/122/108/101g, all fitting
// protein = leanMass(target, fat%) * 2.06 g/kg almost exactly. The Yüksek/
// Düşük presets imply ~13%/~10% body fat respectively (back-solved from
// 126g/130g). Training ("Spor & Vücut Geliştirme Yapıyorum") raises the
// per-kg rate to ~2.7 g/kg lean mass (from the 165g data point).
// ---------------------------------------------------------------------------

export type ProteinFatKnowledge = "HIGH" | "LOW" | "EXACT";

const PROTEIN_ASSUMED_FAT_PERCENT: Record<"HIGH" | "LOW", number> = {
  HIGH: 13,
  LOW: 10,
};

const PROTEIN_G_PER_KG_LBM = {
  RESTING: 2.06,
  TRAINING: 2.7,
};

export interface ProteinResult {
  proteinGrams: number;
  leanMassKg: number;
  targetWeightKg: number;
}

export function calculateProtein(params: {
  targetWeightKg: number;
  fatKnowledge: ProteinFatKnowledge;
  exactFatPercent?: number;
  training: boolean;
}): ProteinResult {
  const fatPercent =
    params.fatKnowledge === "EXACT"
      ? clamp(params.exactFatPercent ?? 15, 3, 60)
      : PROTEIN_ASSUMED_FAT_PERCENT[params.fatKnowledge];
  const leanMassKg = params.targetWeightKg * (1 - fatPercent / 100);
  const gPerKg = params.training ? PROTEIN_G_PER_KG_LBM.TRAINING : PROTEIN_G_PER_KG_LBM.RESTING;
  return {
    proteinGrams: clamp(Math.round(leanMassKg * gPerKg), 20, 400),
    leanMassKg,
    targetWeightKg: params.targetWeightKg,
  };
}

// ---------------------------------------------------------------------------
// 4. Kalori — https://www.agirsaglam.com/gunluk-kalori-ihtiyaci-hesaplama/
// Inputs: gender, weight, exact body-fat %, a 5-tier activity level (this one
// DOES match the app's shared ActivityLevel scale exactly — confirmed the
// multipliers 1.2/1.375/1.55/1.725/1.9 reproduce the live TDEE for all 5
// tiers), and a goal. BMR uses Katch-McArdle (confirmed exact: 80kg/20% fat
// -> LBM 64kg -> BMR 1752). Goal multiplier confirmed from live data: Yağ
// Kaybetme 0.87, İdare-i maslahat 1.0, Kütle Kazanma 1.12. The live site also
// bundles a protein/fat/carb breakdown into this page, but this app keeps
// the calorie tab focused on calories only — protein has its own dedicated
// tab, and fat/carb goals aren't tracked from this calculator.
// ---------------------------------------------------------------------------

export type CalorieGoal = "LOSE" | "MAINTAIN" | "GAIN";

export const CALORIE_ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  ACTIVE: 1.725,
  VERY_ACTIVE: 1.9,
};

const CALORIE_GOAL_MULTIPLIER: Record<CalorieGoal, number> = {
  LOSE: 0.87,
  MAINTAIN: 1.0,
  GAIN: 1.12,
};

export interface CalorieResult {
  bmr: number;
  tdee: number;
  goalCalories: number;
}

export function calculateCalorieNeeds(params: {
  weightKg: number;
  bodyFatPercent: number;
  activityLevel: ActivityLevel;
  goal: CalorieGoal;
}): CalorieResult {
  const fatPercent = clamp(params.bodyFatPercent, 3, 60);
  const leanMassKg = params.weightKg * (1 - fatPercent / 100);
  const bmr = 370 + 21.6 * leanMassKg;
  const tdee = bmr * CALORIE_ACTIVITY_MULTIPLIER[params.activityLevel];
  const goalCalories = tdee * CALORIE_GOAL_MULTIPLIER[params.goal];

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    goalCalories: clamp(Math.round(goalCalories), 1000, 6000),
  };
}

// ---------------------------------------------------------------------------
// 5. FFMI — https://www.agirsaglam.com/ffmi/
// Inputs (site, men only): height, weight, neck/waist/shoulder circumference.
// Reverse-engineered: body fat comes from the classic US Navy circumference
// method (neck+waist+height for men), confirmed exact — 170cm/40cm neck/80cm
// waist -> 11.9% (site shows 11.87%). LBM = weight*(1-bf%), confirmed exact
// (61.69kg). FFMI = LBM/height² normalized by +6.1*(1.8-heightM), confirmed
// exact (21.96). Shoulder circumference is NOT part of the body-fat/FFMI
// math — the site only uses it for a separate "shoulder:waist ratio" stat.
// The site has no female variant ("Erkekler içindir"); this app extends the
// same Navy method to women using the standard female formula (neck+waist+
// hip+height) so both genders get a result — that extension is ours, not
// the source site's.
// ---------------------------------------------------------------------------

export interface FfmiResult {
  bodyFatPercent: number;
  leanMassKg: number;
  ffmi: number;
  ffmiCategory: string;
  shoulderWaistRatio: number | null;
}

export function getFfmiCategory(ffmi: number): string {
  if (ffmi < 18) return "Ortalama Altı";
  if (ffmi < 20) return "Ortalama";
  if (ffmi < 22) return "Atletik";
  if (ffmi < 25) return "Kaslı";
  return "Muhtemel Doping Sınırı";
}

function navyBodyFatMale(heightCm: number, neckCm: number, waistCm: number): number {
  return (
    495 /
      (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) -
    450
  );
}

function navyBodyFatFemale(heightCm: number, neckCm: number, waistCm: number, hipCm: number): number {
  return (
    495 /
      (1.29579 -
        0.35004 * Math.log10(waistCm + hipCm - neckCm) +
        0.221 * Math.log10(heightCm)) -
    450
  );
}

export function calculateFfmi(params: {
  gender: Gender;
  heightCm: number;
  weightKg: number;
  neckCm: number;
  waistCm: number;
  shoulderCm?: number;
  hipCm?: number;
}): FfmiResult {
  const rawBodyFat =
    params.gender === "MALE"
      ? navyBodyFatMale(params.heightCm, params.neckCm, params.waistCm)
      : navyBodyFatFemale(params.heightCm, params.neckCm, params.waistCm, params.hipCm ?? params.waistCm);
  const bodyFatPercent = clamp(rawBodyFat, 3, 60);
  const leanMassKg = params.weightKg * (1 - bodyFatPercent / 100);
  const heightM = params.heightCm / 100;
  const ffmi = leanMassKg / (heightM * heightM) + 6.1 * (1.8 - heightM);

  return {
    bodyFatPercent,
    leanMassKg,
    ffmi,
    ffmiCategory: getFfmiCategory(ffmi),
    shoulderWaistRatio:
      params.gender === "MALE" && params.shoulderCm ? params.shoulderCm / params.waistCm : null,
  };
}
