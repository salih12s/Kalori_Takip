# Current State

## Phase

Phase 3.1 - Nutrition schema alignment is implemented.

## Completed work

- Aligned nutrition schema with the project nutrition design.
- Preserved existing `Food.userId` as the creator/owner field instead of duplicating it with `createdByUserId`.
- Added normalized search fields:
  - `Food.normalizedName`
  - `FoodAlias.normalizedAlias`
- Added soft-delete support:
  - `Food.deletedAt`
- Added optional nutrition detail fields:
  - `Food.fiber`
  - `Food.sugar`
  - `FoodEntry.fiber`
  - `FoodEntry.sugar`
- Added indexes for normalized search and deleted-food filtering.
- Backfilled existing food and alias rows in the migration.
- Updated `POST /api/foods` to save normalized name, normalized aliases, optional fiber, and optional sugar.
- Updated `GET /api/foods/search` to search:
  - `Food.name`
  - `Food.normalizedName`
  - `FoodAlias.alias`
  - `FoodAlias.normalizedAlias`
- Updated food search to exclude rows where `deletedAt` is not null.
- Updated `POST /api/meals/entries` to snapshot optional fiber and sugar.
- Kept DailyLog totals behavior unchanged for calories, protein, carbs, and fat.
- No frontend UI was created or changed.
- No dashboard, activity, social, leaderboard, external food API, barcode, or AI food recognition work was started.

## Schema changes

Migration:

- `backend/prisma/migrations/20260629234746_align_nutrition_schema/migration.sql`

Food:

- Added `normalizedName String @default("")`
- Kept `userId String?` as the existing creator/owner field.
- Added `deletedAt DateTime?`
- Added `fiber Decimal? @db.Decimal(8, 2)`
- Added `sugar Decimal? @db.Decimal(8, 2)`
- Added indexes for `normalizedName` and `deletedAt`

FoodAlias:

- Added `normalizedAlias String @default("")`
- Added index for `normalizedAlias`

FoodEntry:

- Added `fiber Decimal? @db.Decimal(8, 2)`
- Added `sugar Decimal? @db.Decimal(8, 2)`

Backfill:

- Existing `Food.normalizedName` values were backfilled from `Food.name`.
- Existing `FoodAlias.normalizedAlias` values were backfilled from `FoodAlias.alias`.
- Database sanity check after migration returned:
  - Empty normalized food names: 0
  - Empty normalized aliases: 0

## Changed files

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/20260629234746_align_nutrition_schema/migration.sql`
- `backend/src/modules/nutrition/nutrition.repository.ts`
- `backend/src/modules/nutrition/nutrition.service.ts`
- `backend/src/modules/nutrition/nutrition.validation.ts`
- `backend/src/modules/nutrition/nutrition.types.ts`
- `backend/src/modules/nutrition/nutrition.mapper.ts`
- `docs/CURRENT_STATE.md`

## Commands run

```bash
npx prisma migrate dev --name align_nutrition_schema --create-only
npm run prisma:migrate -- --name align_nutrition_schema
npm run prisma:generate
npm run build
```

Additional verification:

```bash
node backfill sanity check for empty normalizedName/normalizedAlias
```

Endpoint tests were run against the compiled backend with PowerShell `Invoke-RestMethod`.

## Endpoint test results

- `GET /api/health`: passed.
- `POST /api/auth/register`: passed, token returned, `passwordHash` not returned.
- `POST /api/foods` with aliases, fiber, and sugar: passed.
- `GET /api/foods/search?q=yumurta`: passed.
- `GET /api/foods/search?q=haslanmis`: passed through normalized alias search.
- `GET /api/meals?date=2026-06-30`: passed.
- `POST /api/meals/entries`: passed.
- Food entry snapshot for quantity 2 of a 1-serving egg:
  - calories: 140
  - protein: 12
  - carbs: 1
  - fat: 10
  - fiber: 0.4
  - sugar: 0.8
- `DELETE /api/meals/entries/:entryId`: passed.
- DailyLog totals returned to 0 after deleting the entry.

## Known issues

- `docs/prompts/UPDATE_CURRENT_STATE_PROMPT.md` still appears to contain Phase 0 prompt content; there was no safe matching source content to restore it.
- PowerShell on this machine does not support `&&`; commands were run separately.
- Existing frontend dev server was left running, but no frontend code or UI was changed during Phase 3.1.
- DailyLog does not currently store fiber or sugar totals. Fiber and sugar are now stored on Food and snapshotted on FoodEntry.

## Git commits

- `9d3e91d feat: complete phase 0 setup and phase 1 auth`
- `21fe750 feat: add profile and goals modules`
- `9a32d17 feat: add nutrition backend module`

## Next recommended step

Review Phase 3.1 backend behavior, then start Phase 4 - Dashboard backend only when explicitly requested.
