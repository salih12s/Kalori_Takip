@echo off
setlocal

rem Safe local development env writer.
rem Copy to set-local-env.bat and replace placeholders. Never commit the real file.

(
  echo DATABASE_URL="postgresql://postgres:YOUR_LOCAL_PASSWORD@localhost:5432/kalori_takip?schema=public"
  echo JWT_SECRET="local-dev-change-me-use-a-long-random-value"
  echo NODE_ENV="development"
  echo PORT=5000
  echo FRONTEND_URL="http://localhost:5173"
  echo CLIENT_URL="http://localhost:5173"
) > backend\.env

(
  echo VITE_API_URL="http://localhost:5000/api"
  echo VITE_SOCKET_URL="http://localhost:5000"
  echo VITE_APP_VERSION="local-dev"
) > frontend\.env

echo Local env files were written with placeholder-safe values.
echo Replace placeholders in ignored local files before running the app.

endlocal
