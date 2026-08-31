# `social` Project Rules

## GUI
1. Use a CSS Module and never CSS (except `index.css` / `app.css`) for a component/page's corresponding styling file imported as `style` in its TypeScriptXML file.
   - CSS Modules (Lightning CSS in Vite) scope id selectors too, not just classes. Always bind the module as `style` and reference elements through it: `id={style.navBar}` for a selector written `nav#navBar`. Never use a raw `id="navBar"` for an element styled by a module (the hashed id will not match), and never import a module side-effect only (`import "./x.module.css"`) when its members could be used. Import it as `style` and use `style.xxx`, matching the `tag#xxx` selectors in the module.
2. Styling files should be written fully nested with its selector indicating the element's tag name and id/class with an immediate child selector (`>`) by default unless descendants are targeted by the style. For example: `div#app { ... }` and never `#app { ... }`.
3. Never use class for styling. Use id instead. Classes can be used if an element/component/page has style variants.
4. Every time you make a component or a page, its most ancestor element should be an HTML container semantic tag that best represents its content. If none can be chosen out of the semantic HTML container elements, `<div>` may be used.
5. Ids and classes of elements should be in camelCase from its component/page's corresponding CSS Module.
6. Always `%` for sizing, dimension, or spacing units so that it is proportional to its parent element. You can only use `rem` for font-sizes and media-query breakpoints. Except for `border-radius`, in which you are allowed to use `px`.
7. Never use `<>`/`</>` or SolidJS `<Fragment>`.
8. You do not have to run `npm run build` to check if it builds correctly because during development the user actively monitors development mode.
9. Do not put the title in the logo when designing unless explicitly told.
10. GUI code writing has to be completely SolidStart idiomatic. For example, use `<Show>` instead of TSX `&&` or `||` for conditional rendering of elements.
11. Since ids are scoped by modules, `:global(...)` is still required for global selectors like the router's `.active` class on links: `&:global(.active)`.
12. `src/routes/` and `src/styles/pages` mirror each other: every page under `routes/` has a parallel CSS Module under `styles/pages/` in the same relative path (e.g. `src/routes/(home)/notifications.tsx` <-> `src/styles/pages/(home)/notifications.module.css`).
13. `src/components/` and `src/styles/components` mirror each other: every component under `components/` has a parallel CSS Module under `styles/components/` in the same relative path (e.g. `src/components/(home)/FeedTabs.tsx` <-> `src/styles/components/(home)/FeedTabs.module.css`).

## API
1. Every time you write an endpoint, above it should be the URL preceded with the request verb. For example: `POST /auth/signup`.
2. API code writing has to be completely SolidStart idiomatic. For example, not using `localStorage` since SolidStart has its own `getCookie`, `setCookie`, or `deleteCookie` from `h3`.

## Coding
1. If text is to be enclosed in quotes, you must use double quotes (`"`).
2. `social` runtime is Node, not Deno. Never use `deno check` for type checking the social app; use Node's typecheck instead (`npx tsc --noEmit` in the social directory).
3. Write fully-typed TypeScript and TypeScriptXML code. No variable declared or initialized without an explicit type. No function without an explicit return type.

## Writing
1. Refrain from using the em dash.

## Social App Notes

### Auth Architecture
- `social` is a self-contained backend ecosystem: it never proxies or relays to `api/`. It shares only `orm/` (Prisma schema, generated client at `src/server/generated`, extension `mts`) and `db/` (Postgres).
- Auth HTTP routes live directly in `src/routes/(auth)/` with no `/api` prefix. Page files (`login.tsx`, `signup.tsx`) must stay client-safe: their verb handlers live in the route group `(auth)/(endpoints)/` (e.g. `(endpoints)/login.ts` exports `POST /login`; group parens are stripped from the URL). Never import server-only modules (`bcrypt`, `prisma`, `pg`, `h3`) into a file with a default page component; Vite dev loads the whole graph in the browser. Pure API route files (`session.ts`, `refresh.ts`, `logout.ts`, `me.ts`) have no component and are safe. Endpoints: `POST /login`, `POST /signup`, `GET /session`, `POST /refresh`, `POST /logout`, `GET /me`.
- Session strategy: refresh token (30 days) in httpOnly cookie `social.session`; access token (15 min) returned in the response body and kept in client memory. Every `GET /session` rotates the refresh token (old row deleted, new issued).
- `src/middleware.ts` verifies the cookie into `locals.loggedIn` and guards `/notifications`, `/bookmarks`, `/settings`, `/profile` (redirect `/login`) and redirects authed users off `/login` and `/signup`.
- Password hashing uses native `bcrypt`. Server modules: `config.ts` (env policy), `db.ts` (Prisma singleton), `tokens.ts`, `session.ts`, `user.ts` (`SafeUser`, `USER_SELECT`); `auth.ts` is the `"use server"` facade (`fetchSession`) so SSR renders correct auth state.

### Home Page Layout
The home page is composed of 3 vertical divisions:
- **Left division**: `nav#sideNav`, referred to as the side nav. A compact fit-content navigation sidebar containing only icons (plus the user's profile picture) that redirect the user when clicked.
- **Center division**: `main#feed`, referred to as the feed. Shows stat and article overviews:
  - Stat: a microblog of no more than 256 characters.
  - Article: longer writing with a title, headings, and text.
- **Right division**: `aside#explore`, referred to as Explore. Contains a search bar and the sections trending, users, community, and legal.

The divisions sit in `div#homeLayout`, laid out as a grid of fit-content, the feed, and the Explore rail.

### Left Nav Icon Set
Icons (no messages, dvibd has a separate Message app): Home, Explore, Notifications, Bookmarks, Profile, Settings. The sidebar also contains the user's profile picture. Placeholder pages for each icon's route live under `routes/(pages)/(home)/`.

### Viewport Percentage Calibration
- When converting px to %, the user's browser viewport is the reference so it cascades to descendants (percentage sizing is relative to parent). Calibrate the % so the value corresponds to the px size relative to the viewport: e.g. 120px -> 8.3% of ~1440px viewport, 64px -> 8.4% of ~760px mobile viewport, 24px -> 1.7%, 48px -> 3.3%, 40px -> 2.8%, 56px -> 3.9%, `--space` 24px -> 1.7% (widened to 6% so page content does not hug viewport edges), `--width` 1100px -> 76.5%, fixed toggle top 16px -> 1.8% of viewport height. Media-query breakpoints (e.g. 760px) are okay as rem (47.5rem). Gaps/borders/shadows/blur retain rem; font-sizes use rem; border-radius uses px.
- Forbidden to use px except for border-radius.
