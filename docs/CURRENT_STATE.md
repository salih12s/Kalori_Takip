# Current State

## Phase

Post-MVP UX improvement - Nutrition External Search UX Fix + Auto Food Data + Light Animations is complete.

## Completed work

- Improved Nutrition page UX so normal users no longer start with manual calorie/macro entry.
- Removed the prominent top-level `Yeni Yemek` action from the Nutrition page header.
- Kept manual food creation as a secondary fallback inside the add food dialog via `Manuel ekle`.
- Made food search external-first by default.
- Fixed Turkish common food search behavior for terms such as `yumurta`.
- Added a small Turkish alias and common food fallback layer for Open Food Facts searches.
- Preserved the existing `Food` table, cache/import flow, duplicate prevention and meal entry creation.
- Added result cards that show food name, serving, calories, protein, carbs and fat before selection.
- External results now use `İçe Aktar ve Ekle`; cached/local results use `Seç ve Ekle`.
- Added selected food preview before quantity/unit entry.
- Added light Motion animations for dialog content, result cards and selected food preview.
- Added root `npm run dev` support so backend and frontend can run together.

## Backend fixes

- `backend/src/modules/nutrition/external/open-food-facts.provider.ts`
  - Added Turkish query alias fallback.
  - Alias-backed searches now prefer the alias first, avoiding irrelevant Open Food Facts results for Turkish terms.
  - Kept timeout handling and safe development-only metadata logging.
  - Merges common fallback results with Open Food Facts results and de-duplicates by `externalId`.
- `backend/src/modules/nutrition/external/common-food-fallbacks.ts`
  - Added a small maintainable set of common food fallback values for common Turkish searches.
- `backend/src/modules/nutrition/nutrition.service.ts`
  - `source=all` now returns external results first, then cached/local results.

## Frontend UX changes

- `frontend/src/features/nutrition/pages/NutritionPage.tsx`
  - Removed the prominent manual `Yeni Yemek` header action.
- `frontend/src/features/nutrition/components/AddFoodEntryDialog.tsx`
  - External-first search flow.
  - Selected food preview.
  - Only quantity and unit are entered after selection.
  - Manual create is a secondary fallback.
- `frontend/src/features/nutrition/components/FoodSearchInput.tsx`
  - Defaults to `Dış kaynakta ara`.
  - Separates external results from `Önbellekteki Yemekler`.
  - Shows friendly Turkish external failure/empty messages.
- `frontend/src/features/nutrition/components/CreateFoodDialog.tsx`
  - Retitled to `Manuel Yemek Ekle`.
  - Clarifies that manual creation is for foods not found externally.

## Animation changes

- Dialog content uses subtle fade/scale.
- Food result cards use subtle fade/slide and hover lift.
- Selected food preview fades in.
- Existing skeleton/loading behavior remains unchanged.

## Changed files

Backend:

- `backend/src/modules/nutrition/external/open-food-facts.provider.ts`
- `backend/src/modules/nutrition/external/common-food-fallbacks.ts`
- `backend/src/modules/nutrition/nutrition.service.ts`

Frontend:

- `frontend/src/features/nutrition/components/AddFoodEntryDialog.tsx`
- `frontend/src/features/nutrition/components/CreateFoodDialog.tsx`
- `frontend/src/features/nutrition/components/FoodSearchInput.tsx`
- `frontend/src/features/nutrition/components/FoodResultCard.tsx`
- `frontend/src/features/nutrition/components/FoodSourceTabs.tsx`
- `frontend/src/features/nutrition/components/SelectedFoodPreview.tsx`
- `frontend/src/features/nutrition/pages/NutritionPage.tsx`
- `frontend/src/features/nutrition/utils/food-emoji.ts`

Project/dev:

- `package.json`
- `package-lock.json`
- `README.md`
- `docs/CURRENT_STATE.md`

## Commands run

```bash
npm install
npm run prisma:generate
npx prisma migrate status
npm run build
npm run build
npm run preview -- --host 127.0.0.1 --port 4199 --strictPort
git diff --check
```

Also tested root development startup earlier:

```bash
npm run dev
```

## Backend check results

Live backend smoke test passed:

- `GET /api/health` returned success.
- Authenticated `GET /api/foods/search?q=yumurta&source=external` returned:
  - `externalSearchFailed = false`
  - `10` results
  - first result `Yumurta`
  - first result `155 kcal`
- Authenticated `GET /api/foods/search?q=egg&source=external` returned a clean external result.
- Authenticated `GET /api/foods/search?q=yumurta&source=all` returned external results first.
- Imported the first external/common food result.
- Duplicate import returned the same food id.
- Added imported food to a meal through `POST /api/meals/entries`.
- Daily totals updated to `155 kcal` and `13g protein` for the smoke entry.

## Frontend check results

- `npm run build` passed.
- Preview route smoke returned HTTP 200 for `/nutrition`.
- `NutritionPage` no longer contains the top-level `Yeni Yemek` action.
- Added/verified Turkish UI copy:
  - `Dış kaynakta ara`
  - `İçe Aktar ve Ekle`
  - `Seçilen Yemek`
  - `Manuel ekle`
  - `Öğüne Ekle`
- File sizes remain within project limits:
  - `FoodSearchInput.tsx`: 144 lines
  - `AddFoodEntryDialog.tsx`: 119 lines
  - `NutritionPage.tsx`: 73 lines

## Known issues

- Open Food Facts can still be intermittently unavailable. For common Turkish foods, the app now has a small fallback so the user can still select/import food data.
- Full browser automation is not installed; frontend validation used TypeScript build, Vite preview route smoke and source checks.
- Smoke tests added local development database rows.

## Current project status

Nutrition normal flow is now external-first and no longer asks the user to manually enter calories/macros before searching.

## Git commits

Next commit:

- `feat: improve external-first nutrition search ux`

## Next recommended step

After commit, push the new post-MVP UX fix to GitHub.
