# `orm` Rules & Guidelines

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
