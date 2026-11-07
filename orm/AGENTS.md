# `orm` Rules & Guidelines

Repository-wide standards and instructions live in the repository root `AGENTS.md`.

## Scope
This is a Node tooling package (`@dvibd/orm`), not a web application. It contains no UI, so no front-end frameworks are present or relevant: there is no React, Next.js, SolidJS, Tailwind, or any CSS of its own. UI-oriented skills such as `web-design-guidelines` and the React skills from `vercel-labs/agent-skills` do not apply here. The only skills that apply are the Prisma ones.

## Single Source of Truth
- `orm/` is the single source of truth for the database schema across the entire `dvibd` repository.
- Individual apps (`dvibd/api`, `dvibd/gui`, `social`, `message`) are clients of this ORM and do not define their own schema.
- The schema is located in `orm/prisma/schema.prisma`.

## Client Generation
- Whenever `prisma/schema.prisma` is modified, regenerate clients from the `orm/` directory:
  ```bash
  cd orm && npm run generate
  ```
- Generator entries in `schema.prisma` produce generated clients for target workspaces:
  - `api-client`: output `../../dvibd/api/src/generated` (runtime: `nodejs`, extension: `mts`)
  - `gui-client`: output `../../dvibd/gui/src/generated` (runtime: `workerd`, extension: `mts`)
  - `social-client`: output `../../social/src/server/generated` (runtime: `nodejs`, extension: `mts`)
  - `message-client`: output `../../message/src/server/generated` (runtime: `nodejs`, extension: `mts`)
- Keep all generator entries intact in `schema.prisma`.
- Generated output directories are gitignored in each app.

## Migrations & Database Management
- Migrations live under `orm/prisma/migrations/`.
- The local scripts set `LOCAL_ENV=1`, which locks the run to the `db/` service (`postgresql://dvibd:dvibd@localhost:3001/dvibd`):
  ```bash
  cd orm && npm run migrate -- --name <migration_name>
  cd orm && npm run migrate:status
  cd orm && npm run push
  cd orm && npm run reset
  cd orm && npm run studio
  ```
- `npm run generate` needs no environment: it falls back to the local URL because `prisma generate` does not connect.
- `migrate dev` is for local `db/` only. Do not run it against a hosted database.
- Apply migrations to a hosted database with `DIRECT_URL` (the Supabase session-pooler URL) or `DATABASE_URL` supplied by the invoking shell, never a `.env` file:
  ```bash
  cd orm && DIRECT_URL="<Supabase session-pooler URL>" npm run migrate:deploy
  ```
- Run `migrate:deploy` before the app deploy. The script guards for a hosted URL and exits non-zero with a clear message when neither `DIRECT_URL` nor `DATABASE_URL` is set, so it can never fall through to the local URL.

## ORM Version Pin
- The `^7.9.1` pin on `prisma` is deliberate, not drift. Prisma 8 has not shipped as stable: npm's `latest` tag points at `8.0.0-rc.24`, and Prisma's 2026-10-02 changelog states the final release was expected in October 2026. Wait for stable `8.0.0` and a settled Prisma 7 to 8 upgrade guide before planning the bump; Prisma ORM 7 receives fixes for 18 months after the 8 GA.
- Do not outrun the pin: npm's `latest` tag resolves to the 8 RC, so only run the CLI through this package's dependency (`npx prisma` from `orm/`), never `npx prisma@latest`.
- The move will be a project, not a version bump: Prisma 8 replaces `prisma generate` with `prisma contract emit`, changes the query style (`prisma.user.findMany` becomes `db.orm` calls), still reads a Prisma 7 Postgres schema, and this workspace's per-runtime generator blocks (`nodejs` and `workerd`) have no direct equivalent under 8's model.

## Environment Resolution
`config.ts` owns the local default (`postgresql://dvibd:dvibd@localhost:3001/dvibd`) and the `LOCAL_ENV=1` lock. `prisma.config.ts` calls `resolveDatabaseUrl()` and passes the result to `datasource.url`; it does not load dotenv or read a `.env` file.

Resolution order:
1. `LOCAL_ENV=1`: return the local default and ignore ambient `DIRECT_URL` and `DATABASE_URL` (warn once per variable when either differs).
2. Otherwise `DIRECT_URL` from the environment, when set and non-empty.
3. Otherwise `DATABASE_URL` from the environment, when set and non-empty.
4. Otherwise the local default. This keeps `prisma generate` working without an environment because it does not connect.

`DIRECT_URL` is the Supabase session-pooler URL used for migrations; `DATABASE_URL` is the runtime and app URL. The CLI prefers `DIRECT_URL` for migration work. Hosted values come only from the invoking shell (Netlify exposes site variables to builds and function runtimes); no hosted URL is stored in `orm/` and no hosted URL is used as a fallback. Every selected URL is validated with `zod`.
