# Current State

## Phase

Phase 6 - Social / follow backend is implemented.

## Completed work

- Implemented protected social/follow backend endpoints:
  - `GET /api/users/search?q=...`
  - `POST /api/follows/:userId`
  - `DELETE /api/follows/:userId`
  - `GET /api/follows/friends`
  - `GET /api/follows/followers`
  - `GET /api/follows/requests`
  - `POST /api/follows/requests/:followId/accept`
  - `POST /api/follows/requests/:followId/reject`
  - `GET /api/users/:userId/public-profile`
- Added social module with routes, controller, service, repository, validation, types, and mapper.
- Mounted social routes in `backend/src/app.ts`.
- Used existing `Follow` model and `FollowStatus` enum.
- No Prisma schema change was made.
- No frontend UI was created or changed.
- No leaderboard, challenges, badges, notifications, or external integrations were started.

## Follow behavior decision

The social module uses a follow request flow:

- New follows are created with `PENDING`.
- The target user must accept the request before it becomes `ACCEPTED`.
- Duplicate follow attempts return the existing follow row and do not create duplicates.
- Rejected requests are deleted because the schema has no `REJECTED` status.

This was chosen because the existing schema already supports `PENDING` and `ACCEPTED`, and it is safer for privacy than auto-accepting follows.

## Privacy behavior

- `PUBLIC`: returns safe profile summary and safe stats.
- `FRIENDS`: returns safe stats only to accepted followers or the profile owner; non-accepted viewers get a limited profile.
- `PRIVATE`: non-owner viewers get only minimal identity:
  - `userId`
  - `username`
  - `avatarUrl`
  - `privacyLevel`
- Public/friend stats currently include:
  - `todayStepTotal`
  - `weeklyScore`
  - `currentStreak: 0`
- No password hashes, health details, meal entries, body metrics, or private activity details are returned.

## Changed files

- `backend/src/app.ts`
- `backend/src/modules/social/social.routes.ts`
- `backend/src/modules/social/social.controller.ts`
- `backend/src/modules/social/social.service.ts`
- `backend/src/modules/social/social.repository.ts`
- `backend/src/modules/social/social.validation.ts`
- `backend/src/modules/social/social.types.ts`
- `backend/src/modules/social/social.mapper.ts`
- `docs/CURRENT_STATE.md`

## Commands run

```bash
npm run prisma:generate
npm run build
npm run prisma:migrate -- --name social_no_schema_change
```

Endpoint tests were run against the compiled backend with PowerShell `Invoke-RestMethod`.

## Endpoint test results

- Unauthenticated `GET /api/users/search?q=...`: returned 401.
- Created User A, User B, and User C with auth register.
- `GET /api/auth/me` passed for User A and User B.
- User A searched User B:
  - returned User B
  - did not return User A
  - did not leak `passwordHash`
- User A attempted to follow self:
  - returned 400.
- User A followed User B:
  - created `PENDING` follow request.
- Duplicate follow from User A to User B:
  - returned same follow ID
  - did not create duplicate row.
- User A friends list before accept:
  - returned 0 accepted friends.
- User B follow requests:
  - returned the pending request from User A.
- User A attempted to accept User B's received request:
  - returned 404 safe failure.
- User B accepted User A's request:
  - follow status became `ACCEPTED`.
- User A friends list after accept:
  - returned 1 accepted friend.
- User B followers list after accept:
  - returned 1 follower.
- FRIENDS public profile for accepted User A:
  - returned safe stats.
  - `todayStepTotal` was visible.
- User C followed User B:
  - created `PENDING` request.
- User A attempted to reject User C's request to User B:
  - returned 404 safe failure.
- User B rejected User C's request:
  - request deleted successfully.
- PUBLIC profile view:
  - returned safe stats.
- FRIENDS profile view by non-accepted user:
  - returned limited profile
  - did not include stats.
- PRIVATE profile view:
  - returned limited profile
  - did not include stats
  - did not expose full name.
- User A unfollowed User B:
  - safe success
  - User A friends list returned 0.

## Known issues

- `docs/prompts/UPDATE_CURRENT_STATE_PROMPT.md` still appears to contain Phase 0 prompt content; there was no safe matching source content to restore it.
- PowerShell on this machine does not support `&&`; commands were run separately.
- Existing frontend dev server was left running, but no frontend code or UI was changed during Phase 6.
- `currentStreak` is returned as 0 because streak calculation has not been implemented yet.
- `weeklyScore` depends on existing `LeaderboardPoint` data. The leaderboard module has not been implemented yet, so it is usually 0.

## Git commits

- `9d3e91d feat: complete phase 0 setup and phase 1 auth`
- `21fe750 feat: add profile and goals modules`
- `9a32d17 feat: add nutrition backend module`
- `a535f89 feat: align nutrition schema`
- `63da7b2 feat: add dashboard backend module`
- `ba88747 feat: add activity backend module`

## Next recommended step

Review Phase 6 backend behavior, then start Phase 7 - Leaderboard backend only when explicitly requested.
