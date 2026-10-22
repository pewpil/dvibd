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
  - `api-client`: output `../../dvibd/api/src/generated` (runtime: `deno`, extension: `mts`)
  - `gui-client`: output `../../dvibd/gui/src/generated` (runtime: `workerd`, extension: `mts`)
  - `social-client`: output `../../social/src/server/generated` (runtime: `nodejs`, extension: `mts`)
- Keep all generator entries intact in `schema.prisma`.
- Generated output directories are gitignored in each app.

## Migrations & Database Management
- Migrations live under `orm/prisma/migrations/`.
- Run migrations using Prisma CLI commands from `orm/`:
  ```bash
  cd orm && npx prisma migrate dev
  ```
- Against a hosted database, use `cd orm && npm run migrate:deploy` (`prisma migrate deploy`). `migrate dev` is for local `db/` only.

## ORM Version Pin
- The `^7.9.1` pin on `prisma` is deliberate, not drift. Prisma 8 has not shipped as stable: npm's `latest` tag points at `8.0.0-rc.24`, and Prisma's 2026-10-02 changelog states the final release was expected in October 2026. Wait for stable `8.0.0` and a settled Prisma 7 to 8 upgrade guide before planning the bump; Prisma ORM 7 receives fixes for 18 months after the 8 GA.
- Do not outrun the pin: npm's `latest` tag resolves to the 8 RC, so only run the CLI through this package's dependency (`npx prisma` from `orm/`), never `npx prisma@latest`.
- The move will be a project, not a version bump: Prisma 8 replaces `prisma generate` with `prisma contract emit`, changes the query style (`prisma.user.findMany` becomes `db.orm` calls), still reads a Prisma 7 Postgres schema, and this workspace's three per-runtime generator blocks (deno, workerd, nodejs) have no direct equivalent under 8's model.

## Environment Resolution
`prisma.config.ts` resolves `DATABASE_URL` from `process.env` first, then throws if a `.env` file exists without it, then throws in production, and only otherwise falls back to the local `db/` default. `import "dotenv/config"` runs first, so a local `.env` lands in `process.env` and is picked up by the first branch. Netlify exposes site variables to builds and function runtimes and has no `.env` file, which is why the `process.env`-first order matters; see the env policy in the repository root `AGENTS.md`.