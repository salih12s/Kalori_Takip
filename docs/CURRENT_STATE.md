# Current State

## Phase

Phase 5 - Activity backend is implemented.

## Completed work

- Implemented protected activity backend endpoints:
  - `GET /api/activities?date=YYYY-MM-DD`
  - `POST /api/activities`
  - `DELETE /api/activities/:activityId`
  - `POST /api/activities/off-day`
  - `POST /api/activities/workouts`
  - `DELETE /api/activities/workouts/:workoutId`
  - `POST /api/activities/water`
  - `DELETE /api/activities/water/:waterLogId`
- Added activity module with routes, controller, service, repository, validation, types, and mapper.
- Mounted activity routes in `backend/src/app.ts`.
- Activity endpoints create the user's DailyLog for the selected date when missing.
- Activity totals are recalculated from existing ActivityEntry, WorkoutSession, and WaterLog rows after create/delete.
- Off-day updates set `DailyLog.isOffDay` and note without deleting activity entries.
- Workout create/delete updates `DailyLog.isWorkoutDay`, workout minutes, and burned calories.
- Water create/delete updates `DailyLog.waterMl`.
- Dashboard today response now includes:
  - `activity.totalBurnedCalories`
  - `activity.waterMl`
- No frontend UI was created or changed.
- No social, leaderboard, challenges, external integrations, Health Connect, HealthKit, or Strava work was started.

## Schema changes

Migration:

- `backend/prisma/migrations/20260630000212_add_activity_tracking/migration.sql`

DailyLog:

- Added `totalBurnedCalories Int @default(0)`
- Added relation fields for workout sessions and water logs.

User:

- Added relation fields for workout sessions and water logs.

WorkoutSession:

- Added new model for manual workout sessions.
- Uses `WorkoutType` enum.
- Stores title, muscle groups, duration, burned calories, intensity, and note.

WaterLog:

- Added new model for water entries.
- Stores amount in milliliters.

WorkoutType enum:

- `WEIGHT_TRAINING`
- `CARDIO`
- `MOBILITY`
- `SPORT`
- `OTHER`

## Changed files

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/20260630000212_add_activity_tracking/migration.sql`
- `backend/src/app.ts`
- `backend/src/modules/activity/activity.routes.ts`
- `backend/src/modules/activity/activity.controller.ts`
- `backend/src/modules/activity/activity.service.ts`
- `backend/src/modules/activity/activity.repository.ts`
- `backend/src/modules/activity/activity.validation.ts`
- `backend/src/modules/activity/activity.types.ts`
- `backend/src/modules/activity/activity.mapper.ts`
- `backend/src/modules/dashboard/dashboard.types.ts`
- `backend/src/modules/dashboard/dashboard.service.ts`
- `backend/src/modules/dashboard/dashboard.mapper.ts`
- `docs/CURRENT_STATE.md`

## Commands run

```bash
npm run prisma:migrate -- --name add_activity_tracking
npm run prisma:generate
npm run build
```

Endpoint tests were run against the compiled backend with PowerShell `Invoke-RestMethod`.

## Endpoint test results

- `GET /api/health`: passed.
- Unauthenticated `GET /api/activities?date=2026-06-30`: returned 401.
- `POST /api/auth/register`: passed, token returned.
- `GET /api/auth/me`: passed.
- `GET /api/activities?date=2026-06-30`: passed, created missing DailyLog with zero activity totals.
- `POST /api/activities` with RUN: passed.
- `POST /api/activities` with WALK: passed.
- `GET /api/activities?date=2026-06-30` after RUN/WALK reflected:
  - activities: 2
  - totalSteps: 9000
  - totalRunKm: 4.2
  - totalWalkKm: 2.1
  - totalBurnedCalories: 440
- `POST /api/activities/workouts`: passed.
- `GET /api/activities?date=2026-06-30` after workout reflected:
  - workouts: 1
  - isWorkoutDay: true
  - totalWorkoutMinutes: 75
  - totalBurnedCalories: 840
- `POST /api/activities/off-day`: passed.
- Off-day check confirmed:
  - isOffDay: true
  - note: Rest day
  - activity entries were not deleted.
- `POST /api/activities/water`: passed.
- Water check reflected:
  - waterLogs: 1
  - waterMl: 500
- `GET /api/dashboard/today?date=2026-06-30`: passed and reflected:
  - totalSteps: 9000
  - totalRunKm: 4.2
  - totalWalkKm: 2.1
  - totalWorkoutMinutes: 75
  - totalBurnedCalories: 840
  - waterMl: 500
  - isWorkoutDay: true
  - isOffDay: true
- User isolation check passed. Another user's 99999-step activity did not affect the current user's activity totals.
- `DELETE /api/activities/:activityId`: passed, totals recalculated.
- `DELETE /api/activities/workouts/:workoutId`: passed, workout totals recalculated and `isWorkoutDay` became false when no workouts remained.
- `DELETE /api/activities/water/:waterLogId`: passed, water total recalculated to 0.
- Final activity check after deletes reflected:
  - activities: 1
  - workouts: 0
  - waterLogs: 0
  - totalSteps: 3000
  - totalRunKm: 0
  - totalWalkKm: 2.1
  - totalWorkoutMinutes: 0
  - totalBurnedCalories: 120
  - waterMl: 0
  - isWorkoutDay: false
  - isOffDay: true

## Known issues

- `docs/prompts/UPDATE_CURRENT_STATE_PROMPT.md` still appears to contain Phase 0 prompt content; there was no safe matching source content to restore it.
- PowerShell on this machine does not support `&&`; commands were run separately.
- Existing frontend dev server was left running, but no frontend code or UI was changed during Phase 5.
- Step progress in dashboard remains 0 when the user has no active step goal. This is expected from Phase 4 goal-missing behavior.

## Git commits

- `9d3e91d feat: complete phase 0 setup and phase 1 auth`
- `21fe750 feat: add profile and goals modules`
- `9a32d17 feat: add nutrition backend module`
- `a535f89 feat: align nutrition schema`
- `63da7b2 feat: add dashboard backend module`

## Next recommended step

Review Phase 5 backend behavior, then start Phase 6 - Social backend only when explicitly requested.
