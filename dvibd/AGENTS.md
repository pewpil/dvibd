# `dvibd` Project Context

This file contains context specific to the `dvibd` workspace (`api` and `gui`). Repository-wide standards and instructions live in the repository root `AGENTS.md`.

## Workspace Structure
- `dvibd/api`: Backend API service running on Deno.
- `dvibd/gui`: client-side SPA built with Vite and SolidJS. It has no server runtime, no SSR, and no Cloudflare workerd deployment target.

## API Specifics (`dvibd/api`)
- **Runtime**: Deno.
- **Configuration**: Respect `compilerOptions`, `fmt`, and `lint` in `dvibd/api/deno.json`.
- **Type Checking**: Verify with `deno check src/main.ts` from `dvibd/api`.
- **Shared ORM**: Consumes generated Prisma client at `dvibd/api/src/generated`.
- **Frameworks Not Used Here**: React, Next.js, SolidJS, Tailwind, and every other UI framework. This is a headless HTTP API built on Hono, so UI skills such as `web-design-guidelines` do not apply to it. It is also not a Node app: it runs on Deno and pulls Hono, Zod, and bcrypt from JSR through the `imports` map in `deno.json`.

## GUI Specifics (`dvibd/gui`)
- **Framework & Runtime**: SolidJS with Vite, client-side only. This app is **not SolidStart**. There is no `@solidjs/start`, no `nitro`, and no `@solidjs/meta` in `dvibd/gui/package.json`, and it is a client-side SPA with no server runtime and no SSR.
- **Do not apply SolidStart idioms here.** The SolidStart guidance in the repository root `AGENTS.md` (`query`, `createAsync`, `cache`, `action` / `<Form>`, `"use server"`, `getRequestEvent()`, `h3` cookies) targets `social` only and does not apply to this app.
- **Frameworks Not Used Here**: React, Next.js, Tailwind CSS, SolidStart, and every other SolidJS meta-framework. The only styling mechanism is CSS Modules. This app and `social` share `solid-js` and `@solidjs/router` and nothing else: `social` is SolidStart, this app is plain Vite plus Solid.
- **No workerd Deployment**: `dvibd/gui` has no `wrangler.toml` and no `wrangler.jsonc`, and `vite.config.ts` produces a static bundle. The only `workerd` reference tied to this app is the `gui-client` generator in `orm/prisma/schema.prisma`, where `runtime = "workerd"` selects the emitted client's runtime type hints. That setting describes code generation, not deployment.
- **Routing**: Declarative and wired by hand in `src/uis/index.tsx` using `Router` and `Route` from `@solidjs/router`. There is no file-based routing; add new routes in that file.
- **Bootstrap**: `index.html` provides `div#root`, and `src/uis/index.tsx` mounts with `render()` from `solid-js/web`.
- **Dev Server**: Port `3000`, defined in `vite.config.ts`. That config proxies `/api` to `http://localhost:3002` and strips the `/api` prefix from the forwarded path.
- **Type Checking**: Verify with `npx tsc -b` from `dvibd/gui`.
- **File Mirroring**:
  - `src/uis/` and `src/styles/` mirror each other: every component and page under `uis/` has a parallel CSS Module under `styles/` in the same relative path (e.g. `uis/components/dvibd/home/NavBar.tsx` <-> `styles/components/dvibd/home/NavBar.module.css`, `uis/pages/dvibd/home/Landing.tsx` <-> `styles/pages/dvibd/home/Landing.module.css`), with root `uis/index.tsx` <-> `styles/index.css`.
  - Consumes generated Prisma client at `dvibd/gui/src/generated`.