# Current State

## Phase

Phase 13 - Frontend social and leaderboard pages are implemented.

## Completed work

- Connected the Friends / Arkadaşlar page to the real social endpoints:
  - `GET /api/users/search?q=...`
  - `POST /api/follows/:userId`
  - `DELETE /api/follows/:userId`
  - `GET /api/follows/friends`
  - `GET /api/follows/followers`
  - `GET /api/follows/requests`
  - `POST /api/follows/requests/:followId/accept`
  - `POST /api/follows/requests/:followId/reject`
  - `GET /api/users/:userId/public-profile`
- Connected the Leaderboard / Liderlik Tablosu page to the real leaderboard endpoints:
  - `POST /api/leaderboard/recalculate`
  - `GET /api/leaderboard/weekly`
  - `GET /api/leaderboard/monthly`
  - `GET /api/leaderboard/friends?period=weekly`
  - `GET /api/leaderboard/me/summary`
- Added social feature:
  - `social.api.ts` client and `social.types.ts` types.
  - Hooks: `useUserSearch`, `useFollowUser`, `useUnfollowUser`, `useFriends`,
    `useFollowers`, `useFollowRequests`, `useAcceptFollowRequest`,
    `useRejectFollowRequest`, `usePublicProfile`.
  - Components: `UserSearchPanel`, `UserSearchResultItem`, `FriendsList`,
    `FriendListItem`, `FollowersList`, `FollowRequestsPanel`, `FollowRequestItem`,
    `PublicProfileDialog`, `SocialSkeleton`.
  - `FriendsPage` composes the panels (Kullanıcı Ara, Takip Ettiklerim, Takipçiler,
    Gelen İstekler) and hosts the public-profile dialog.
  - Debounced (350 ms) user search; empty/loading/error/empty-result states.
- Added leaderboard feature:
  - `leaderboard.api.ts` client and `leaderboard.types.ts` types.
  - Hooks: `useWeeklyLeaderboard`, `useMonthlyLeaderboard`, `useFriendsLeaderboard`,
    `useMyLeaderboardSummary`, `useRecalculateScore`.
  - Components: `LeaderboardTabs`, `LeaderboardTable`, `LeaderboardRow`,
    `MyLeaderboardSummary`, `PointsBreakdownCard`, `RecalculateScoreButton`,
    `LeaderboardSkeleton`.
  - `LeaderboardPage` composes the summary, tabs (Haftalık/Aylık/Arkadaşlar),
    table and points breakdown. Monthly/friends tabs fetch lazily on selection.
  - Current-user leaderboard row is highlighted using the id from the auth context.
  - `RecalculateScoreButton` invalidates leaderboard and dashboard queries on success.
- Added Turkish label utilities:
  - `social-labels.ts` (privacy labels, initials, short date).
  - `leaderboard-labels.ts` (point-source labels).
- Public profile only renders safe fields (username, fullName, avatar, privacy) and
  the optional stats the backend returns (weeklyScore, todayStepTotal, currentStreak).
  Weight, birth date and other private data are never requested or shown.
- No backend code was changed. No Prisma schema change was made.
- Challenges, badges, and external integrations were not implemented.

## Social/leaderboard behavior notes

- `FollowStatus` enum values are `PENDING`, `ACCEPTED`, `BLOCKED` (rejecting a request
  deletes it; there is no `REJECTED` value). The follow button reflects these states.
- Friends leaderboard `period` defaults to `weekly`; the page requests `weekly`.
- `recalculate` is called with an empty body (recalculates today).
- Point sources include `AGGREGATE` plus the ten activity sources; all are translated.

## Changed files

New social files:

- `frontend/src/features/social/api/social.api.ts`
- `frontend/src/features/social/types/social.types.ts`
- `frontend/src/features/social/utils/social-labels.ts`
- `frontend/src/features/social/hooks/useUserSearch.ts`
- `frontend/src/features/social/hooks/useFollowUser.ts`
- `frontend/src/features/social/hooks/useUnfollowUser.ts`
- `frontend/src/features/social/hooks/useFriends.ts`
- `frontend/src/features/social/hooks/useFollowers.ts`
- `frontend/src/features/social/hooks/useFollowRequests.ts`
- `frontend/src/features/social/hooks/useAcceptFollowRequest.ts`
- `frontend/src/features/social/hooks/useRejectFollowRequest.ts`
- `frontend/src/features/social/hooks/usePublicProfile.ts`
- `frontend/src/features/social/components/SocialSkeleton.tsx`
- `frontend/src/features/social/components/UserSearchPanel.tsx`
- `frontend/src/features/social/components/UserSearchResultItem.tsx`
- `frontend/src/features/social/components/FriendsList.tsx`
- `frontend/src/features/social/components/FriendListItem.tsx`
- `frontend/src/features/social/components/FollowersList.tsx`
- `frontend/src/features/social/components/FollowRequestsPanel.tsx`
- `frontend/src/features/social/components/FollowRequestItem.tsx`
- `frontend/src/features/social/components/PublicProfileDialog.tsx`
- `frontend/src/features/social/pages/FriendsPage.tsx` (replaced placeholder)

New leaderboard files:

- `frontend/src/features/leaderboard/api/leaderboard.api.ts`
- `frontend/src/features/leaderboard/types/leaderboard.types.ts`
- `frontend/src/features/leaderboard/utils/leaderboard-labels.ts`
- `frontend/src/features/leaderboard/hooks/useWeeklyLeaderboard.ts`
- `frontend/src/features/leaderboard/hooks/useMonthlyLeaderboard.ts`
- `frontend/src/features/leaderboard/hooks/useFriendsLeaderboard.ts`
- `frontend/src/features/leaderboard/hooks/useMyLeaderboardSummary.ts`
- `frontend/src/features/leaderboard/hooks/useRecalculateScore.ts`
- `frontend/src/features/leaderboard/components/LeaderboardTabs.tsx`
- `frontend/src/features/leaderboard/components/LeaderboardTable.tsx`
- `frontend/src/features/leaderboard/components/LeaderboardRow.tsx`
- `frontend/src/features/leaderboard/components/MyLeaderboardSummary.tsx`
- `frontend/src/features/leaderboard/components/PointsBreakdownCard.tsx`
- `frontend/src/features/leaderboard/components/RecalculateScoreButton.tsx`
- `frontend/src/features/leaderboard/components/LeaderboardSkeleton.tsx`
- `frontend/src/features/leaderboard/pages/LeaderboardPage.tsx` (replaced placeholder)

Removed `.gitkeep` from now-populated social/leaderboard `api`, `components`,
`hooks`, `types` and `utils` directories.

- `docs/CURRENT_STATE.md`

## Commands run

```bash
npm run build      # frontend: tsc -b && vite build (passed)
npm run preview -- --port 4193 --strictPort   # route smoke check
node dist/server.js   # backend started locally for live API verification
```

## Social flow check results

A scripted end-to-end run against the live backend (two fresh users A and B, each
seeded with profile, active goal, steps and a recalculation) passed 21/21 checks:

- `GET /users/search` returns the target user with `followStatus` and `privacyLevel`.
- `POST /follows/:id` creates a `PENDING` follow (HTTP 201).
- `GET /follows/requests` (B) lists A's pending request.
- `POST .../accept` moves the follow to `ACCEPTED`.
- `GET /follows/friends` (A) lists B with `followedAt`.
- `GET /follows/followers` (B) lists A.
- `GET /users/:id/public-profile` returns safe fields plus stats for a PUBLIC user
  (`weeklyScore`, `todayStepTotal`) and does not include private fields.
- `DELETE /follows/:id` returns `unfollowed: true`.
- Preview route smoke checks returned HTTP 200 for `/friends` and `/login`.

## Leaderboard flow check results

From the same scripted run:

- `POST /leaderboard/recalculate` returned a numeric `dailyScore` and `points` array.
- `GET /leaderboard/weekly` and `/monthly` returned ranked rows with the expected
  shape (`rank`, `totalScore`, `totalSteps`, `workoutDays`, `loggedDays`).
- `GET /leaderboard/friends?period=weekly` returned rows including followed user B.
- `GET /leaderboard/me/summary` returned `todayScore`, `weeklyScore`, `monthlyScore`,
  ranks, `pointsBreakdown` and `currentStreak`; all point sources were known enum values.
- Preview route smoke check returned HTTP 200 for `/leaderboard`.

## Known issues

- Full browser automation is not installed; client-side redirect/render behavior was
  verified via route smoke checks and live API contract checks rather than a real browser.
- Vite still reports a chunk-size warning (`>500 kB` JS). The build succeeds; code
  splitting can be a later optimization.
- `currentStreak` is still returned as `0` by the backend (streak calculation not yet
  implemented). The UI shows it normally without referencing the backend gap.
- Avatars render as username initials; image avatars are not part of the MVP yet.

## Current phase status

Phase 13 (frontend social and leaderboard pages) is complete and builds successfully.

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
- `feat: connect social and leaderboard pages` (this phase)

## Next recommended step

Review the social and leaderboard UI, then connect the Profile / Profil and
Settings / Ayarlar pages to the backend (profile + goals editing) when explicitly requested.
