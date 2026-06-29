# Phase 0 Setup Prompt

Read these first:

- CLAUDE.md
- docs/CURRENT_STATE.md
- docs/PROJECT_SCOPE.md
- docs/TECH_STACK.md
- docs/ARCHITECTURE.md
- docs/DATABASE_SCHEMA.md
- docs/FRONTEND_RULES.md
- docs/BACKEND_RULES.md
- docs/CODE_SIZE_LIMITS.md
- docs/AI_AGENT_RULES.md
- docs/SECURITY.md

We are starting Phase 0.

Do only project setup.

Do not create auth UI.
Do not create dashboard UI.
Do not create nutrition UI.
Do not implement out-of-phase features.

Tasks:

1. Create backend structure.
2. Create frontend structure.
3. Create `.env.example`.
4. Create root `.gitignore`.
5. Create backend health endpoint:
   `GET /api/health`
6. Prepare Prisma schema for PostgreSQL.
7. Do not simplify the database design without approval.
8. Report install and migration commands.

Required response format:

```md
## Plan
## Files to change
## Implementation
## Commands
## Test checklist
## Next step
```
