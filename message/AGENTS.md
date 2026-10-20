# `message` Project Context

This file contains context specific to the `message` application. Repository-wide standards and instructions live in the repository root `AGENTS.md`.

## Application Overview
- **Framework & Runtime**: Next.js 16 (App Router, React 19), running on Node. Type check with `npx tsc --noEmit` or `npm run typecheck` from `message/`.
- **Dev Port**: `3005`, set in the `dev` and `start` scripts (`next dev -p 3005`).
- **App icon**: `public/icon.svg` is the sky-blue speech bubble taken from `dvibd/gui/src/assets/components/dvibd/home/landing/product/message.svg`. `layout.tsx` serves the browser tab through `metadata.icons`, and the login and signup pages render the same file inside `Link#authBrand` (`img#authBrandIcon`, `2rem` square), so the pages match the tab.
- **Root Layout**: `src/app/layout.tsx` is a Server Component. It exports `metadata` (`title: "Message"`, `description: "dvibd messaging"`) and renders `<html lang="en">`, `<body>`, and a `<div id="app">` wrapper that wraps children in `AuthProvider`.
- **Auth**: this app has its own backend and shares only `orm/` (Prisma) and `db/` (Postgres) with the rest of the repository. It never proxies through `dvibd/api/`.

## Auth Architecture
- `src/proxy.ts` is the route guard (**not** `middleware.ts`; Next.js 16 renamed the convention, and the edge runtime is unavailable in `proxy`). Netlify compiles it into an Edge Function, so it verifies the session cookie's signature and expiry through `verifyRefreshToken` and never touches the database: the middleware module graph must stay free of `db.ts` and the generated client, or the edge bundling either carries `pg` into the Deno runtime or fails nondeterministically while evaluating it. Database-backed revocation is enforced by the Route Handlers instead (`/api/session` answers with `user: null`, driving the client-side redirect). It redirects anonymous visitors to `/login` with a `?from=` hint, bounces authenticated visitors away from `/login` and `/signup`, and excludes `/api/*` plus static assets.
- Route Handlers live under `src/app/(auth)/api/<name>/route.ts`. Only `(auth)` is a route group and is stripped from the URL; `api/` is a real path segment and **is** part of it, so these resolve to `/api/login` and friends.
- Endpoints: `POST /api/login`, `POST /api/signup`, `GET /api/session`, `POST /api/logout`.
- **Pages and route handlers cannot share a URL**, even when their HTTP methods differ. `(auth)/login/page.tsx` and `(auth)/(endpoints)/login/route.ts` would both resolve to `/login` and the build fails with "Conflicting page and route". That is why the handlers sit under a plain `api/` folder rather than a parenthesized `(api)` group the way `social` uses. Do not "fix" this by renaming `api/` to `(api)`.
- Server modules are in `src/server/`: `config.ts` (zod-validated env; the local scripts export `LOCAL_ENV=1`, so localhost runs lock to the dev defaults and ignore the environment, per the root `AGENTS.md` env policy), `db.ts` (Prisma client with a dev-mode global singleton), `jwt.ts` (edge-safe JWS issue/verify and cookie constants; imports only `jose` and `config`), `tokens.ts` (DB-backed refresh-token records and rotation; re-exports the `jwt.ts` surface for the Route Handlers), `session.ts` (`readSession`), `user.ts` (`SafeUser`, `USER_SELECT`), `auth.ts` (`server-only` facade).
- Session strategy: refresh token (30 days) in the httpOnly cookie `message.session`; access token (15 min) returned in the response body and kept in client memory.
- `src/contexts/AuthContext.tsx` is the client provider. Page files must stay client-safe: never import `src/server/*` into a Client Component. Route Handlers may.
- Password hashing uses native `bcrypt`. `tsconfig.json` sets `allowImportingTsExtensions` so the generated `.mts` client can be imported.
- The ORM generator for this app is `message-client`, outputting `src/server/generated` (gitignored). Regenerate with `cd orm && npm run generate`.

## Deployment
`netlify.toml` sits beside `package.json`, so the Netlify base directory is `message`. It publishes `.next` and relies on Netlify injecting its Next.js runtime automatically, so `@netlify/plugin-nextjs` must not be added to `package.json`. The build command runs `npm --prefix ../orm ci && npm run generate` first, because `src/server/generated` is gitignored and missing from a fresh clone. Its masked-`DATABASE_URL` guard deviates from the other apps: where they unset the variable and fall through to `orm/.env`, this command exports a build-only placeholder URL. The real value is unnecessary at build time because nothing connects, and `config.ts` reads `process.env[name]` dynamically, so no value is ever inlined into bundles. After `next build` the command rewrites `.next/standalone/.env` to the dev defaults, because the runtime plugin unconditionally requires that file when creating the edge handler, while a copied-through one would carry the machine's real `DATABASE_URL` into the shipped artifact. The rewrite also removes any need for a local `.env` file: `next dev` resolves everything through the `config.ts` defaults, and `message/.env` should not exist. A local `netlify deploy --prod` must additionally run with placeholder `DATABASE_URL` and `JWT_SECRET` exported in the invoking shell, because the edge-bundling step evaluates the middleware graph in a process that inherits the CLI's environment rather than the build command's shell, and the site-injected values there are unusable masked strings. On Netlify-hosted builds none of this fires, since injected values are unmasked and real.

Netlify reports `src/proxy.ts` as `ƒ Proxy (Middleware)` and runs it as an Edge Function, which is the one runtime here that is not Node. This is verified deployed on `message-dvibd`: the edge bundle is built from `jwt.ts` and carries no `pg` or generated client, and the anonymous, authenticated, and revoked-cookie paths were each exercised against the live site.

## Current Implementation State
- `src/app/page.tsx` is the message layout. It is a Client Component (`"use client"`) named `MessagePage`, and is the only unguarded page.
- `src/app/(auth)/login/page.tsx` and `src/app/(auth)/signup/page.tsx` are the auth pages. Both are Client Components. The login page wraps its form in `<Suspense>` because it reads `useSearchParams`, which Next.js 16 requires for static prerendering.
- `src/app/(auth)/api/` holds the four Route Handlers listed under Auth Architecture.
- There is no `src/middleware.ts`. The guard is `src/proxy.ts`.
- `src/components/` holds six components, all flat, with no subdirectory: `AppRail.tsx`, `AccountPanel.tsx`, `ConversationsList.tsx`, `CurrentConversation.tsx`, `ConversationInfo.tsx`, `ThemeToggle.tsx`.
- `src/hooks/useStuckScroll.ts` is shared by all three columns; see the `sticky-scroll-headers` skill.
- `src/data/fallback.ts` supplies conversation data as static fixtures: `currentUser`, `fallbackConversations`, `fallbackMessages`, `fallbackParticipants`, `fallbackSharedFiles`, `fallbackSharedLinks`. Conversation switching and message sending are local `useState` updates against that fixture data. Replace this module when the conversation backend lands. Auth is real; conversations are not yet.

## File Mirroring
The app uses both sanctioned patterns, so match whichever the neighbouring file uses:
- **Co-located** for routes. `src/app/page.tsx` imports `./page.module.css`, the co-located `src/app/page.module.css`.
- **Mirrored** for components. Every component under `src/components/` has a same-named module under `src/styles/components/` (e.g. `src/components/ConversationsList.tsx` <-> `src/styles/components/ConversationsList.module.css`), imported as `../styles/components/ConversationsList.module.css`.
- **Known stale duplicate**: `src/styles/app/page.module.css` exists but nothing imports it, and it differs from the co-located `src/app/page.module.css` that the page actually uses. Do not edit it as though it were live; remove it once you confirm the co-located file is the only one wanted.
- Global styles are `src/app/globals.css`, imported once by `src/app/layout.tsx`.

## Theme Architecture
- Ported from `social`'s `ThemeToggle`, reimplemented idiomatically for React 19 rather than copied. Precedence is unchanged: cookie for server render, then `localStorage`, then `prefers-color-scheme`.
- `src/theme.ts` is a plain module (no `"use client"`) holding `THEME_KEY`, `THEME_ROOT_ID`, the `ThemeName` type, and `resolveThemeCookie`. It must stay non-client: `src/app/layout.tsx` is a Server Component and cannot call a function imported from a `"use client"` module, which throws `Attempted to call ... but ... is on the client`.
- `src/contexts/ThemeContext.tsx` is the client provider plus `useTheme`. `ThemeProvider` is mounted in `src/app/layout.tsx` outside `AuthProvider`.
- `ThemeToggle` takes an optional `fixed` boolean, applied as a variant class alongside the id (`button#themeToggle.placementFixed`). Omit it for in-flow placement (the rail) and pass it on the auth pages. It reads no theme props, so it can be dropped into any depth.
- The control is an **icon**, not a labelled pill: a moon glyph while the current theme is light, a sun glyph while it is dark, so the glyph always shows the theme it switches *to*. `aria-label` and `title` carry the same "Switch to X mode" wording, and the glyphs are `aria-hidden="true"`, which is what keeps the accessible name unambiguous now that there is no visible text. Both apps draw the same two paths, in `social`'s existing `iconProps` style (24px viewBox, `currentColor`, stroke 2, round caps and joins).
- **No flash of wrong theme**: `layout.tsx` is async and awaits `cookies()`, then sets `data-theme` on `div#app` only when the cookie is present and valid. Omitting the attribute lets the `prefers-color-scheme` media query in `globals.css` decide, which is how a first-time visitor with a dark system theme still gets the correct first paint. The cost is that `/login` and `/signup` became dynamic (`ƒ`) instead of static (`○`).
- `initialTheme` is the cookie value or `"light"`. The first client render therefore always matches the server HTML, so the label never triggers a hydration mismatch; the provider corrects it to the resolved value in an effect.
- The two dark paths in `globals.css` (`div#app[data-theme="dark"]` and the media query) must declare identical tokens; they are standardized at `--surface: rgba(255, 255, 255, 0.06)` since the 2026-10-20 GUI overhaul, matching `social`. Keep them in sync if either changes.

## GUI Overhaul (2026-10-20)
The GUI follows the "Indigo dusk" system shared with `social`. The palette values (`#f2f3f8` / `#0c0d14`, accent `#6d5dfc` / `#8b7dff`) did **not** change; the rework restructured tokens and redistributed surface treatments:
- **Accent, not primary.** Every `--primary` / `--primary-strong` / `--primary-soft` reference was renamed to `--accent` / `--accent-strong` / `--accent-soft` across all modules. **`--accent-ink`** (`#ffffff` in both themes) is the text/icon color on accent fills (active tabs, unread badges, hovered new-conversation button, submit buttons); the empty `--surface-hover` token was removed from `globals.css`. Generic hovers use the neutral **`--wash`**; accent fills are reserved for live state: selected rows, active tabs, unread badges, receipts, the encryption notice, and outgoing bubbles.
- **Presence and danger semantics.** `--success` (online, away subtitle) and `--idle` color the avatar presence dots; `--danger` colors the log-out row, the block/leave button, and auth error boxes. Recolor these in `globals.css` only, never in component modules.
- **Radius scale**, never one value everywhere: `--radius-panel` (1rem) for glass chrome and the account-panel groups, `--radius-control` (0.625rem) for bubbles, buttons, inputs, chips, and error boxes, `999px` only for pills (unread badge, role badge, round icon buttons and inputs).
- **Glass chrome vs paper content.** Glass (fill + blur + edge highlight via `box-shadow: var(--glass-shadow), var(--glass-inset)`) belongs only on chrome: the three sticky column headers (`header#conversationsHeader`, `header#conversationHeader`, `section#profileCard`), `footer#composer`, `header#panelHeader`, and the auth cards (`section#login`, `section#signup`). The rail stays a borderless transparent column; it must never be contained in a card. Everything else is paper: conversation rows, message bubbles, participant rows, shared files and links, and panel sections carry flat fills (`--surface`, `--accent-soft` for selection) with no borders; adjacent rows separate with hairline dividers (`> li:not(:first-child) > * { border-top: 0.0625rem solid var(--line) }`), and row hovers use square fills so dividers stay flush. The date separator is bare centered text, not a chip.
- **Sticky contract unchanged.** Column roots still use the `&::before { height: var(--header-offset) }` spacer, `.stuck` still flattens only the top corner radius, and the composer stays `position: sticky; bottom: 0` at the bottom of its column scroller.
- **Fallbacks are token-level** in `globals.css`: `@media (prefers-reduced-transparency: reduce)` swaps fills for opaque colors and zeroes `--blur`; `@supports not (backdrop-filter: blur(1px))` raises fill alphas; `:where(...):focus-visible` gives every control the accent ring (inputs keep their softer border-color rule with a light outline); `@media (prefers-reduced-motion: reduce)` collapses every transition.
- Copy follows the interface-writing standard: sentence case (`Channel members`, `Shared files`, `Leave channel`, `Block contact`, `Report a problem`), no spaced em dashes in fixtures, and no middle-dot (` • `) meta joins; multi-fact subtitles use commas.

## Header Surface
All three column headers (`header#conversationsHeader`, `header#conversationHeader`, `section#profileCard`) use `background: var(--surface-strong)` plus `-webkit-backdrop-filter` and `backdrop-filter` of `blur(var(--blur))`, declared in the base rule so the frost is always present. `footer#composer`, `header#panelHeader`, and the auth cards share the same treatment, plus `box-shadow: var(--glass-shadow), var(--glass-inset)` for the edge highlight. This is a deliberate deviation from the translucent `--surface` used by the message stream and list rows, chosen because the stronger surface reads better as chrome.

Two consequences to keep in mind before changing it:
- The `blur` is now unconditional, so the `.stuck` variant only flattens the top corner radius. Do not re-add a blur to `.stuck`; it would be a duplicate. `.stuck` is still the signal that the header has pinned, produced by `useStuckScroll`.
- In the light theme `--surface-strong` is `rgba(255, 255, 255, 0.92)`, which is nearly opaque, so the headers read as solid white panels and the blur contributes little over the light `--bg`. In the dark theme it is `rgba(255, 255, 255, 0.1)` and the frost does read. If the headers should stay translucent in the light theme while keeping the always-on blur, that is a one-token change per header (`--surface-strong` back to `--surface`) rather than a structural one.

## Message App Layout Structure
`src/app/page.tsx` renders `main#messageLayout` (from `page.module.css`, referenced as `id={style.messageLayout}`) as a three-track grid containing three direct children:
- **Leftmost division**: `AppRail` renders `nav#appRail`. A borderless, transparent rail holding, top to bottom: the profile picture, the direct-conversation list selector, a horizontal rule, the community list, another horizontal rule, and the theme toggle. Every one of those is a **selection** of what the middle division shows, and the rail holds no other state: no open/closed flag, no popover, no auth or logout logic (those moved to `AccountPanel`). All three selectors share the same guard, `if (activeSource !== next)`, so clicking the already-active one is a no-op rather than a toggle-off, and each carries `aria-pressed`. Width is `--rail-width` in `page.module.css` (`4rem`); it is sized in `rem` rather than `%` so the icons do not scale with window width. Every control keeps the same `2.5rem` square rhythm, so the rail width is a spacing decision rather than a constraint imposed by any one control.
- **Cross-module alignment invariant**: every column root uses an `&::before { height: var(--header-offset) }` scroll spacer so its sticky header can travel upward and pin. That spacer is what places each header's *initial* top edge at `--header-offset` below the column top, and `nav#appRail` uses the same `var(--header-offset)` as its `padding-top`, so the profile picture lines up with the column headers at rest. `--header-offset` is declared once on `main#messageLayout` in `page.module.css` (`2.5vh`); all five consumers (four spacers plus the rail padding) reference it. Do not reintroduce a literal `2.5vh` in any of those places or the rail drifts out of alignment with the columns. The columns' separate `padding-bottom: 2.5vh` is an unrelated value that happens to match.
- **Middle division**: one of two mutually exclusive components, chosen by the single `activeSource` state in `page.tsx`. The source is a single string with three kinds of value: the `"account"` and `"direct"` sentinels, or a community id, so "which thing is showing" is one piece of state rather than a boolean plus an id.
  - `ConversationsList` renders `section#conversations` for the `"direct"` and community sources. Lists the active source's conversations (user-to-user, or one community's channels), plus a search bar, filter tabs, and a new-conversation trigger. Its header title and tab set are props supplied by the page, because the mixed All / Direct / Channels / Unread tabs are meaningless once the list is always one kind or the other.
  - `AccountPanel` renders `section#accountPanel` for the `"account"` source, which is what the profile picture selects. It **replaces** the conversation list rather than overlaying it; it is not a popover and has no dismiss handlers, Escape handling, or click-outside logic. Its header carries basic user information (avatar, display name, handle, bio, website, email) and its body holds action sections. Only `Log out` has behaviour; the rest are inert buttons pending routes. Provenance is mixed and worth knowing: `displayName`, `username` and `email` are real session data from `useAuth`, while `bio` and `website` come from the `currentUser` fixture because the `User` Prisma model has no such columns. Until the session request resolves, `user` is `null` on the server render, so the header shows fixture values until hydration.
- **Right division**: `div#conversationArea`, which carries the `infoOpen` class variant to toggle width. It contains:
  - `CurrentConversation` renders `section#current`: the active thread, with a header (partner or channel details, presence status, action buttons), the message stream (bubbles, timestamps, sender details, delivery and read receipts), and the composer (attachment actions, text input, emoji trigger, send button).
  - `ConversationInfo` renders `aside#information`, rendered **only when `infoOpen` is true**. Holds the partner or channel profile and description, the participant list, shared media and documents and links and files, and conversation settings, notification and mute toggles, and conversation actions.

Because the aside and the middle division are both conditional, layout work must handle `section#conversations` or `section#accountPanel` in the middle slot. Both are `<section>` roots with identical column geometry (`width: 100%`, `height: 100%`, flex column, `padding-bottom: 2.5vh`) and both use the `--header-offset` spacer plus a sticky `header` with the `.stuck` variant, so they are interchangeable in the grid. That also means the mobile rule `main#messageLayout > section { display: none }` hides `AccountPanel` as well as the conversation list.
## Endpoint Standards
Auth endpoints are listed under Auth Architecture. Each handler carries a comment above it giving the verb and URL, e.g. `// POST /api/login`. Do the same for any new endpoint, per the repository root `AGENTS.md`. Conversation endpoints do not exist yet; when they land they will be `POST /conversations`, `GET /conversations/:id/messages`, and `POST /messages`.

## Agent Skills and This App's Stack
The repository root `.agents/skills/` carries three Vercel skills that exist for this app. Restore them with the repository root restore command documented in the root `AGENTS.md`; they are registered repo-wide, so apply them only when working in `message/`.

All skills are installed in the repository-level `.agents/skills/` and are discovered in every session, so none of them are scoped to this directory. Five are relevant here, selected by framework rather than by folder. This app is React 19 on the Next.js App Router, which makes it the current match for the React and Next.js skills:

- `vercel-react-best-practices` and `vercel-composition-patterns` fit this app directly.
- `nextjs-app-router-patterns` covers route handlers, Server Components, streaming, and parallel routes. This app now has Route Handlers under `src/app/(auth)/api/`, so use it when adding endpoints or routes.
- `web-design-guidelines` is a review-time wrapper that fetches its rules from a remote URL on every use, so it needs `webfetch` approval each time.
- `api-and-interface-design` is framework agnostic and applies to every endpoint here.

The four React and Next.js skills are valid for this app because of the framework, and would be valid for any future React or Next.js app in this repository with no reinstall. They must not be applied to `dvibd/gui` or `social`, which are SolidJS.

**This app does not use Tailwind CSS.** No Tailwind config or import exists anywhere in the repository, and all three Node apps style through CSS Modules. `web-design-guidelines` phrases many of its rules as Tailwind utilities, so translate rather than apply them literally:

| Guideline says | Equivalent here |
| --- | --- |
| `focus-visible:ring-*` | `:focus-visible { outline: ... }` in the component's module |
| `hover:`, `truncate` | `:hover {}`, `text-overflow` with `overflow` and `white-space` |
| `min-w-0` | `min-width: 0` (still the correct fix for flex children refusing to shrink) |
| `line-clamp-*`, `break-words` | `-webkit-line-clamp` with `display: -webkit-box`, `overflow-wrap` |
| `content-visibility: auto` | the raw `content-visibility` property |

**Framework-specific rules to disregard here.** The `web-design-guidelines` Hydration Safety section assumes React's controlled-input model and `suppressHydrationWarning`, and its state-sync rule suggests **nuqs**, which is a React library. Apply the platform-level guidance (ARIA, focus states, `prefers-reduced-motion`, `Intl.*`, semantic HTML) as written, and treat the React-specific items as advisory only.

**Local standards win on conflict.** The repository root `AGENTS.md` GUI standards override two guideline preferences: this repo requires ids rather than classes for styling, and requires `rem` for font sizes, gaps, and media-query breakpoints. Prefer those when the two disagree.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes: APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
