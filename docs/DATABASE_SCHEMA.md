# Database Schema

## Design goals

- Modern PostgreSQL schema.
- Prisma-first development.
- Domain-based model grouping.
- Snapshot nutrition values.
- Privacy-ready social structure.
- Leaderboard based on healthy consistency.
- Future-ready integration sources.

## Domains

### Identity
- User
- AuthSession

### Profile
- Profile
- UserGoal
- BodyMetric

### Daily tracking
- DailyLog

### Nutrition
- Food
- FoodAlias
- FoodFavorite
- Meal
- FoodEntry
- FoodCache

### Activity
- ActivityEntry
- WorkoutSession
- WaterLog

### Social
- Follow

### Gamification
- LeaderboardPoint
- Badge
- UserBadge
- Challenge
- ChallengeMember

### System
- Notification
- AuditLog

## Key schema decisions

### DailyLog is central

DailyLog stores daily totals to avoid recalculating the entire day on every dashboard request.

It stores:
- totalCalories
- totalProtein
- totalCarbs
- totalFat
- totalSteps
- totalRunKm
- totalWalkKm
- totalWorkoutMinutes
- waterMl
- isWorkoutDay
- isOffDay
- dailyScore

### FoodEntry uses snapshots

FoodEntry must store calculated values:

- foodNameSnapshot
- calories
- protein
- carbs
- fat

Reason: old food logs must not change when the Food table changes later.

### FoodAlias improves Turkish search

Examples:

- yumurta
- haşlanmış yumurta
- egg
- boiled egg

All can point to the same Food.

### Source fields

Food and activity records should keep source values.

Examples:
- LOCAL
- USER_CREATED
- USDA
- OPEN_FOOD_FACTS
- MANUAL
- HEALTH_CONNECT
- HEALTHKIT
- STRAVA

## MVP models

Required for first working MVP:

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

## Later models

Can be added or activated later:

- AuthSession
- BodyMetric
- FoodFavorite
- FoodCache
- WorkoutSession
- WaterLog
- Badge
- UserBadge
- Challenge
- ChallengeMember
- Notification
- AuditLog
