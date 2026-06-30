# Current State

## Phase

Phase 15 - Challenges (backend + frontend) is implemented.

## Completed work

- Added a Challenge / ChallengeMember domain (backend + frontend).
- Backend module `backend/src/modules/challenges/` with routes, controller, service,
  repository, validation, types and mapper. Mounted at `/api/challenges`.
- New backend endpoints (all require a Bearer token):
  - `GET /api/challenges` — visible challenges (public active + created/joined by user).
  - `GET /api/challenges/mine` — challenges the user created or joined.
  - `GET /api/challenges/:challengeId` — detail with safe member summaries.
  - `POST /api/challenges` — create (creator auto-joins; status ACTIVE).
  - `POST /api/challenges/:challengeId/join` — join (guards CANCELLED/ended).
  - `DELETE /api/challenges/:challengeId/leave` — leave (idempotent).
  - `POST /api/challenges/:challengeId/recalculate` — recompute the user's progress.
  - `POST /api/challenges/recalculate-all` — recompute all joined active challenges.
- Progress is computed from existing `DailyLog` rows only (no DailyLogs are created):
  - STEPS: sum of `totalSteps`.
  - RUN_DISTANCE: sum of `totalRunKm`.
  - WATER: sum of `waterMl`.
  - WORKOUT: count of days where `isWorkoutDay` is true.
  - FOOD_LOG: count of days where `totalCalories > 0`.
  - Member status becomes COMPLETED when progress >= targetValue.
- Frontend feature `frontend/src/features/challenges/` (api, hooks, schema, types, utils,
  components, page) connected to the new endpoints.
- New route `/challenges` and a sidebar/mobile nav item labelled "Meydan Okuma" (Swords
  icon). `MobileNav` grid widened to 8 columns.
- `ChallengesPage` composes: "Benim Challenge'larım" (with a "Tümünü Güncelle" action),
  "Aktif Challenge'lar" list, a create dialog and a members dialog.
- `ChallengeCard` shows type badge, target+unit, date range, member count, a progress bar
  when joined, and Katıl / Ayrıl / İlerlemeyi Güncelle / Tamamlandı actions.
- Only the 5 MVP challenge types are exposed (STEPS, FOOD_LOG, WORKOUT, RUN_DISTANCE,
  WATER); no CUSTOM type. Badges, streaks, notifications, image upload and external
  integrations were not added.

## Schema changes

Challenge / ChallengeMember did not exist in `schema.prisma` (they were only listed as
"later models" in `docs/DATABASE_SCHEMA.md`), so the smallest safe additive change was made:

- New enums: `ChallengeType` (STEPS, FOOD_LOG, WORKOUT, RUN_DISTANCE, WATER),
  `ChallengeStatus` (ACTIVE, COMPLETED, CANCELLED), `ChallengeMemberStatus` (ACTIVE, COMPLETED).
- New models: `Challenge` (creator, title, description, type, targetValue, unit, startsAt,
  endsAt, status, isPublic) and `ChallengeMember` (challenge, user, progress, status,
  joinedAt) with a unique `(challengeId, userId)`.
- Two back-relations added to `User` (`createdChallenges`, `challengeMemberships`).
- Migration `20260630020736_add_challenges` created and applied. The change is purely
  additive (new tables/enums only); no existing tables were modified.

Design decision: a creator is auto-joined on create and **may** leave; the challenge
itself is never deleted in the MVP (leave only removes the membership). Leave is
idempotent (safe success whether or not the user was a member).

## Changed files

Backend:

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/20260630020736_add_challenges/migration.sql` (new)
- `backend/src/app.ts`
- `backend/src/modules/challenges/challenges.routes.ts` (new)
- `backend/src/modules/challenges/challenges.controller.ts` (new)
- `backend/src/modules/challenges/challenges.service.ts` (new)
- `backend/src/modules/challenges/challenges.repository.ts` (new)
- `backend/src/modules/challenges/challenges.validation.ts` (new)
- `backend/src/modules/challenges/challenges.types.ts` (new)
- `backend/src/modules/challenges/challenges.mapper.ts` (new)

Frontend:

- `frontend/src/features/challenges/api/challenges.api.ts` (new)
- `frontend/src/features/challenges/types/challenge.types.ts` (new)
- `frontend/src/features/challenges/schemas/challenge.schema.ts` (new)
- `frontend/src/features/challenges/utils/challenge-labels.ts` (new)
- `frontend/src/features/challenges/hooks/` (7 hooks, new)
- `frontend/src/features/challenges/components/` (ChallengeCard, ChallengeList,
  CreateChallengeDialog, MyChallengesSection, ChallengeProgressBar, ChallengeTypeBadge,
  ChallengeMembersDialog, ChallengesSkeleton — new)
- `frontend/src/features/challenges/pages/ChallengesPage.tsx` (new)
- `frontend/src/app/router/routes.tsx` (challenges path + nav item)
- `frontend/src/app/router/AppRouter.tsx` (challenges route)
- `frontend/src/components/layout/MobileNav.tsx` (grid-cols-8)
- Removed `.gitkeep` from now-populated challenge directories.

- `docs/CURRENT_STATE.md`

## Commands run

```bash
npx prisma format
npm run prisma:migrate -- --name add_challenges   # creates + applies + generates
npm run build            # backend: tsc (passed)
npm run build            # frontend: tsc -b && vite build (passed)
npm run preview -- --port 4195 --strictPort        # route smoke check
node dist/server.js      # backend started locally for live API verification
```

## Backend challenge check results

A scripted end-to-end run against the live backend passed 23/23 checks:

- `GET /api/challenges` without a token returns 401.
- Created a user, seeded 3 days of `DailyLog` data, then created one challenge per type.
- Each create returned 201, auto-joined the creator, and reported `memberCount = 1`.
- Recalculate produced the exact expected progress for every type:
  STEPS = 25000, RUN_DISTANCE = 8, WATER = 3000, WORKOUT = 2, FOOD_LOG = 2.
- A membership whose progress reached the target was marked `COMPLETED`.
- `GET /challenges`, `/challenges/mine` and `/challenges/:id` returned the expected
  shapes; member summaries contained no `passwordHash`, `email` or body metrics.
- `POST /challenges/recalculate-all` updated all joined active memberships.
- A second user joined a public challenge (memberCount became 2), re-join returned the
  existing membership safely, and leave returned `left: true`.
- Joining an already-ended challenge returned a safe 400 ("Challenge has ended").

## Frontend challenge check results

- `npm run build` (frontend) passed: 2545 modules, no TypeScript errors.
- Preview route smoke checks returned HTTP 200 for `/challenges` and `/login`.
- The "Meydan Okuma" nav item and `/challenges` route are wired into the protected app shell.
- All user-facing text is Turkish; no mojibake detected. Largest new file is 154 lines.

## Known issues

- Full browser automation is not installed; client-side redirect/render behavior was
  verified via route smoke checks and live API contract checks rather than a real browser.
- Vite still reports a chunk-size warning (`>500 kB` JS). The build succeeds; code
  splitting can be a later optimization.
- Challenges are never auto-expired/cancelled by a job; `status` stays ACTIVE until a
  future cancellation feature is added. Joining is still guarded by the end date.
- `currentStreak` is still `0` from the backend (streak system intentionally not built yet).

## Current phase status

Phase 15 (challenges backend + frontend) is complete; both backend and frontend build
successfully and the live API flow passes.

## Git commits

- `9d3e91d feat: complete phase 0 setup and phase 1 auth`
- `21fe750 feat: add profile and goals modules`
- `9a32d17 feat: add nutrition backend module`
- `a535f89 feat: align nutrition schema`
- `63da7b2 feat: add dashboard backend module`
- `ba88747 feat: add activity backend module`
- `84cb21f feat: add social follow backend module`
- `7337d11 feat: add leaderboard backend module`
- `a3bb68c feat: add frontend base layout`
- `e106343 feat: add frontend auth and onboarding`
- `4519b4c feat: connect dashboard to backend data`
- `2d085bc feat: connect nutrition page to backend`
- `feat: connect activity page to backend`
- `feat: connect social and leaderboard pages`
- `feat: connect profile and settings pages`
- `feat: add challenges feature` (this phase)

## Next recommended step

Optional polish: auto-complete/cancel challenges by date via a job, surface joined
challenge progress on the dashboard, or start the badges/streak system when explicitly
requested.
