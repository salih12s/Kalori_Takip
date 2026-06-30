# Current State

## Phase

Phase 7 - Leaderboard backend is implemented.

## Completed work

- Implemented protected leaderboard backend endpoints:
  - `POST /api/leaderboard/recalculate`
  - `POST /api/leaderboard/recalculate-range`
  - `GET /api/leaderboard/weekly?startDate=YYYY-MM-DD`
  - `GET /api/leaderboard/monthly?month=YYYY-MM`
  - `GET /api/leaderboard/friends?period=weekly|monthly`
  - `GET /api/leaderboard/me/summary`
- Added leaderboard module with routes, controller, service, repository, validation, types, and mapper.
- Mounted leaderboard routes in `backend/src/app.ts`.
- Added daily per-source leaderboard point storage:
  - `LeaderboardPeriod.DAILY`
  - `LeaderboardPointSource`
  - `LeaderboardPoint.source`
  - unique daily source rows per user/date/source.
- Preserved existing aggregate leaderboard rows by defaulting existing rows to `AGGREGATE`.
- Updated `DailyLog.dailyScore` during recalculation.
- No frontend UI was created or changed.
- No dashboard, challenge, badge, notification, external integration, barcode, or AI food recognition work was started.

## Scoring behavior decision

Leaderboard scoring rewards healthy consistency instead of lowest calorie intake.

- Food logged: +5
- Calorie goal range: +10 only when an active goal exists and calories are within 80%-110% of the goal
- Protein goal: +8 only when an active goal exists and protein goal is reached
- Step goal: +10 only when an active goal exists and step goal is reached
- Workout: +15
- Run distance: +3 per full km
- Walk distance: +3 per full km
- Off day: +3
- Water logged: +3
- Daily completion: +5 when food and at least one activity/water/workout/off-day signal exist

Goal-based points are skipped when no active goal exists. Very low calories below 80% of the active calorie goal do not receive calorie-goal points.

## Changed files

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/20260630120000_add_leaderboard_sources/migration.sql`
- `backend/src/app.ts`
- `backend/src/modules/leaderboard/leaderboard.routes.ts`
- `backend/src/modules/leaderboard/leaderboard.controller.ts`
- `backend/src/modules/leaderboard/leaderboard.service.ts`
- `backend/src/modules/leaderboard/leaderboard.repository.ts`
- `backend/src/modules/leaderboard/leaderboard.validation.ts`
- `backend/src/modules/leaderboard/leaderboard.types.ts`
- `backend/src/modules/leaderboard/leaderboard.mapper.ts`
- `docs/CURRENT_STATE.md`

## Commands run

```bash
npx prisma format
npm run prisma:migrate -- --name add_leaderboard_sources
npx prisma migrate deploy
npm run prisma:generate
npm run build
npm run prisma:migrate -- --name add_leaderboard_sources_check
```

The first `npm run prisma:migrate -- --name add_leaderboard_sources` generated a non-interactive Prisma warning because the unique index change required confirmation. A deterministic migration file was created and applied with `npx prisma migrate deploy`, then `npm run prisma:migrate -- --name add_leaderboard_sources_check` confirmed the database was in sync.

Endpoint tests were run against the compiled backend with PowerShell `Invoke-RestMethod`.

## Endpoint test results

- `GET /api/health`: passed.
- Created fresh User A, User B, and User C with auth register.
- `POST /api/auth/login`: passed for User A.
- `GET /api/auth/me`: passed for User A.
- Created profiles and active goals for test users.
- User A followed User B; User B accepted the request.
- Created food and meal entries for User A, User B, and User C.
- Created run, walk, workout, water, and off-day data for User A.
- `POST /api/leaderboard/recalculate` for User A:
  - returned `dailyScore: 67`
  - returned 9 point items
  - did not include `CALORIE_GOAL` because calories were below 80% of the active goal.
- Repeating `POST /api/leaderboard/recalculate` for User A:
  - returned the same score and point count, confirming idempotency.
- `POST /api/leaderboard/recalculate` for User B:
  - returned `dailyScore: 41`.
- `POST /api/leaderboard/recalculate` for User C:
  - returned `dailyScore: 62`.
- `POST /api/leaderboard/recalculate-range` for User A:
  - returned 1 recalculated day for the one-day range.
- `GET /api/leaderboard/weekly?startDate=2026-06-29` as User A:
  - returned User A and accepted friend User B.
  - excluded unfollowed private User C.
- `GET /api/leaderboard/monthly?month=2026-06` as User A:
  - returned 2 visible rows.
- `GET /api/leaderboard/friends?period=weekly` as User A:
  - returned 2 visible rows.
- `GET /api/leaderboard/me/summary` as User A:
  - returned `todayScore: 67`
  - returned `weeklyRank: 1`.
- `GET /api/dashboard/today?date=2026-06-30` as User A:
  - returned `status.dailyScore: 67`, confirming leaderboard recalculation updates `DailyLog`.

## Known issues

- `currentStreak` is still returned as 0 because streak calculation has not been implemented yet.
- Existing frontend dev server may still be running from earlier work; no frontend files were changed in Phase 7.
- PowerShell on this machine does not support `&&`; commands were run separately.
- `docs/prompts/UPDATE_CURRENT_STATE_PROMPT.md` still appears to contain Phase 0 prompt content; it was not changed during Phase 7.

## Git commits

- `9d3e91d feat: complete phase 0 setup and phase 1 auth`
- `21fe750 feat: add profile and goals modules`
- `9a32d17 feat: add nutrition backend module`
- `a535f89 feat: align nutrition schema`
- `63da7b2 feat: add dashboard backend module`
- `ba88747 feat: add activity backend module`
- `84cb21f feat: add social follow backend module`
- `feat: add leaderboard backend module`

## Next recommended step

Review Phase 7 backend behavior, then start Phase 8 only when explicitly requested.
