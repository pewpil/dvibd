# `dvibd` Project Context

This file contains context specific to the `dvibd` workspace (`api` and `gui`). Repository-wide standards and instructions live in the repository root `AGENTS.md`.

## Workspace Structure
- `dvibd/api`: Backend API service running on Node, deployed as a Netlify Function.
- `dvibd/gui`: client-side SPA built with Vite and SolidJS. It has no server runtime, no SSR, and no Cloudflare workerd deployment target.

## API Specifics (`dvibd/api`)
- **Runtime**: Node 24 LTS. `src/main.ts` serves locally through `@hono/node-server`; `netlify/functions/api.ts` adapts the same Hono app to a Netlify Function, so `app.fetch` handles every request.
- **Configuration**: Strict compiler flags live in `dvibd/api/tsconfig.json` and mirror the set the Deno setup enforced (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, and the rest). Imports carry explicit `.ts` / `.mts` extensions, so `allowImportingTsExtensions` stays on with `noEmit`.
- **Env Resolution**: `src/config.ts` follows the repository env policy. `npm run dev` and `npm run start` export `LOCAL_ENV=1`, so localhost runs use the dev defaults and ignore ambient variables; a deployed run requires `DATABASE_URL`, `CORS_ORIGIN`, and `JWT_SECRET` from `process.env` and throws when any is missing. `PORT` defaults to `3002` outside local mode because the function never binds one.
- **Type Checking**: Verify with `npx tsc --noEmit` from `dvibd/api`.
- **Shared ORM**: Consumes the generated Prisma client at `dvibd/api/src/generated` (`api-client`, runtime `nodejs`). `src/db.ts` caps the pg adapter at one pooled connection per function instance, which is what the Supavisor session pooler expects from serverless callers.
- **Dependencies**: npm only (`hono`, `zod`, `@hono/zod-validator`, `@prisma/adapter-pg`, `pg`, native `bcrypt`). There is no `deno.json` imports map and no JSR dependency.
- **Frameworks Not Used Here**: React, Next.js, SolidJS, Tailwind, and every other UI framework. This is a headless HTTP API built on Hono, so UI skills such as `web-design-guidelines` do not apply to it.
- **Deployment**: `netlify.toml` sits beside `package.json`, so the Netlify base directory is `dvibd/api`. The project is functions-only: the build command generates the Prisma client and creates the empty `public/` directory, and `netlify/functions/api.ts` declares `path: "/*"`. `DATABASE_URL` and `JWT_SECRET` are secrets in both the production and deploy-preview contexts; `CORS_ORIGIN` is `https://dvibd.netlify.app`. `dvibd/gui` proxies `/api/*` to this project, so browser calls stay same-origin.

## GUI Specifics (`dvibd/gui`)
- **Framework & Runtime**: SolidJS with Vite, client-side only. This app is **not SolidStart**. There is no `@solidjs/start`, no `nitro`, and no `@solidjs/meta` in `dvibd/gui/package.json`, and it is a client-side SPA with no server runtime and no SSR.
- **Do not apply SolidStart idioms here.** The SolidStart guidance in the repository root `AGENTS.md` (`query`, `createAsync`, `cache`, `action` / `<Form>`, `"use server"`, `getRequestEvent()`, `h3` cookies) targets `social` only and does not apply to this app.
- **Frameworks Not Used Here**: React, Next.js, Tailwind CSS, SolidStart, and every other SolidJS meta-framework. The only styling mechanism is CSS Modules. This app and `social` share `solid-js` and `@solidjs/router` and nothing else: `social` is SolidStart, this app is plain Vite plus Solid.
- **No workerd Deployment**: `dvibd/gui` has no `wrangler.toml` and no `wrangler.jsonc`, and `vite.config.ts` produces a static bundle. The only `workerd` reference tied to this app is the `gui-client` generator in `orm/prisma/schema.prisma`, where `runtime = "workerd"` selects the emitted client's runtime type hints. That setting describes code generation, not deployment.
- **Routing**: Declarative and wired by hand in `src/uis/index.tsx` using `Router` and `Route` from `@solidjs/router`. There is no file-based routing; add new routes in that file.
- **Bootstrap**: `index.html` provides `div#root`, and `src/uis/index.tsx` mounts with `render()` from `solid-js/web`.
- **Dev Server**: Port `3000`, defined in `vite.config.ts`. That config proxies `/api` to `http://localhost:3002` and strips the `/api` prefix from the forwarded path.
- **Deployment**: `netlify.toml` sits beside `package.json`, so the Netlify base directory is `dvibd/gui`. It publishes `dist` and adds an SPA redirect because routing is declarative and client-side, so deep links would otherwise 404. Its `/api/*` redirect is declared before that SPA rule and proxies to the `dvibd-api` project, so the `/api/auth/...` fetch calls need no production base URL. Its build command runs `npm --prefix ../../orm run generate` first: `tsc -b` type-imports from the gitignored `src/generated/browser.mts`, so the build fails without that step. The prefix is `../../orm` rather than `../orm` because the base directory is nested one level deeper than the other apps. The command also carries the masked-`DATABASE_URL` guard from the root `AGENTS.md` deployment section, since `prisma generate` rejects the masked value that `--secret` variables present to local CLI builds; `orm/.env` supplies the real URL through dotenv.
- **Type Checking**: Verify with `npx tsc -b` from `dvibd/gui`.
- **File Mirroring**:
  - `src/uis/` and `src/styles/` mirror each other: every component and page under `uis/` has a parallel CSS Module under `styles/` in the same relative path (e.g. `uis/components/dvibd/home/NavBar.tsx` <-> `styles/components/dvibd/home/NavBar.module.css`, `uis/pages/dvibd/home/Landing.tsx` <-> `styles/pages/dvibd/home/Landing.module.css`), with root `uis/index.tsx` <-> `styles/index.css`.
  - Consumes generated Prisma client at `dvibd/gui/src/generated`.