# Project Scope

## Product definition

FitBoard is a social health tracking web app for friends.

Users can log meals, calories, macros, steps, workouts, off days and daily notes. They can follow friends, compare weekly progress and join challenges.

## MVP features

1. Auth
   - Register
   - Login
   - JWT auth
   - Current user endpoint

2. Profile
   - Full name
   - Username
   - Avatar
   - Height
   - Weight
   - Age / birth date
   - Goal type
   - Privacy level

3. Goals
   - Daily calorie goal
   - Protein goal
   - Step goal
   - Weekly workout goal

4. Nutrition
   - Meal types: breakfast, lunch, dinner, snack
   - Food search
   - Add food entry
   - Calories and macros
   - Food aliases
   - Snapshot values on entries

5. Activity
   - Steps
   - Walk distance
   - Run distance
   - Workout
   - Off day
   - Daily note

6. Dashboard
   - Daily calories
   - Remaining calories
   - Macros
   - Steps
   - Workout/off-day status
   - Streak
   - Weekly score

7. Social
   - User search
   - Follow / unfollow
   - Friend profile preview
   - Privacy checks

8. Leaderboard
   - Weekly score
   - Monthly score
   - Friends leaderboard
   - Steps leaderboard
   - Workout leaderboard

## Out of MVP

- Mobile app
- Health Connect integration
- HealthKit integration
- Barcode scanner
- Food photo recognition
- Payment system
- Subscription system
- Advanced admin panel

## Product safety

Leaderboard must not reward starvation.

Do not rank users by lowest calorie intake.

Use discipline score:
- Food logging
- Goal range
- Protein target
- Step target
- Workout completion
- Off-day consistency
- Streak
