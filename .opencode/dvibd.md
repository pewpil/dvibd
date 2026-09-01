# `dvibd` Project Context

This file contains context specific to the `dvibd` workspace (`api` and `gui`). Global standards and instructions live in `.opencode/instructions.md`.

## Workspace Structure
- `dvibd/api`: Backend API service running on Deno.
- `dvibd/gui`: Frontend user interface running on Cloudflare workerd / Vite (Node).

## API Specifics (`dvibd/api`)
- **Runtime**: Deno.
- **Configuration**: Respect `compilerOptions`, `fmt`, and `lint` in `dvibd/api/deno.json`.
- **Type Checking**: Verify with `deno check src/main.ts` from `dvibd/api`.
- **Shared ORM**: Consumes generated Prisma client at `dvibd/api/src/generated`.

## GUI Specifics (`dvibd/gui`)
- **Framework & Runtime**: SolidJS / SolidStart with Vite on Cloudflare workerd (Node).
- **Type Checking**: Verify with `npx tsc -b` from `dvibd/gui`.
- **File Mirroring**:
  - `src/uis/` and `src/styles/` mirror each other: every component and page under `uis/` has a parallel CSS Module under `styles/` in the same relative path (e.g. `uis/components/dvibd/home/NavBar.tsx` <-> `styles/components/dvibd/home/NavBar.module.css`, `uis/pages/dvibd/home/Landing.tsx` <-> `styles/pages/dvibd/home/Landing.module.css`), with root `uis/index.tsx` <-> `styles/index.css`.
  - Consumes generated Prisma client at `dvibd/gui/src/generated`.
