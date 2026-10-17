# `message` Project Context

This file contains context specific to the `message` application. Repository-wide standards and instructions live in the repository root `AGENTS.md`.

## Application Overview
- **Framework & Runtime**: Next.js 16 (App Router, React 19), running on Node. Type check with `npx tsc --noEmit` or `npm run typecheck` from `message/`.
- **Dev Port**: `3005`, set in the `dev` and `start` scripts (`next dev -p 3005`).
- **Root Layout**: `src/app/layout.tsx` is a Server Component. It exports `metadata` (`title: "Message"`, `description: "dvibd messaging"`) and renders `<html lang="en">`, `<body>`, and a `<div id="app">` wrapper that wraps children in `AuthProvider`.
- **Auth**: this app has its own backend and shares only `orm/` (Prisma) and `db/` (Postgres) with the rest of the repository. It never proxies through `dvibd/api/`.

## Auth Architecture
- `src/proxy.ts` is the route guard (**not** `middleware.ts`; Next.js 16 renamed the convention, and the edge runtime is unavailable in `proxy`). It validates the session cookie and redirects anonymous visitors to `/login` with a `?from=` hint, bounces authenticated visitors away from `/login` and `/signup`, and excludes `/api/*` plus static assets.
- Route Handlers live under `src/app/(auth)/api/<name>/route.ts`. Only `(auth)` is a route group and is stripped from the URL; `api/` is a real path segment and **is** part of it, so these resolve to `/api/login` and friends.
- Endpoints: `POST /api/login`, `POST /api/signup`, `GET /api/session`, `POST /api/logout`.
- **Pages and route handlers cannot share a URL**, even when their HTTP methods differ. `(auth)/login/page.tsx` and `(auth)/(endpoints)/login/route.ts` would both resolve to `/login` and the build fails with "Conflicting page and route". That is why the handlers sit under a plain `api/` folder rather than a parenthesized `(api)` group the way `social` uses. Do not "fix" this by renaming `api/` to `(api)`.
- Server modules are in `src/server/`: `config.ts` (zod-validated env with dev defaults), `db.ts` (Prisma client with a dev-mode global singleton), `tokens.ts` (JWS issue/verify, refresh-token rotation), `session.ts` (`readSession`), `user.ts` (`SafeUser`, `USER_SELECT`), `auth.ts` (`server-only` facade).
- Session strategy: refresh token (30 days) in the httpOnly cookie `message.session`; access token (15 min) returned in the response body and kept in client memory.
- `src/contexts/AuthContext.tsx` is the client provider. Page files must stay client-safe: never import `src/server/*` into a Client Component. Route Handlers may.
- Password hashing uses native `bcrypt`. `tsconfig.json` sets `allowImportingTsExtensions` so the generated `.mts` client can be imported.
- The ORM generator for this app is `message-client`, outputting `src/server/generated` (gitignored). Regenerate with `cd orm && npm run generate`.

## Current Implementation State
- `src/app/page.tsx` is the message layout. It is a Client Component (`"use client"`) named `MessagePage`, and is the only unguarded page.
- `src/app/(auth)/login/page.tsx` and `src/app/(auth)/signup/page.tsx` are the auth pages. Both are Client Components. The login page wraps its form in `<Suspense>` because it reads `useSearchParams`, which Next.js 16 requires for static prerendering.
- `src/app/(auth)/api/` holds the four Route Handlers listed under Auth Architecture.
- There is no `src/middleware.ts`. The guard is `src/proxy.ts`.
- `src/components/` holds five components, all flat, with no subdirectory: `AppRail.tsx`, `ConversationsList.tsx`, `CurrentConversation.tsx`, `ConversationInfo.tsx`, `ThemeToggle.tsx`.
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
- The two dark paths in `globals.css` (`div#app[data-theme="dark"]` and the media query) must declare identical tokens. They previously disagreed on `--surface` (`0.6` vs `0.02`), which meant manually selecting dark rendered very differently from a system-dark first visit.

## Header Surface
All three column headers (`header#conversationsHeader`, `header#conversationHeader`, `section#profileCard`) use the same background treatment as the rail's `div#accountMenu`: `background: var(--surface-strong)` plus `-webkit-backdrop-filter` and `backdrop-filter` of `blur(var(--blur))`, declared in the base rule so the frost is always present. This is a deliberate deviation from the translucent `--surface` used by the message stream and list rows, chosen because the account menu's stronger surface read better as a header.

Two consequences to keep in mind before changing it:
- The `blur` is now unconditional, so the `.stuck` variant only flattens the top corner radius. Do not re-add a blur to `.stuck`; it would be a duplicate. `.stuck` is still the signal that the header has pinned, produced by `useStuckScroll`.
- In the light theme `--surface-strong` is `rgba(255, 255, 255, 0.92)`, which is nearly opaque, so the headers read as solid white panels and the blur contributes little over the light `--bg`. In the dark theme it is `rgba(255, 255, 255, 0.1)` and the frost does read. If the headers should stay translucent in the light theme while keeping the always-on blur, that is a one-token change per header (`--surface-strong` back to `--surface`) rather than a structural one.

## Message App Layout Structure
`src/app/page.tsx` renders `main#messageLayout` (from `page.module.css`, referenced as `id={style.messageLayout}`) as a three-track grid containing three direct children:
- **Leftmost division**: `AppRail` renders `nav#appRail`. A fit-content rail holding, top to bottom: the profile picture with its account menu, the direct-conversation list selector, a horizontal rule, the community list, another horizontal rule, and the theme toggle. The rail selects *what* the conversation list shows; it does not toggle its visibility. The list selector shows user-to-user conversations, a community picture narrows the list to that community's channels, and clicking the active selection again is a no-op rather than a toggle off. Width is `--rail-width` in `page.module.css` (`4rem`); it is sized in `rem` rather than `%` so the icons do not scale with window width. Every control in the rail is a `2.5rem` square, including the theme toggle, so the rail width is a spacing decision rather than a constraint imposed by any one control.
- **Cross-module alignment invariant**: every column root uses an `&::before { height: var(--header-offset) }` scroll spacer so its sticky header can travel upward and pin. That spacer is what places each header's *initial* top edge at `--header-offset` below the column top, and `nav#appRail` uses the same `var(--header-offset)` as its `padding-top`, so the profile picture lines up with the column headers at rest. `--header-offset` is declared once on `main#messageLayout` in `page.module.css` (`2.5vh`); all four consumers reference it. Do not reintroduce a literal `2.5vh` in any of those four places or the rail drifts out of alignment with the columns. The columns' separate `padding-bottom: 2.5vh` is an unrelated value that happens to match.
- **Middle division**: `ConversationsList` renders `section#conversations`. Lists the active source's conversations (user-to-user, or one community's channels), plus a search bar, filter tabs, and a new-conversation trigger. Its header title and tab set are props supplied by the page, because the mixed All / Direct / Channels / Unread tabs are meaningless once the list is always one kind or the other.
- **Right division**: `div#conversationArea`, which carries the `infoOpen` class variant to toggle width. It contains:
  - `CurrentConversation` renders `section#current`: the active thread, with a header (partner or channel details, presence status, action buttons), the message stream (bubbles, timestamps, sender details, delivery and read receipts), and the composer (attachment actions, text input, emoji trigger, send button).
  - `ConversationInfo` renders `aside#information`, rendered **only when `infoOpen` is true**. Holds the partner or channel profile and description, the participant list, shared media and documents and links and files, and conversation settings, notification and mute toggles, and conversation actions.

Because the aside is conditional, layout work must handle the two-child case (`section#conversations` plus `section#current`) as well as the three-child case.
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

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
