# API Contract

Base URL:

```txt
http://localhost:5000/api
```

## Auth

```http
POST /auth/register
POST /auth/login
GET /auth/me
```

Register body:

```json
{
  "email": "test@example.com",
  "username": "salih",
  "password": "123456"
}
```

## Profile

```http
GET /profile/me
PUT /profile/me
```

Profile body:

```json
{
  "fullName": "Salih Saydam",
  "heightCm": 174,
  "currentWeightKg": 92,
  "privacyLevel": "FRIENDS"
}
```

## Goals

```http
GET /goals/me
POST /goals
PUT /goals/:goalId
```

Goal body:

```json
{
  "goalType": "LOSE_WEIGHT",
  "dailyCalorieGoal": 2300,
  "dailyProteinGoal": 140,
  "dailyStepGoal": 10000,
  "weeklyWorkoutGoal": 4
}
```

## Nutrition

```http
GET /foods/search?q=egg
POST /foods
GET /meals?date=2026-06-30
POST /meals/entries
DELETE /meals/entries/:entryId
```

Add food entry body:

```json
{
  "date": "2026-06-30",
  "mealType": "BREAKFAST",
  "foodId": "uuid",
  "quantity": 2,
  "unit": "adet"
}
```

## Activity

```http
GET /activities?date=2026-06-30
POST /activities
POST /activities/off-day
```

Activity body:

```json
{
  "date": "2026-06-30",
  "activityType": "RUN",
  "steps": 6000,
  "distanceKm": 4.2,
  "durationMinutes": 35,
  "note": "Sabah koşusu"
}
```

## Dashboard

```http
GET /dashboard/today
GET /dashboard/weekly
```

## Social

```http
GET /users/search?q=salih
POST /follows/:userId
DELETE /follows/:userId
GET /follows/friends
```

## Leaderboard

```http
GET /leaderboard/weekly
GET /leaderboard/monthly
GET /leaderboard/friends
```
