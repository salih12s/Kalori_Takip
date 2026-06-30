# FitBoard / KaloriTakip

FitBoard, arkadaş grupları için geliştirilmiş sosyal kalori, makro, aktivite, rozet ve liderlik takibi uygulamasıdır.

## Tech Stack

Backend:

- Node.js, Express, TypeScript
- PostgreSQL, Prisma
- JWT, bcrypt, Zod

Frontend:

- React, Vite, TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form, Zod
- Recharts, Motion, Axios

## Features

- Kayıt, giriş ve JWT tabanlı oturum
- Profil ve hedef yönetimi
- Yemek günlüğü, kalori ve makro takibi
- 188 öğeli curated Türkçe yemek veritabanı ve opsiyonel dış kaynak import akışı
- Aktivite, su, antrenman ve dinlenme günü takibi
- Dashboard, haftalık özet ve disiplin skoru
- Arkadaş takip sistemi ve gizlilik kontrolleri
- Liderlik tablosu
- Rozetler ve streak/gamification özeti
- Açık/koyu tema tercihi

Not: Challenge backend ve veritabanı yapısı korunur, ancak Challenge UI normal kullanıcı akışından gizlenmiştir. Arkadaş rekabeti Liderlik Tablosu üzerinden ilerler.

## Local Setup

Requirements:

- Node.js 22+
- PostgreSQL
- npm

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Environment Variables

Never commit `.env` files.

Backend example: `backend/.env.example`

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/kalori_takip?schema=public"
JWT_SECRET="change_this_to_a_long_random_secret"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

Frontend example: `frontend/.env.example`

```env
VITE_API_URL="http://localhost:5000/api"
VITE_SOCKET_URL="http://localhost:5000"
```

### Local Env Switching

Safe templates are committed:

```bash
set-local-env.example.bat
set-production-env.example.bat
```

Real local scripts are intentionally ignored by Git:

```bash
set-local-env.bat
set-production-env.bat
*.local.bat
```

Use the examples as templates and keep real passwords, JWT secrets and Railway proxy values only in ignored local files. Never commit real `.env` files or `.bat` files that contain secrets.

`set-local-env.bat` writes local development `backend/.env` and `frontend/.env` values.

`set-production-env.bat` is only for local production-like testing with placeholder values replaced in the ignored local file.

## Database

Recommended local database name:

```txt
kalori_takip
```

Run Prisma commands from `backend/`:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed:foods
```

`npm run seed:foods` komutu idempotent çalışır; aynı curated yemekleri tekrar çoğaltmaz.

Check migration status:

```bash
npx prisma migrate status
```

## Development

Run backend and frontend together from the project root:

```bash
npm install
npm run dev
```

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Default URLs:

- Backend API: `http://localhost:5000/api`
- Frontend: `http://localhost:5173`

## Build

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

## Deployment Notes

- Configure production environment variables in the host platform.
- Do not upload local `.env` files.
- Run Prisma migrations before serving the backend.
- Set frontend `VITE_API_URL` to the deployed backend API URL.
- Set backend `FRONTEND_URL` to the deployed frontend URL.

### Railway Backend Service

Railway should deploy the backend service from the backend folder, not the repository root.

Recommended backend service settings:

```txt
Root Directory: backend
Build Command: npm ci && npm run prisma:generate && npm run build
Start Command: npm run start:prod
```

Required Railway backend variables:

```txt
DATABASE_URL=${{ Postgres.DATABASE_URL }}
JWT_SECRET=strong production secret
NODE_ENV=production
FRONTEND_URL=https://frontend-domain
CLIENT_URL=https://frontend-domain
```

Do not set Railway `DATABASE_URL` to localhost. Railway Postgres provides `DATABASE_URL`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD` and `PGDATABASE` from the Postgres service.

### DBeaver Railway DB Connection

For DBeaver, use Railway's public TCP proxy or `DATABASE_PUBLIC_URL`, not the internal service host.

Use host mode:

```txt
Host: RAILWAY_TCP_PROXY_DOMAIN
Port: RAILWAY_TCP_PROXY_PORT
Database: PGDATABASE, usually railway
Username: PGUSER, usually postgres
Password: PGPASSWORD
```

Do not use `localhost` for Railway DB. Do not use `postgres.railway.internal` from DBeaver; that host is for Railway internal services. If DBeaver has `Database=postgres` while Railway `PGDATABASE=railway`, change it to `railway`.

## Security

- Never commit `.env`, database dumps, API keys, JWT secrets or private keys.
- Keep `node_modules`, `dist`, `build`, logs and coverage output out of Git.
- Use strong `JWT_SECRET` values outside local development.
