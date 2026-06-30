# Current State

## Phase

Phase 17 - External Food API + Cache is implemented.

## Completed work

- Extended existing nutrition search with optional source filtering:
  - `GET /api/foods/search?q=...`
  - `GET /api/foods/search?q=...&source=local`
  - `GET /api/foods/search?q=...&source=external`
  - `GET /api/foods/search?q=...&source=all`
- Kept the safest backward-compatible default: missing `source` uses `local`.
- Added Open Food Facts external search through a small provider layer.
- Added explicit external food import/cache endpoint:
  - `POST /api/foods/import-external`
- Imported external foods are stored in the existing `Food` table and can be used by the existing meal entry endpoint.
- Duplicate imports are prevented by provider + external id cache lookup and database uniqueness.
- Existing local food creation, local search, meal entry creation, meal deletion and daily total recalculation still work.
- Updated nutrition UI search to support:
  - `Tümü`
  - `Yerel`
  - `Dış Kaynak`
  - `Önbellekte`
  - `İçe Aktar`
  - `Eklenebilir`
- External results must be imported explicitly before adding to a meal.
- No barcode scanner, AI image recognition, paid API, Health Connect, HealthKit or Strava work was added.

## Schema changes

Additive Prisma migration:

- `backend/prisma/migrations/20260630123000_add_external_food_cache/migration.sql`

Food model additions:

- `externalProvider String?`
- `cachedAt DateTime?`
- `@@index([externalProvider, externalId])`
- `@@unique([externalProvider, externalId])`

Existing `Food.source` and `Food.externalId` fields were preserved. Existing local foods are not modified.

## Changed files

Backend:

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/20260630123000_add_external_food_cache/migration.sql`
- `backend/src/modules/nutrition/nutrition.routes.ts`
- `backend/src/modules/nutrition/nutrition.controller.ts`
- `backend/src/modules/nutrition/nutrition.service.ts`
- `backend/src/modules/nutrition/nutrition.repository.ts`
- `backend/src/modules/nutrition/nutrition.validation.ts`
- `backend/src/modules/nutrition/nutrition.types.ts`
- `backend/src/modules/nutrition/nutrition.mapper.ts`
- `backend/src/modules/nutrition/external/`

Frontend:

- `frontend/src/features/nutrition/api/nutrition.api.ts`
- `frontend/src/features/nutrition/hooks/useFoodSearch.ts`
- `frontend/src/features/nutrition/hooks/useImportExternalFood.ts`
- `frontend/src/features/nutrition/components/FoodSearchInput.tsx`
- `frontend/src/features/nutrition/components/AddFoodEntryDialog.tsx`
- `frontend/src/features/nutrition/types/nutrition.types.ts`

Docs:

- `docs/CURRENT_STATE.md`

## Commands run

```bash
npx prisma format
npm run prisma:migrate -- --name add_external_food_cache
npx prisma migrate deploy
npm run prisma:generate
npm run build
npm run build
npx prisma migrate status
npm run preview -- --host 127.0.0.1 --port 4197 --strictPort
git diff --check
```

Notes:

- `npm run prisma:migrate -- --name add_external_food_cache` stopped because Prisma Migrate refuses a non-interactive unique-constraint warning in this environment.
- The migration SQL was added manually and applied successfully with `npx prisma migrate deploy`.
- `npx prisma migrate status` reports the database schema is up to date.

## Backend external food check results

Live backend smoke test passed:

- `GET /api/health` returned success.
- Unauthenticated food search returned 401.
- Unauthenticated external import returned 401.
- Local food creation still works.
- Default local food search still returns local results.
- `source=all` search returned local + external-compatible response shape.
- `source=external` searched Open Food Facts successfully and returned 9 mapped results during the smoke test.
- `POST /api/foods/import-external` created a cached `Food`.
- Importing the same provider + external id twice returned the same cached food id.
- Imported food was added through `POST /api/meals/entries`.
- Daily totals updated after add.
- `DELETE /api/meals/entries/:entryId` still recalculated totals back to 0.

## Frontend nutrition check results

- `npm run build` passed with no TypeScript errors.
- Preview route smoke returned HTTP 200 for `/nutrition` and `/`.
- Nutrition search source filter appears in the UI source:
  - `Tümü`
  - `Yerel`
  - `Dış Kaynak`
  - `Önbellekte`
  - `İçe Aktar`
- Local/cached results can be selected directly.
- External results show an import button and are selected after successful import.
- User-facing text added in this phase is Turkish.

## Known issues

- Vite still reports the existing large chunk warning after production build. Build succeeds.
- Full browser automation is not installed; frontend verification used TypeScript build, Vite preview route smoke and source checks.
- External food search depends on Open Food Facts availability. If it fails, the backend returns local results and `externalSearchFailed: true` rather than failing the whole search.
- Smoke tests added local development database rows.

## Current phase status

Phase 17 is complete and ready to commit.

## Git commits

Latest committed work before this phase:

- `1df1c87 feat: add badges and streak gamification`

Next commit:

- `feat: add external food search cache`

## Next recommended step

Commit Phase 17, then only start the next explicitly requested phase.
