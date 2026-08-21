# `dvibd` Project Memory

## Instruction Set Rules (all applications)
1. Never modify the project memory / instruction files (e.g. `.opencode/social.md`, `.opencode/dvibd.md`) without explicit permission from the user.
2. If a situation's only solution violates any instruction in the instruction set or something the user wants, stop and ask the user for permission before proceeding with the violating choice.

## Environment Variables Policy (all applications)
1. Default values must be hardcoded in the codespace.
2. `.env` files are strictly for production only.
3. If an application has an `.env` file, it expects to be running in production and that every required variable is present and complete. If any is missing or invalid, the application must error at startup.
4. Absence of `.env` means dev mode: use the hardcoded defaults. Never create `.env` files for local development.

## Shared Infrastructure
1. `orm/` and `db/` are shared across all applications in this project.
2. Each application has its own backend ecosystem. Applications must not proxy, call, or relay requests to `api/` or each other. They use their own Prisma client generated from `orm/` and talk directly to the Postgres instance from `db/`.
