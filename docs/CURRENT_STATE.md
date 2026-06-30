# Current State

## Phase

Post-MVP polish - Curated Food Database, Branding Polish, Mobile Auth Video and Challenge UI Removal is complete.

## Completed work

- Added a curated internal Turkish/common food database with 95 foods.
- Added idempotent curated food seed script: `npm run seed:foods`.
- Seeded curated foods locally into PostgreSQL.
- Changed normal food search to default to curated/local foods instead of Open Food Facts.
- Kept Open Food Facts backend and external import flow available only when explicitly requested with `source=external`.
- Updated nutrition search tabs to `Yemekler`, `Önbellek`, `Dış Kaynak`.
- Kept manual food creation as a secondary fallback.
- Preserved dynamic macro preview and backend FoodEntry snapshot calculations.
- Added a rounded SVG favicon that behaves like a browser app icon.
- Moved mobile intro video into public branding assets and selected desktop/mobile intro video by screen width.
- Enlarged auth page branding with a readable Saydam Fitness logo.
- Removed Challenge/Meydan Okuma from visible navigation.
- Redirected `/challenges` to `/leaderboard` without deleting backend challenge code, schema or migrations.
- Updated README and UI guide to reflect the active visible product surface.

## Branding changes

- Added `frontend/public/favicon.svg` with a rounded green app-icon style.
- Updated `frontend/index.html` to use the SVG favicon.
- `AppLogo` now supports `size="sm" | "md" | "lg"` and `showText`.
- Auth layout uses the large logo variant.

## Mobile video changes

- Moved `saydamfitnesstelefon.mp4` to `frontend/public/branding/saydamfitness-intro-mobile.mp4`.
- `SplashVideo` chooses the mobile intro when screen width is `<= 768px`.
- Video remains muted, plays inline, autoplaying, skippable with `Geç`, and auto-dismisses after about 5 seconds.
- Existing sessionStorage one-time behavior is preserved.
- The mobile video is used in the global splash rather than as a login-only background to avoid making auth layout heavier.

## Challenge UI removal

- Removed Challenge from shared navigation items.
- Updated mobile nav from 9 to 8 columns.
- `/challenges` now redirects to `/leaderboard`.
- Backend challenge module, database tables and migrations were intentionally preserved.
- Hidden challenge feature files remain in the repo for future reuse but are not visible in normal navigation.

## Curated food database changes

- Added `backend/prisma/curated-foods.ts`.
- Added `backend/prisma/seed-foods.ts`.
- Curated foods use:
  - `source: LOCAL`
  - `userId: null`
  - `externalProvider: null`
  - `externalId: null`
  - `cachedAt: null`
- Seed logic is idempotent by normalized global LOCAL food name and adds missing aliases with `skipDuplicates`.
- No schema migration was required.

## Nutrition search UX changes

- Backend `GET /api/foods/search` now defaults to `source=curated`.
- `source=curated` searches clean global curated foods only.
- `source=local` is reserved for imported/cached/user foods.
- `source=external` still uses Open Food Facts explicitly.
- Local results are sorted by:
  - exact normalized name
  - exact alias
  - startsWith name
  - startsWith alias
  - contains
- Test-looking food names are filtered from curated/default search.
- Frontend default tab is now `Yemekler`.
- External failure warning appears only on `Dış Kaynak`.

## Changed files

Backend:

- `backend/package.json`
- `backend/prisma/curated-foods.ts`
- `backend/prisma/seed-foods.ts`
- `backend/src/modules/nutrition/nutrition.repository.ts`
- `backend/src/modules/nutrition/nutrition.service.ts`
- `backend/src/modules/nutrition/nutrition.validation.ts`

Frontend:

- `frontend/index.html`
- `frontend/public/favicon.svg`
- `frontend/public/branding/saydamfitness-intro-mobile.mp4`
- `frontend/src/app/router/AppRouter.tsx`
- `frontend/src/app/router/routes.tsx`
- `frontend/src/components/branding/AppLogo.tsx`
- `frontend/src/components/branding/SplashVideo.tsx`
- `frontend/src/components/layout/MobileNav.tsx`
- `frontend/src/features/auth/components/AuthLayout.tsx`
- `frontend/src/features/challenges/pages/ChallengesPage.tsx`
- `frontend/src/features/gamification/utils/gamification-labels.ts`
- `frontend/src/features/nutrition/components/FoodResultCard.tsx`
- `frontend/src/features/nutrition/components/FoodSearchInput.tsx`
- `frontend/src/features/nutrition/components/FoodSourceTabs.tsx`
- `frontend/src/features/nutrition/types/nutrition.types.ts`

Docs:

- `README.md`
- `docs/UI_UX_GUIDE.md`
- `docs/CURRENT_STATE.md`

## Commands run

```bash
cd backend && npm run prisma:generate
cd backend && npx prisma migrate status
cd backend && npm run build
cd backend && npm run seed:foods
cd frontend && npm run build
node dist/server.js
node <curated nutrition smoke test script>
cd frontend && npm run preview -- --host 127.0.0.1 --port 4201 --strictPort
```

## Backend check results

- `npm run prisma:generate` passed after stopping a stale Node process that was locking Prisma's Windows query engine DLL.
- `npx prisma migrate status` reported the database schema is up to date.
- `npm run build` passed.
- `npm run seed:foods` seeded 95 curated foods.
- `GET /api/health` returned success.
- Auth register returned a valid token for the smoke user.
- Default `GET /api/foods/search?q=yumurta` returned `Yumurta` first from `LOCAL`.
- Default `GET /api/foods/search?q=siyah zeytin` returned `Siyah Zeytin` first from `LOCAL`.
- Default `GET /api/foods/search?q=salatalik` returned `Salatalık` first from `LOCAL`.
- Default `GET /api/foods/search?q=tavuk` returned `Tavuk Göğsü` first from `LOCAL`.
- Default `GET /api/foods/search?q=yulaf` returned `Yulaf` first from `LOCAL`.
- Default searches did not return mayonnaise, biscuit, queso, Phase or Dashboard junk results.
- `POST /api/meals/entries` with 60g `Yumurta` created a snapshot of `93 kcal` and `7.8g protein`.
- `DELETE /api/meals/entries/:entryId` removed the smoke entry.
- Explicit `GET /api/foods/search?q=yumurta&source=external` still returned external results.

## Frontend check results

- `npm run build` passed.
- Vite preview on port `4201` served HTTP 200 for:
  - `/login`
  - `/register`
  - `/nutrition`
  - `/leaderboard`
  - `/dashboard`
  - `/challenges`
- Source check confirmed `Meydan Okuma` no longer appears in visible app/navigation sources.
- Nutrition source tabs now show `Yemekler`, `Önbellek`, `Dış Kaynak`.
- Favicon asset exists at `frontend/public/favicon.svg`.
- Mobile intro asset exists at `frontend/public/branding/saydamfitness-intro-mobile.mp4`.

## Known issues

- Full browser automation is not installed; frontend verification used TypeScript build, Vite preview route smoke and source checks.
- Vite still reports the existing large chunk warning for the main bundle.
- Smoke tests created local development database rows.
- Hidden challenge feature files still contain challenge implementation code, but the route redirects and the nav item is removed.

## Current project status

The normal nutrition flow now uses a clean curated internal food database, branding is more app-like, mobile intro video is supported, and Challenge UI is hidden in favor of Leaderboard-based competition.

## Git commits

Next commit:

- `feat: add curated foods and polish branding navigation`

## Next recommended step

Review the nutrition search and auth splash behavior in a browser, then continue with the next product polish task.
