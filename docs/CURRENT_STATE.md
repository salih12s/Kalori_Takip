# Current State

## Phase

Phase 9 - Frontend auth and onboarding is implemented.

## Completed work

- Implemented frontend authentication flow using the existing backend auth endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Added `AuthProvider` with:
  - current user
  - token
  - `isAuthenticated`
  - `isLoading`
  - `login`
  - `register`
  - `logout`
  - `refreshCurrentUser`
- Added localStorage token storage using the single key `fitboard_token`.
- Updated the HTTP client to attach `Authorization: Bearer TOKEN` when a token exists.
- Added simple 401 handling that clears the stored token.
- Added auth routes:
  - `/login`
  - `/register`
- Added onboarding route:
  - `/onboarding`
- Protected the app routes:
  - `/dashboard`
  - `/nutrition`
  - `/activity`
  - `/leaderboard`
  - `/friends`
  - `/profile`
  - `/settings`
- Added onboarding completion guard:
  - If no active goal exists, authenticated users are routed to `/onboarding`.
  - If an active goal exists, onboarding users are routed to `/dashboard`.
- Added login and register forms with React Hook Form, Zod, TanStack Query mutation, and Turkish validation messages.
- Added onboarding flow:
  - Step 1: profile setup via `PUT /api/profile/me`
  - Step 2: goal setup via `POST /api/goals`
- Added header logout action with Turkish label `Çıkış Yap`.
- Added `frontend/.env` locally with `VITE_API_URL="http://localhost:5000/api"` for testing; it is ignored by Git.
- No backend code was changed.
- No Prisma schema change was made.
- No real dashboard, nutrition, activity, social, or leaderboard data wiring was implemented in this phase.

## Onboarding behavior decision

Onboarding status is intentionally simple:

- `GET /api/goals/me` returning `null` means onboarding is incomplete.
- An active goal means onboarding is complete.

The backend `GoalType` enum currently supports:

- `LOSE_WEIGHT`
- `MAINTAIN_WEIGHT`
- `GAIN_WEIGHT`
- `IMPROVE_FITNESS`

The frontend uses only these accepted values. `BUILD_MUSCLE` was not added because the backend schema would reject it.

## Changed files

- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/src/app/providers/AppProviders.tsx`
- `frontend/src/app/providers/AuthProvider.tsx`
- `frontend/src/app/router/AppRouter.tsx`
- `frontend/src/app/router/routes.tsx`
- `frontend/src/components/layout/Header.tsx`
- `frontend/src/components/shared/FormField.tsx`
- `frontend/src/components/shared/FullScreenLoader.tsx`
- `frontend/src/features/auth/api/auth.api.ts`
- `frontend/src/features/auth/components/AuthLayout.tsx`
- `frontend/src/features/auth/components/LoginForm.tsx`
- `frontend/src/features/auth/components/ProtectedRoute.tsx`
- `frontend/src/features/auth/components/RegisterForm.tsx`
- `frontend/src/features/auth/hooks/useAuth.ts`
- `frontend/src/features/auth/pages/LoginPage.tsx`
- `frontend/src/features/auth/pages/RegisterPage.tsx`
- `frontend/src/features/auth/schemas/auth.schema.ts`
- `frontend/src/features/auth/types/auth.types.ts`
- `frontend/src/features/auth/utils/auth-storage.ts`
- `frontend/src/features/onboarding/api/onboarding.api.ts`
- `frontend/src/features/onboarding/components/GoalStepForm.tsx`
- `frontend/src/features/onboarding/components/OnboardingProgress.tsx`
- `frontend/src/features/onboarding/components/ProfileStepForm.tsx`
- `frontend/src/features/onboarding/hooks/useOnboarding.ts`
- `frontend/src/features/onboarding/pages/OnboardingPage.tsx`
- `frontend/src/features/onboarding/schemas/onboarding.schema.ts`
- `frontend/src/features/onboarding/types/onboarding.types.ts`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/ui.ts`
- `frontend/src/services/http.ts`
- `docs/CURRENT_STATE.md`

Local ignored file:

- `frontend/.env`

## Commands run

```bash
npm install react-hook-form zod @hookform/resolvers
npm run build
npm run preview -- --host 127.0.0.1 --port 4180 --strictPort
```

Backend was started locally with `node dist/server.js` only when port `5000` was not already listening.

## UI / auth flow check results

- `npm run build` passed.
- Vite preview served the built frontend on port `4180`.
- Frontend route smoke checks returned HTTP 200:
  - `/login`
  - `/register`
  - `/onboarding`
  - `/dashboard`
- Backend health check passed:
  - `GET /api/health`
- Auth/onboarding API smoke flow passed:
  - registered a fresh test user
  - `GET /api/auth/me` returned the registered user
  - `GET /api/goals/me` returned `null` before onboarding
  - `PUT /api/profile/me` updated profile
  - `POST /api/goals` created an active goal
  - `POST /api/auth/login` succeeded
  - `GET /api/goals/me` returned the active goal after login
- Backend diff check showed no backend files changed.
- `frontend/.env` is ignored by Git through the root `.gitignore`.
- File size check passed; largest new form file is under 150 lines.

## Known issues

- Full browser automation is not installed in this workspace, so UI checks used build, preview route smoke tests, and backend API flow checks.
- Vite reports a chunk-size warning after build (`>500 kB` minified JS). The build succeeds; code splitting can be handled in a later frontend optimization phase.
- Existing placeholder app pages still do not load real dashboard/nutrition/activity/social/leaderboard data by design.
- `currentStreak` is still returned as `0` by the backend because streak calculation has not been implemented yet.
- Existing preview servers were already listening on ports `4173` and `4174`; Phase 9 smoke preview used strict port `4180`.

## Current phase status

Phase 9 (frontend auth and onboarding) is complete and builds successfully.

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
- `feat: add frontend auth and onboarding`

## Next recommended step

Review Phase 9 auth/onboarding behavior, then start real dashboard data wiring only when explicitly requested.
