# Architecture

## Main idea

The project must be modular, domain-based and AI-safe.

Do not build huge pages or huge services.

## Root structure

```txt
KaloriTakip/
├── CLAUDE.md
├── docs/
├── backend/
├── frontend/
└── README.md
```

## Backend structure

```txt
backend/src/
├── app.ts
├── server.ts
├── config/
├── database/
├── middlewares/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── profiles/
│   ├── goals/
│   ├── nutrition/
│   ├── activity/
│   ├── social/
│   ├── dashboard/
│   ├── leaderboard/
│   └── challenges/
├── shared/
│   ├── errors/
│   ├── responses/
│   ├── types/
│   └── utils/
└── jobs/
```

## Backend module pattern

```txt
modules/nutrition/
├── nutrition.routes.ts
├── nutrition.controller.ts
├── nutrition.service.ts
├── nutrition.repository.ts
├── nutrition.validation.ts
├── nutrition.types.ts
└── nutrition.mapper.ts
```

## Frontend structure

```txt
frontend/src/
├── app/
│   ├── providers/
│   └── router/
├── components/
│   ├── layout/
│   ├── ui/
│   ├── shared/
│   └── feedback/
├── features/
│   ├── auth/
│   ├── onboarding/
│   ├── dashboard/
│   ├── nutrition/
│   ├── activity/
│   ├── social/
│   ├── leaderboard/
│   ├── challenges/
│   ├── profile/
│   └── settings/
├── hooks/
├── lib/
├── services/
├── types/
└── utils/
```

## Frontend feature pattern

```txt
features/nutrition/
├── api/
├── components/
├── hooks/
├── pages/
├── schemas/
├── types/
└── utils/
```

## Domains

- Identity
- Profile
- Nutrition
- Activity
- Social
- Gamification
- System
