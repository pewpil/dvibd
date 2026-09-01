# `dvibd` Project Instructions

This file is the authoritative source of repository-wide standards that must be complied with. App-specific contexts live in `.agents/rules/dvibd.md` (`dvibd` gui/api), `.agents/rules/social.md` (`social`), `.agents/rules/message.md` (`message`), `.agents/rules/orm.md` (shared ORM), and `.agents/rules/db.md` (database service).

## Repository Layout
- `dvibd/`: the main gui + api workspace (Deno API, workerd/Vite GUI).
- `social/`: a standalone SolidStart app (self-contained backend, Node runtime).
- `message/`: a standalone Next.js App Router app (self-contained backend, Node runtime).
- `orm/`: shared Prisma schema, migrations, and generated clients (package `@dvibd/orm`). Individual apps are clients of this ORM and do not define their own schema.
- `db/`: local test Postgres service via docker-compose.
- `.agents/`: agent configuration, rules, and skills.

## Cross-Cutting Coding Standards
1. Use double quotes (`"`) for any string literal, never single quotes.
2. Write fully-typed TypeScript and TypeScriptXML code. Every variable, parameter, and function must have an explicit type (including return types).
3. Do not add code comments unless explicitly requested.
4. Refrain from using the em dash in any written output or content.
5. Never commit secrets or API keys.
6. Before editing a file, follow its existing conventions (naming, framework idioms, lint/fmt config). Mimic neighboring code.

## Runtime & Typecheck Standards (Deno vs Node)
- `dvibd/api` runtime is Deno. Respect `compilerOptions`, `fmt`, and `lint` in its `deno.json`. Type check with `deno check src/main.ts`.
- `dvibd/gui`, `social`, and `message` run on Node. Never run `deno check` in them; type check with TypeScript in their respective directories (`npx tsc --noEmit` or `npx tsc -b`).

## GUI Standards
1. **CSS Modules**: Use a CSS Module (never plain CSS except `globals.css` / `index.css` / `app.css`) imported as `style` in the TSX file.
2. **Module ID Scoping**: CSS Modules scope id selectors too. Always bind the module as `style` and reference elements through it: `id={style.navBar}` for a selector written `nav#navBar`. Never use raw unhashed ids (`id="navBar"`), and never import a module solely for side effects.
3. **Selector Nesting**: Write styling files fully nested with the selector indicating tag name and id/class with an immediate child selector (`>`) by default (e.g. `div#app { ... }` and never `#app { ... }`). Target descendants without `>` only when necessary.
4. **IDs for Styling**: Never use `class` for styling. Use `id` instead. `class` is permitted only for style variants.
5. **Semantic Containers**: The outermost/ancestor element of every component or page must be an appropriate semantic HTML container tag. Use `<div>` only if no semantic container applies.
6. **Naming**: Element ids and classes must be camelCase, matching selectors in the CSS Module.
7. **Units & Proportions**: Always use `%` for sizing, dimension, and spacing units so elements are proportional to their parent. Use `rem` for font-sizes and media queries. Use `px` only for `border-radius`.
8. **Fragments Disallowed**: Never use `<>`/`</>` or framework `<Fragment>` components.
9. **Active Dev Builds**: You do not have to run `npm run build` to check if it builds correctly during active development.
10. **Logo Design**: Do not put the title in the logo when designing unless explicitly told.
11. **Global Selectors**: Use `:global(...)` within CSS Modules for global or router states (e.g. `&:global(.active)`).
12. **File Mirroring**: TSX files and their CSS Modules mirror each other in matching directory structures under `src/styles/` (or co-located `page.module.css` / `layout.module.css` where configured).

## Framework Idiomatic Principles (Complete Compliance Required)
Every application must be written strictly idiomatic to its underlying framework across all layers (components, reactivity, routing, data fetching, mutations, cookies, and server/client boundaries):

### SolidStart & SolidJS (`social` and `dvibd/gui`)
- **Fine-Grained Reactivity**: Use `createSignal`, `createMemo`, `createEffect`, `onMount`, `onCleanup`.
- **Never Destructure Props**: Prop destructuring breaks Solid reactivity. Access props directly as `props.propName` or use `splitProps` / `mergeProps`.
- **Control Flow Components**: Use built-in Solid flow primitives: `<Show when={...} fallback={...}>` (never JSX `&&` / `||`), `<For each={...}>` for reactive list rendering (never array `.map()`), `<Index each={...}>` for primitive item lists, and `<Switch>`/`<Match>` for multi-condition branching.
- **Routing & Links**: Use `@solidjs/router` components (`<A>`, `<Navigate>`, `useNavigate`, `useLocation`, `useParams`, `useSearchParams`).
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
- Above every endpoint handler, document the route with its HTTP verb and URL (e.g. `POST /auth/signup` or `POST /conversations`).
- Keep APIs idiomatic to their respective framework and runtime.

## ORM & DB Standards
- `orm/prisma/schema.prisma` is the single source of truth for the database schema.
- Whenever the schema is modified, regenerate clients from `orm/` (`npm run generate`).
- Run database migrations from `orm/` (`npx prisma migrate dev`).
- Manage the local Postgres service via `db/docker-compose.yml`.
