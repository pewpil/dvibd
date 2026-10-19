# `dvibd` Project Instructions

This file is the authoritative source of repository-wide standards that must be complied with. App-specific context lives in the workspace-scoped `AGENTS.md` files: `dvibd/AGENTS.md` (`dvibd` gui/api), `social/AGENTS.md` (`social`), `message/AGENTS.md` (`message`), `orm/AGENTS.md` (shared ORM), and `db/AGENTS.md` (database service). Contexts to remember live in the Workspace Memory section below.

## Repository Layout
- `dvibd/`: the main gui + api workspace (Deno API, client-side Vite/SolidJS GUI).
- `social/`: a standalone SolidStart app (self-contained backend, Node runtime).
- `message/`: a standalone Next.js App Router app (self-contained backend, Node runtime).
- `orm/`: shared Prisma schema, migrations, and generated clients (package `@dvibd/orm`). The apps are clients of this ORM; they do not define their own schema.
- `db/`: local test Postgres via docker-compose (see `db/AGENTS.md`).
- `.opencode/`: OpenCode project configuration.
- `.agents/skills/`: agent skills. Most are Prisma or Vercel skills that are gitignored and fully regenerable; `skills-lock.json` at the repository root is the tracked source of truth. Hand-written skills such as `sticky-scroll-headers` are tracked in git instead. See ORM & DB Standards below.

## Cross-Cutting Coding Standards
1. Use double quotes (`"`) for any string literal, never single quotes.
2. Write fully-typed TypeScript and TypeScriptXML code. No variable, parameter, or function may be declared without an explicit type (return types included).
3. Do not add code comments unless explicitly asked.
4. Refrain from using the em dash in any written output or content.
5. Never commit secrets or API keys. A secret that must live on disk belongs in a gitignored `*.key` file next to the configuration that references it, and is pulled in through `{file:*.key}` substitution. Never inline a key value in `opencode.json`.

## Runtime & Typecheck Standards (Deno vs Node)
- `dvibd/api` runtime is Deno. Respect `compilerOptions`, `fmt`, and `lint` in its `deno.json`.
- `dvibd/gui`, `social`, and `message` run on Node. Never run `deno check` in them.
- **Node Version Policy**: every Node workspace targets the latest Node.js **LTS** release, currently Node 24 ("Krypton"). Node 26 and other Current or EOL lines are out of policy. Each Node workspace declares `"engines": { "node": ">=24" }`, and `@types/node` is pinned to the matching `24.x` line so the types reflect the oldest supported runtime rather than whatever happens to be installed. Do not bump Node majors until a newer line reaches LTS; when one does, update `engines` and `@types/node` together across `dvibd/gui`, `social`, `message`, and `orm`.
- **This policy does not apply to `dvibd/api`.** It runs on Deno and is governed by `dvibd/api/deno.json`, not by Node `engines`. Never add `engines` or `@types/node` there, and do not type-check it with `tsc`.
- **TypeScript Version Policy**: TypeScript has no LTS concept, so every Node workspace tracks the latest release, currently `^7.0.2`. Keep it aligned across all of them.

### Typecheck Matrix

| Workspace | Runtime | Command |
| --- | --- | --- |
| `dvibd/api` | Deno | `cd dvibd/api && deno check src/main.ts` |
| `dvibd/gui` | Node / Vite | `cd dvibd/gui && npx tsc -b` |
| `social` | Node / SolidStart | `cd social && npx tsc --noEmit` |
| `message` | Node / Next.js | `cd message && npx tsc --noEmit` |

## GUI Standards
1. Use a CSS Module (never plain CSS except `globals.css` / `index.css` / `app.css`) imported as `style` in the TSX file.
2. CSS Modules scope id selectors too. Always bind the module as `style` and reference elements through it (`id={style.navBar}` for a selector `nav#navBar`). Never use a raw unhashed id (`id="navBar"`), and never import a module only for side effects.
3. Selectors are fully nested: `tag#id` (or `tag.class`) with immediate child `>` by default; target descendants only when needed (e.g. `div#app { ... }` and never `#app { ... }`).
4. Never use class for styling; use id. Classes only for style variants.
5. Every time you make a component or a page, its most ancestor / root element must be the semantic HTML container element (`<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<aside>`, `<article>`, `<form>`, etc.) that best represents and describes its content. If none can be chosen out of the semantic HTML container elements, `<div>` may be used.
6. Element ids and classes are camelCase, taken from the component's CSS Module.
7. Sizing, dimension, and spacing units must always use `%` so elements are proportional to their parent. Use `rem` for font-sizes, media-query breakpoints, gaps, borders, shadows, and blur. Use `px` only for `border-radius`.
8. Never use `<>`/`</>` fragments or SolidJS/React `<Fragment>`.
9. Do not put the title in the logo unless explicitly told.
10. You do not have to run `npm run build` to check if it builds correctly during active development.
11. Global Selectors: Since ids are scoped by modules, `:global(...)` is required for global or router active selectors: `&:global(.active)`.
12. File Mirroring: TSX components and routes mirror their CSS Modules under `src/styles/` (or co-located `page.module.css` where configured).

## Framework Idiomatic Principles (Complete Compliance Required)
Every application must be written strictly idiomatic to its underlying framework across all layers (components, reactivity, routing, data fetching, mutations, cookies, and server/client boundaries):

### SolidJS Core (`social` and `dvibd/gui`)
- **Fine-Grained Reactivity**: Use `createSignal`, `createMemo`, `createEffect`, `onMount`, `onCleanup`.
- **Never Destructure Props**: Prop destructuring breaks Solid reactivity. Access props directly as `props.propName` or use `splitProps` / `mergeProps`.
- **Control Flow Components**: Use built-in Solid flow primitives: `<Show when={...} fallback={...}>` (never JSX `&&` / `||`), `<For each={...}>` for reactive list rendering (never array `.map()`), `<Index each={...}>` for primitive item lists, and `<Switch>`/`<Match>` for multi-condition branching.
- **Routing & Links**: Use `@solidjs/router` components (`<A>`, `<Navigate>`, `useNavigate`, `useLocation`, `useParams`, `useSearchParams`). `social` uses file-based routes; `dvibd/gui` wires `Router` and `Route` declaratively in `src/uis/index.tsx`.

### SolidStart (`social` only)
`dvibd/gui` is not SolidStart and has no server runtime, so everything in this subsection applies to `social` alone.
- **Data & Mutations**: Use SolidStart `query`, `createAsync`, `cache`, and `action` / `<Form>`.
- **Server Boundaries & Cookies**: Server functions use `"use server"`. Never import server-only packages into client-bundled files. Access request events via `getRequestEvent()` and manage cookies via `h3` (`getCookie`, `setCookie`, `deleteCookie`).
- **Metadata**: Use `@solidjs/meta` (`<Title>`, `<Meta>`).

### Next.js App Router & React 19 (`message`)
- **React Server Components (RSC) by Default**: All components, layouts, and pages under `src/app/` are Server Components by default. Keep data access on the server.
- **Client Components Directive**: Add `"use client"` only at the top of leaf files requiring browser APIs, hooks (`useState`, `useEffect`, `useRef`), or interactive event listeners (`onClick`, `onChange`, `onSubmit`).
- **JSX Conditional Rendering**: Use ternary expressions (`condition ? <El /> : null`) or explicit branch returns. Never use `&&` or `||` in JSX to prevent falsy DOM rendering.
- **Routing & Special Files**: Adhere strictly to App Router conventions (`layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`). Use `next/link` (`<Link>`), `useRouter`, `usePathname`, `useSearchParams`, `redirect()`, and `notFound()` from `next/navigation`.
- **Data Fetching & Streaming**: Async/await data fetching directly in Server Components wrapped with `<Suspense fallback={<Skeleton />}>` for streaming.
- **Mutations & Server Actions**: Use Server Actions (`"use server"`) for mutations, form handling with `useActionState`, `useFormStatus`, `useOptimistic`, and `revalidatePath` / `revalidateTag`.
- **Route Handlers & Cookies**: Route Handlers in `src/app/**/route.ts` exporting standard named HTTP method handlers (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`). Access cookies via `cookies()` from `next/headers` (`await cookies()`) and headers via `headers()`.
- **Middleware**: Use Next.js `src/middleware.ts` with `NextRequest` and `NextResponse`.
- **Metadata**: Export static `metadata: Metadata` or dynamic `generateMetadata()` from `layout.tsx` and `page.tsx`.

## API & Endpoint Standards
- Above every endpoint, write the URL preceded with the request verb (e.g. `POST /auth/signup`, `POST /conversations`).
- Keep APIs idiomatic to their respective framework and runtime.

## ORM & DB Standards

### Schema & Clients
- `orm/prisma/schema.prisma` is the single source of truth for the database schema. The apps are clients of this ORM and do not define their own schema.
- Keep every generator block intact when editing the schema: `api-client` (outputs to `../../dvibd/api/src/generated`), `gui-client` (outputs to `../../dvibd/gui/src/generated`), and `social-client` (outputs to `../../social/src/server/generated`).
- Whenever the schema is modified, regenerate all client packages from `orm/`:
  ```bash
  cd orm && npm run generate
  ```
- After regenerating, verify the client consumers typecheck: `cd dvibd/api && deno check src/main.ts` and `cd social && npx tsc --noEmit`.

### Migrations
- Migrations live under `orm/prisma/migrations/`.
- Create and apply a migration during local development from `orm/`:
  ```bash
  cd orm && npx prisma migrate dev --name <migration_name>
  ```
- Apply pending migrations to a hosted database with `cd orm && npm run migrate:deploy`. Use that, never `migrate dev`, against anything other than local `db/`.

### Database Service
- The local Postgres service is managed via `db/docker-compose.yml`. Start, stop, log, and health-check commands live in `db/AGENTS.md`.
- Never point OpenCode at a new or scaffolded Prisma project. This repository already owns its schema and clients; work only through the `orm/` scripts above.

### Deployment (Netlify)
Netlify hosts `social` and `message` with their own backends, plus the `dvibd/gui` SPA. `dvibd/api` is not deployed to Netlify. Each app is its own Netlify project with its own `netlify.toml` beside its `package.json`, and the site's base directory must be that app directory. There is no root `package.json`, so run Netlify CLI commands from inside an app directory rather than the repository root.

- `message` publishes `.next`. Netlify injects its Next.js runtime automatically, so `@netlify/plugin-nextjs` must not be added to `package.json`.
- `social` publishes `dist`, not `dist/client`, because it builds through `nitro/vite`. Nitro detects the Netlify build environment and emits the catch-all function to `.netlify/functions-internal/server/server.mjs`. Do not add `@netlify/vite-plugin` to that app, since that path produces the `dist/client` layout instead.
- `dvibd/gui` publishes `dist` and needs the SPA redirect, because its routing is declarative and client-side.
- Every app's build command runs `prisma generate` from `orm/` first, since each generated client directory is gitignored and absent from a fresh clone. `npm --prefix` is what reaches the sibling directory; the prefix differs per app because the base directory differs.
- `NODE_VERSION` is pinned to `24` in each `[build.environment]`, per the Node version policy above. Netlify derives the functions runtime from the build version.
- Production database is Supabase, reached through the **Supavisor session pooler**, never the direct connection string. Netlify functions run in IPv4-only AWS environments, and each warm function instance opens its own `pg` pool against a hard connection cap, so a pooled URL is required.
- Secrets live only in Netlify's environment, set with `netlify env:set --context production --secret`. Never commit them; `*.env` is gitignored.

### Prisma Skills
`skills-lock.json` at the repository root is the tracked source of truth and pins all twenty-one third-party skills. Those twenty-one are gitignored because they are regenerable. A twenty-second skill, `sticky-scroll-headers`, is hand-written and tracked in git instead, so it survives `git clean -xfd` on its own.

Before any Prisma schema, migration, client, or query work, run this from the repository root:

```bash
npx --yes skills@1.5.14 experimental_install
```

Run it unconditionally. It is idempotent and self-healing: it restores every skill from `skills-lock.json` when the directory is absent (fresh clone, clean checkout, `git clean -xfd`), and does nothing harmful when they are already present. Do not pre-check whether the directory exists; do not run `skills add`, `prisma init`, or scaffold a Prisma project to obtain them.

All twenty-one live in the repository-level `.agents/skills/` directory and are discovered in every session, regardless of which app you are working on. Nothing is scoped to a single app directory, because skill discovery is resolved from the working directory and this repository is always worked on from its root. The table below therefore records **which frameworks each skill is valid for**, not which folder it lives in. A future app that adopts one of these frameworks picks the matching skills up automatically, with no reinstall.

| Skill | Source | Valid for |
| --- | --- | --- |
| `api-and-interface-design` | `addyosmani/agent-skills` | any app, any framework |
| the ten `prisma-*` skills | `prisma/skills` | any app using Prisma |
| `vercel-react-best-practices` | `vercel-labs/agent-skills` | React and Next.js apps |
| `vercel-composition-patterns` | `vercel-labs/agent-skills` | React and Next.js apps |
| `web-design-guidelines` | `vercel-labs/agent-skills` | any web UI, with React-specific notes |
| `nextjs-app-router-patterns` | `wshobson/agents` | Next.js App Router apps |
| `frontend-design` | `anthropics/skills` | any web UI |
| `glassmorphism` | `iart-ai/web-animation-skills` | any web UI, opt-in per task |
| the four `netlify-*` skills | `netlify/context-and-tools` | Netlify deploys, per app |

`frontend-design` is framework agnostic and needs no translation. It supplies aesthetic direction, typography, and copy guidance, plus a two-pass design plan step and a list of machine-generated design habits to avoid. Its quality floor (visible keyboard focus, `prefers-reduced-motion`, accessibility) agrees with `web-design-guidelines`.

`glassmorphism` is opt-in and applies only when glass or frosted surfaces are actually requested. It is real CSS technique content, not a design template, and it includes the accessibility fallbacks glass work needs (`prefers-reduced-transparency`, `prefers-reduced-motion`, `@supports not (backdrop-filter)`). Translate every `px` length to `rem` per GUI standard 7, and ignore its standalone single-file HTML deliverable in favour of this repository's mirrored structure. See the next section on precedence.

`message` is currently the only React and Next.js app, so the four React and Next.js skills apply to it today and to any future app built on those frameworks. Do **not** apply them to `dvibd/gui` or `social`, which are SolidJS: that is a framework mismatch, not a directory boundary. `nextjs-app-router-patterns` covers route handlers, Server Components, streaming, and parallel routes, which `message` now has and should be used there as it grows.

`web-design-guidelines` is framework agnostic in its platform-level rules (ARIA, focus states, `prefers-reduced-motion`, `Intl.*`, semantic HTML) and is useful for `dvibd/gui` and `social` too. Only its React-specific sections and its Tailwind class syntax do not translate to SolidJS and CSS Modules. See `dvibd/AGENTS.md` and `social/AGENTS.md` for those notes.

`api-and-interface-design` applies to every endpoint and module boundary here: `dvibd/api`, the `social` endpoints, and the `message` endpoints. One caution: it recommends branded types for IDs, while this repository currently types IDs as plain `string`, so treat that as a deliberate change rather than a silent one.

The four `netlify-*` skills are the official ones from `netlify/context-and-tools`, and they apply to `social`, `message`, and `dvibd/gui` as deployment guidance. Read them alongside the Deployment section above, not instead of it. Three conflicts to resolve in favour of this file:
- **Node version**: the skills may suggest a Node major that is not the current LTS. The Node version policy above wins, so `[build.environment] NODE_VERSION` stays `"24"`.
- **`.env` and secrets**: the skills assume env vars live in the Netlify UI or `netlify env:set`. Keep using `env:set` with `--secret`; a committed `netlify.toml` must never carry a real value. The skills also advise never disabling secret scanning to silence a failure; if a deploy trips secrets scanning, treat the flagged value as a real leak and rotate it.
- **Monorepo shape**: the skills assume one project per repository. This repository has three, each with its own base directory, and CLI commands must run from inside an app directory. Where a skill says "run from the repository root", that is wrong here.

### Skills Are Advisory; These Standards Are Mandatory
The skills listed above are third-party guidance. **This file is the authoritative source of standards for this repository and always wins.** Where a skill disagrees with anything in this file, follow this file and note the deviation rather than silently complying with the skill.

The specific conflicts to resolve in favour of this file:
- **Units**: GUI standard 7 overrides any skill value in `px`. Convert `px` lengths to `rem`, or to `%` for element dimensions and spacing. `px` stays legal only for `border-radius`.
- **Styling mechanism**: GUI standards 1 through 4 and 11 override any skill that reaches for Tailwind utility classes, inline styles, or standalone CSS files. Use a CSS Module imported as `style`, select by hashed id, and use classes only for style variants.
- **File structure**: GUI standard 12 overrides any skill that proposes a different layout, including the `glassmorphism` skill's standalone single-file HTML demo. Deliverable structure is mirrored TSX and CSS Modules under this repository's conventions.
- **Comments**: Cross-Cutting standard 3 overrides any skill whose examples annotate code. Do not add comments unless explicitly asked.
- **Em dashes**: Cross-Cutting standard 4 overrides any skill. In particular `frontend-design` flags a spaced em dash in labels as a sign of generated output, which aligns with this standard rather than competing with it.
- **Framework**: never apply React or Next.js skills to the SolidJS apps, and never apply SolidJS guidance to `message`.

Skills remain valuable for what this file does not cover: aesthetic direction, accessibility detail, and framework idioms that are already consistent with these standards.

### Hand-Written Skills
`sticky-scroll-headers` covers headers that scroll with their content and pin to the top of their scrollport. It documents the working implementations in `social/src/components/(home)/FeedHeader.tsx` (SolidJS, viewport scroller) and `message/src/hooks/useStuckScroll.ts` (React, per-column scroller), plus the failure modes that produce each distinct wrong behavior. It applies to `message` and `social`.

Unlike the twenty-one above, this skill is tracked in git because it cannot be regenerated. `.gitignore` ignores `.agents/skills/*` and re-includes this one directory. When adding another hand-written skill, add a matching `!.agents/skills/<name>/` line there and record it in this section. Do not add hand-written skills to `skills-lock.json`, which pins upstream GitHub sources and is used to restore the regenerable set.

## Workspace Memory
This section holds persistent memory, learned rules, and calibration contexts across the `dvibd` repository.

### Viewport Percentage Calibration
- When converting px to %, the user's browser viewport is the primary reference so sizing cascades proportionally to descendants (percentage sizing is relative to parent).
- Calibrate the % value so it corresponds to the pixel size relative to the target viewport:
  - **1440px Desktop Viewport**:
    - `120px` -> `8.3%`
    - `56px` -> `3.9%`
    - `48px` -> `3.3%`
    - `40px` -> `2.8%`
    - `24px` (`--space`) -> `1.7%` (widened to `6%` so page content does not hug viewport edges)
    - `1100px` (`--width`) -> `76.5%`
    - `16px` fixed toggle top -> `1.8%` of viewport height
  - **760px Mobile Viewport**:
    - `64px` -> `8.4%`
- For the units policy itself, see GUI standard 7 above.

### Env Resolution Policy (implemented)
Every module that reads env through a defaults fallback (`social/src/server/config.ts`, `message/src/server/config.ts`, `orm/prisma.config.ts`) resolves in this order:
1. `process.env`, when the variable is set.
2. Throw, when a `.env` file exists but the variable is not in it.
3. Throw, when `NODE_ENV` is exactly `production`.
4. The checked-in dev default, for local development only.

**Why `process.env` comes first.** The dev servers load `.env` into `process.env` themselves (Next, Vite, and Nitro each do this), so reading `process.env` covers local `.env` files too. Netlify has no `.env` file and injects site variables into both builds and function runtimes, so a `process.env`-first order is the only one where deployed values are actually honoured. The previous order tested file presence first and returned the defaults without consulting `process.env` at all, so a Netlify deploy silently ran on `postgresql://dvibd:dvibd@localhost:3001/dvibd` and signed tokens with the public `message-dev-secret-change-me` / `social-dev-secret-change-me` secrets.

**Consequence for builds.** `next build` evaluates route handler modules, so a local production build with no `.env` and no exported variables now fails during page-data collection. That is intended: on Netlify the variables are present at build time. To build locally, provide a `.env` file.

### Monorepo Context Memory
- **Self-Contained Backend Ecosystems**: Both `social` and `message` maintain independent self-contained backends with their own auth routes, session tokens, and middleware. They never proxy or relay through `dvibd/api`.
- **Database Centralization**: All apps share the single PostgreSQL instance in `db/` and derive their Prisma clients from `orm/prisma/schema.prisma`.
- **App Boundary**: The `social` app left navigation intentionally omits messages because all messaging functionality lives in the standalone `message` app.