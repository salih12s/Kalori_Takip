# Prisma Schema Reference

This file describes the schema direction.

The actual executable Prisma file should be:

```txt
backend/prisma/schema.prisma
```

Use the models from `docs/DATABASE_SCHEMA.md`.

Required MVP models:

- User
- Profile
- UserGoal
- DailyLog
- Food
- FoodAlias
- Meal
- FoodEntry
- ActivityEntry
- Follow
- LeaderboardPoint

Important:
- Use PostgreSQL.
- Use UUID ids.
- Use enums.
- Use indexes for userId/date lookups.
- Use `@@unique([userId, date])` for DailyLog.
- Store nutrition snapshots in FoodEntry.
