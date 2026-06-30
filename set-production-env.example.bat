@echo off
setlocal

rem Safe production-like env writer.
rem Copy to set-production-env.bat and replace placeholders. Never commit the real file.
rem Railway backend should normally use Railway variables directly instead of this file.

(
  echo DATABASE_URL="postgresql://postgres:YOUR_ROTATED_RAILWAY_PASSWORD@RAILWAY_PUBLIC_PROXY_HOST:RAILWAY_PUBLIC_PROXY_PORT/railway"
  echo JWT_SECRET="YOUR_STRONG_PRODUCTION_JWT_SECRET"
  echo NODE_ENV="production"
  echo PORT=5000
  echo FRONTEND_URL="https://YOUR_FRONTEND_DOMAIN"
  echo CLIENT_URL="https://YOUR_FRONTEND_DOMAIN"
) > backend\.env

(
  echo VITE_API_URL="https://YOUR_BACKEND_DOMAIN/api"
  echo VITE_SOCKET_URL="https://YOUR_BACKEND_DOMAIN"
) > frontend\.env

echo Production-like env files were written with placeholder-safe values.
echo Replace placeholders in ignored local files before production-like testing.

endlocal
