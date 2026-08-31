# `dvibd` Project Instructions

This file is the authoritative source of standards that must be followed when working in this repository. App-specific conventions live in `.agents/rules/dvibd.md` (the `dvibd` gui/api), `.agents/rules/social.md` (the `social` app), `.agents/rules/message.md` (the `message` app), `.agents/rules/orm.md` (shared ORM), and `.agents/rules/db.md` (database service).

## Repository layout
- `dvibd/`: the main gui + api workspace.
- `social/`: a standalone SolidStart app (self-contained backend, Node runtime).
- `message/`: a standalone messaging app workspace.
- `orm/`: shared Prisma schema, migrations, and generated clients (package `@dvibd/orm`). The apps are clients of this ORM; they do not define their own schema.
- `db/`: local test Postgres via docker-compose (see `.agents/rules/db.md`).
- `.agents/`: agent configuration, rules, and skills.

## Cross-cutting coding standards (always apply)
1. Use double quotes (`"`) for any string literal, never single quotes.
2. Write fully-typed TypeScript/TypeScriptXML. No variable or function may be declared without an explicit type (return types included).
3. Do not add code comments unless explicitly asked.
4. Refrain from using the em dash in any written output or content.
5. Never commit secrets or API keys.
6. Before editing a file, follow its existing conventions (naming, framework idioms, lint/fmt config). Mimic neighboring code.

## Deno vs Node
- The `dvibd` api workspace is Deno. Respect `compilerOptions`, `fmt`, and `lint` in its `deno.json`.
- The `social` and `message` apps run on Node. Never run `deno check` in them; type check with `npx tsc --noEmit` in their respective directories.

## GUI standards (apply to `dvibd`, `social`, and `message` frontends)
1. Use a CSS Module (never plain CSS except `index.css`) imported as `style` in the TSX file.
2. CSS Modules scope id selectors too. Bind the module as `style` and reference elements through it (`id={style.navBar}` for a selector `nav#navBar`). Never use a raw `id="navBar"` on a module-styled element, and never import a module only for side effects.
3. Selectors are fully nested: `tag#id` (or `tag.class`) with immediate child `>` by default; target descendants only when needed.
4. Never use class for styling; use id. Classes only for style variants.
5. The ancestor element of any component/page must be the most appropriate semantic HTML container; use `<div>` only if none fits.
6. Element ids/classes are camelCase, taken from the component's CSS Module.
7. Sizing/dimension/spacing use `%` (proportional to parent). `rem` only for font-sizes and media queries. `px` only for `border-radius`.
8. Never use `<>`/`</>` fragments or SolidJS `<Fragment>`.
9. Write idiomatic SolidJS/SolidStart (or ReactJS/NextJS for `message`): use `<Show>` instead of `&&`/`||` for conditional rendering; use `getCookie`/`setCookie`/`deleteCookie` from `h3` rather than `localStorage`.
10. Do not put the title in the logo unless explicitly told.
11. You do not have to run `npm run build` to check if it builds correctly during active development.

## API/endpoint standards
- Above every endpoint, write the URL with its HTTP verb (e.g. `POST /auth/signup`).

## ORM
- `orm/` is the single source of truth. After editing `prisma/schema.prisma`, regenerate clients from `orm/` (`npm run generate`). Generated output is gitignored in each app.
- `social` consumes the generated client; keep its generator entry in `schema.prisma` so `prisma generate` produces `social/src/server/generated`.

## Auth (social)
- Self-contained backend; never proxy to `api/`. Routes live in `src/routes/(auth)/`; page files must stay client-safe (verb handlers go in `(auth)/(endpoints)/`). Never import server-only modules (bcrypt, prisma, pg, h3) into a file with a default page component.
- Session: refresh token (30 days) in httpOnly cookie `social.session`; access token (15 min) in the response body. `GET /session` rotates the refresh token.

## Writing
- Keep prose clear and direct. Do not use the em dash.
