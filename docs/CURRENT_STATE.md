# Current State

## Phase

Phase 14 - Frontend profile and settings pages are implemented.

## Completed work

- Connected the Profile / Profil page to the real profile and goals endpoints:
  - `GET /api/profile/me`
  - `PUT /api/profile/me`
  - `GET /api/goals/me`
  - `POST /api/goals`
  - `PUT /api/goals/:goalId`
- Added profile feature:
  - `profile.api.ts` client and `profile.types.ts` (re-exports the shared onboarding
    domain types and adds `UpdateGoalPayload`).
  - `profile.schema.ts` re-uses the onboarding `profileStepSchema`/`goalStepSchema`
    (renamed to `profileFormSchema`/`goalFormSchema`) so validation stays in one place.
  - `profile-labels.ts` (gender/privacy/goal-type Turkish labels and select options).
  - Hooks: `useMyProfile`, `useUpdateProfile`, `useMyGoal`, `useCreateGoal`, `useUpdateGoal`.
  - Components: `ProfileOverviewCard`, `ProfileForm`, `GoalOverviewCard`, `GoalForm`,
    `ProfileSkeleton`.
  - `ProfilePage` composes the overview cards and forms (Profil Özeti, Profil Bilgileri,
    Hedef Özeti, Hedef Bilgileri) with a loading skeleton and error state.
- Profile form prefilled from `GET /profile/me`; goal form prefilled from `GET /goals/me`.
  - The goal form updates the active goal (`PUT`) when one exists, otherwise creates one
    (`POST`). In practice users reaching the app shell already have an active goal.
- Added settings feature:
  - `AccountSettingsCard` shows the current username/email and a "Çıkış Yap" button that
    reuses the existing auth `logout` and redirects to `/login`.
  - `AppPreferencesCard` stores local-only theme and unit preferences in `localStorage`
    (no backend involved).
  - `SettingsSkeleton` and a real `SettingsPage`.
- Mutations invalidate the relevant caches:
  - Profile update -> `["profile","me"]`.
  - Goal create/update -> `["goals","me"]`, `["onboarding-status"]`, `["dashboard"]`,
    `["leaderboard"]`.
- Only backend-supported `GoalType` values are offered (LOSE_WEIGHT, MAINTAIN_WEIGHT,
  GAIN_WEIGHT, IMPROVE_FITNESS). `BUILD_MUSCLE` / "Kas Kazanmak" is intentionally absent.
- No backend code was changed. No Prisma schema change was made.
- No image upload, password change, account deletion, challenges, badges, or external
  integrations were added (out of scope for this phase).

## Changed files

New profile files:

- `frontend/src/features/profile/api/profile.api.ts`
- `frontend/src/features/profile/types/profile.types.ts`
- `frontend/src/features/profile/schemas/profile.schema.ts`
- `frontend/src/features/profile/utils/profile-labels.ts`
- `frontend/src/features/profile/hooks/useMyProfile.ts`
- `frontend/src/features/profile/hooks/useUpdateProfile.ts`
- `frontend/src/features/profile/hooks/useMyGoal.ts`
- `frontend/src/features/profile/hooks/useCreateGoal.ts`
- `frontend/src/features/profile/hooks/useUpdateGoal.ts`
- `frontend/src/features/profile/components/ProfileOverviewCard.tsx`
- `frontend/src/features/profile/components/ProfileForm.tsx`
- `frontend/src/features/profile/components/GoalOverviewCard.tsx`
- `frontend/src/features/profile/components/GoalForm.tsx`
- `frontend/src/features/profile/components/ProfileSkeleton.tsx`
- `frontend/src/features/profile/pages/ProfilePage.tsx` (replaced placeholder)

New settings files:

- `frontend/src/features/settings/components/AccountSettingsCard.tsx`
- `frontend/src/features/settings/components/AppPreferencesCard.tsx`
- `frontend/src/features/settings/components/SettingsSkeleton.tsx`
- `frontend/src/features/settings/pages/SettingsPage.tsx` (replaced placeholder)

Removed `.gitkeep` from now-populated profile (`api`, `components`, `hooks`, `schemas`,
`types`, `utils`) and settings (`components`) directories.

- `docs/CURRENT_STATE.md`

## Commands run

```bash
npm run build      # frontend: tsc -b && vite build (passed)
npm run preview -- --port 4194 --strictPort   # route smoke check
node dist/server.js   # backend started locally for live API verification
```

## Profile flow check results

A scripted end-to-end run against the live backend passed 10/10 checks:

- `GET /profile/me` returns the profile and exposes no `passwordHash`/`password`.
- `PUT /profile/me` updates `fullName`, `bio`, `heightCm`, `currentWeightKg`,
  `privacyLevel` and returns the updated profile.
- `GET /goals/me` returns the active goal (with `id`, `isActive`).
- `PUT /goals/:goalId` updates the goal in place (same id, stays active) including
  `goalType`, calorie/protein/step/workout targets and `targetWeightKg`.
- For a user with no goal, `GET /goals/me` is `null` and `POST /goals` creates one (201),
  after which `GET /goals/me` returns it (validates the create path the form uses).
- Preview route smoke checks returned HTTP 200 for `/profile`, `/settings` and `/login`.

## Settings flow check results

- `SettingsPage` renders `AccountSettingsCard` (username/email from the auth context, a
  Turkish "Çıkış Yap" logout) and `AppPreferencesCard` (local theme/unit preferences).
- Logout reuses the Phase 9 auth `logout`, which clears the token; route guards then send
  the user to `/login`.
- Local preferences are `localStorage`-only and do not affect the build or backend.
- Preview route smoke check returned HTTP 200 for `/settings`.

## Known issues

- Full browser automation is not installed; client-side redirect/render behavior was
  verified via route smoke checks and live API contract checks rather than a real browser.
- Vite still reports a chunk-size warning (`>500 kB` JS). The build succeeds; code
  splitting can be a later optimization.
- The theme preference is stored locally but not yet applied (no theming system); it is a
  forward-looking placeholder as allowed for this phase.
- `currentStreak` is still returned as `0` by the backend (streak calculation not yet
  implemented); unrelated to this phase.

## Current phase status

Phase 14 (frontend profile and settings pages) is complete and builds successfully.

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
- `feat: connect profile and settings pages` (this phase)

## Next recommended step

The core MVP frontend is now connected end to end. Recommended next: a polish pass
(empty/error consistency, responsive checks, optional Vite code-splitting) or begin the
challenges feature when explicitly requested.
