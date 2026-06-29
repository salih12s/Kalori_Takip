# Security

## Env

Never commit:

- `.env`
- API keys
- JWT secrets
- database passwords
- database dumps

Use `.env.example`.

## Passwords

- Never store plain passwords.
- Use bcrypt.
- Validate minimum password length.
- Compare hash on login.

## JWT

- Use strong JWT secret.
- Do not log tokens.
- Protect private endpoints.

## Authorization

Users can only update their own:
- profile
- goals
- meals
- food entries
- activity logs
- daily logs

## Privacy

Respect profile privacy:

- PUBLIC
- FRIENDS
- PRIVATE

Do not expose private user data to unauthorized users.

## CORS

Development can allow localhost frontend.

Production must allow only the production frontend domain.
