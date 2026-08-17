# Routine Planner

Personal daily planning, focus tracking, and calm reports.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `DATABASE_URL`, `NEON_AUTH_BASE_URL`, and a stable `NEON_AUTH_COOKIE_SECRET` (at least 32 characters) in `.env.local`. Neon Auth must be enabled/configured in the Neon project before using the authenticated routes.

For email confirmation, open the Neon Console and, in the Auth configuration for the branch, enable email verification and configure email delivery (the shared development server or your own provider). Add the local and production app URLs to the trusted origins. The application also blocks unverified users and offers a resend action at `/verify-email`.

Apply the initial database migration with the SQL in `drizzle/0000_initial.sql`. This repository does not provision Neon or Vercel resources automatically.

## Checks

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

The domain tests cover idempotent daily generation, timestamp-based focus time, status transitions, timezone date keys, and report aggregation without requiring a live database.
