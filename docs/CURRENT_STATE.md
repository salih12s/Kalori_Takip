# Current State

## Phase

Post-MVP polish - Nutrition Reliability, Dynamic Macro Preview, Branding Assets and Real-time Friend Notifications is complete.

## Completed work

- Hardened Open Food Facts search with query normalization, short-query guard, in-memory cache, failure cache and circuit breaker behavior.
- Added/expanded common Turkish food fallbacks for terms such as `yumurta`, `siyah zeytin`, `yesil zeytin`, `tavuk`, `pilav`, `yogurt`, `sut`, `peynir`, `ekmek`, `makarna`, `muz`, `elma`, `patates`, `ton baligi` and `yulaf`.
- Kept fallback foods marked with provider `OPEN_FOOD_FACTS` so the existing import/cache flow remains compatible.
- Updated selected food preview to default to the food serving size/unit and scale calories, macros, fiber and sugar live as quantity changes.
- Added Saydam Fitness branding assets from the provided root files into `frontend/public/branding`.
- Added logo usage in auth layout, sidebar, mobile header and favicon.
- Added a once-per-session splash intro video with skip and safe auto-dismiss behavior.
- Added Socket.IO backend support with JWT auth and per-user rooms.
- Emitted follow request/accepted/rejected events from the social service.
- Added frontend realtime provider with toast notifications and social query invalidation.
- Added a header notification bell with pending follow request count and `/friends` navigation.
- Preserved existing nutrition, social, dashboard and auth behavior.

## Open Food Facts reliability fixes

- Minimum normalized query length is enforced in the provider.
- Turkish input is normalized to ASCII-like search keys before alias lookup.
- Successful searches are cached for 20 minutes.
- Failed/unavailable searches are cached for 2 minutes.
- Repeated failures open a short circuit for 60 seconds.
- Development logging is throttled and avoids dumping request payloads.
- Search results merge common fallbacks with external API results and de-duplicate by `externalId`.

## Nutrition macro preview changes

- `AddFoodEntryDialog` now resets quantity/unit to the selected food's serving values.
- `SelectedFoodPreview` scales calories, protein, carbs, fat, fiber and sugar from `quantity / servingSize`.
- Meal entry submit still sends only `foodId`, `quantity` and `unit`.

## Branding and splash changes

- Logo asset: `frontend/public/branding/saydamfitness-logo.png`
- Intro asset: `frontend/public/branding/saydamfitness-intro.mp4`
- Favicon now points to the Saydam Fitness logo.
- Splash video is shown once per browser session and can be skipped.

## Realtime notification changes

- Backend Socket.IO server is attached to the existing HTTP server.
- Socket auth uses the existing JWT token rules.
- Authenticated sockets join `user:{userId}`.
- Follow events are emitted to the affected user room.
- Frontend listens for follow events, shows Turkish toast messages and invalidates:
  - `["social", "requests"]`
  - `["social", "friends"]`
  - `["social", "followers"]`

## Changed files

Backend:

- `backend/package.json`
- `backend/package-lock.json`
- `backend/src/server.ts`
- `backend/src/realtime/realtime.types.ts`
- `backend/src/realtime/realtime.service.ts`
- `backend/src/realtime/socket.ts`
- `backend/src/modules/social/social.service.ts`
- `backend/src/modules/nutrition/external/open-food-facts.provider.ts`
- `backend/src/modules/nutrition/external/common-food-fallbacks.ts`

Frontend:

- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/index.html`
- `frontend/public/branding/saydamfitness-logo.png`
- `frontend/public/branding/saydamfitness-intro.mp4`
- `frontend/src/app/App.tsx`
- `frontend/src/app/providers/AppProviders.tsx`
- `frontend/src/app/providers/RealtimeProvider.tsx`
- `frontend/src/components/branding/AppLogo.tsx`
- `frontend/src/components/branding/SplashVideo.tsx`
- `frontend/src/components/layout/Header.tsx`
- `frontend/src/components/layout/Sidebar.tsx`
- `frontend/src/features/auth/components/AuthLayout.tsx`
- `frontend/src/features/auth/pages/LoginPage.tsx`
- `frontend/src/features/auth/pages/RegisterPage.tsx`
- `frontend/src/features/nutrition/components/AddFoodEntryDialog.tsx`
- `frontend/src/features/nutrition/components/SelectedFoodPreview.tsx`
- `frontend/src/services/realtime.ts`

Docs:

- `docs/CURRENT_STATE.md`

## Commands run

```bash
cd backend && npm install socket.io
cd frontend && npm install socket.io-client
cd backend && npm run prisma:generate
cd backend && npm run build
cd backend && npx prisma migrate status
cd frontend && npm run build
node dist/server.js
node <backend smoke test script>
node <social realtime smoke test script>
cd frontend && npm run preview -- --host 127.0.0.1 --port 4200
```

## Backend check results

- `npm run prisma:generate` passed after stopping an old local dev server that had locked Prisma's Windows DLL.
- `npm run build` passed.
- `npx prisma migrate status` reported the database schema is up to date.
- `GET /api/health` returned success.
- Two test users registered successfully and `GET /api/auth/me` returned the authenticated user.
- `POST /api/foods` with aliases, fiber and sugar returned the created food.
- `GET /api/foods/search?q=yumurta&source=all` returned 20 foods with `externalSearchFailed=false`.
- `GET /api/foods/search?q=siyah zeytin&source=all` returned 11 foods with `externalSearchFailed=false`.
- `POST /api/foods/import-external` imported an external/common food with fiber and sugar values.
- `GET /api/meals?date=2026-06-30` returned meal data.
- `POST /api/meals/entries` created a food entry with calories, fiber and sugar snapshots.
- `DELETE /api/meals/entries/:entryId` removed the entry and recalculated daily totals back to zero for the smoke entry.
- Socket.IO follow request notification was received by the target user's socket.
- Follow request accept flow was verified with `followers=1` for the target user and `friends=1` for the follower.

## Frontend check results

- `npm run build` passed.
- Vite preview on port `4200` served HTTP 200 for:
  - `/login`
  - `/register`
  - `/nutrition`
  - `/friends`
  - `/dashboard`
- New realtime and branding files remain below code size limits.
- Vite reported the existing large chunk warning for the main bundle.

## Known issues

- Open Food Facts can still be intermittently unavailable; common Turkish fallbacks now keep the main nutrition flow usable.
- Frontend verification used TypeScript build and Vite preview smoke checks, not full browser automation.
- Smoke tests created local development database rows.
- Vite still warns that one production chunk is larger than 500 kB.

## Current project status

The app now has more reliable external nutrition search, live macro preview, Saydam Fitness branding/splash assets and realtime follow notifications.

## Git commits

Next commit:

- `feat: polish nutrition realtime branding ux`

## Next recommended step

Start the next planned product phase after reviewing the new realtime notification UX in the browser.
