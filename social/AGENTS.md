# `social` Project Context

This file contains context specific to the `social` application. Repository-wide standards and instructions live in the repository root `AGENTS.md`.

## Application Overview
- **Framework & Runtime**: SolidStart with Vite, running on Node (`npx tsc --noEmit` in `social/`).
- **Frameworks Not Used Here**: React, Next.js, Remix, and Tailwind CSS. This is SolidStart 2 on Nitro, not a React app, so the React skills (`vercel-react-best-practices`, `vercel-composition-patterns`) must not be applied here. Only `web-design-guidelines` carries usable guidance, and only its platform-level rules: ARIA, focus states, `prefers-reduced-motion`, `Intl.*`, semantic HTML, and touch targets. Its React-specific advice (controlled inputs via `value` plus `onChange`, `suppressHydrationWarning`, the nuqs state-sync suggestion) is wrong for SolidJS and should be ignored, and its Tailwind class syntax must be translated to CSS Modules. Local standards win on conflict: this repo requires ids over classes and `rem` for font sizes, gaps, and breakpoints.
- **Contrast with `dvibd/gui`**: the two apps share `solid-js` and `@solidjs/router` and nothing else. This app is SolidStart with a Nitro server runtime; `dvibd/gui` is a plain client-side Vite SPA with no server runtime. See `dvibd/AGENTS.md`.
- **File Mirroring**:
  - `src/routes/` and `src/styles/pages/` mirror each other (e.g. `src/routes/(home)/notifications.tsx` <-> `src/styles/pages/(home)/notifications.module.css`).
  - `src/components/` and `src/styles/components/` mirror each other (e.g. `src/components/(home)/FeedTabs.tsx` <-> `src/styles/components/(home)/FeedTabs.module.css`).

## Auth Architecture
- `social` is a self-contained backend ecosystem: it never proxies or relays to `api/`. It shares only `orm/` (Prisma client at `src/server/generated`, extension `mts`) and `db/` (Postgres).
- Auth HTTP routes live directly in `src/routes/(auth)/` with no `/api` prefix. Page files (`login.tsx`, `signup.tsx`) must stay client-safe: their verb handlers live in the route group `(auth)/(endpoints)/` (e.g. `(endpoints)/login.ts` exports `POST /login`; group parens are stripped from the URL).
- Never import server-only modules (`bcrypt`, `prisma`, `pg`, `h3`) into a file with a default page component; Vite dev loads the whole graph in the browser. Pure API route files (`session.ts`, `refresh.ts`, `logout.ts`, `me.ts`) have no component and are safe.
- Endpoints: `POST /login`, `POST /signup`, `GET /session`, `POST /refresh`, `POST /logout`, `GET /me`.
- Session strategy: refresh token (30 days) in httpOnly cookie `social.session`; access token (15 min) returned in the response body and kept in client memory. Every `GET /session` rotates the refresh token (old row deleted, new issued).
- `src/middleware.ts` verifies the cookie into `locals.loggedIn` and guards `/notifications`, `/bookmarks`, `/settings`, `/profile` (redirect `/login`) and redirects authed users off `/login` and `/signup`.
- Password hashing uses native `bcrypt`. Server modules: `config.ts` (env policy), `db.ts` (Prisma singleton), `tokens.ts`, `session.ts`, `user.ts` (`SafeUser`, `USER_SELECT`); `auth.ts` is the `"use server"` facade (`fetchSession`) so SSR renders correct auth state.

## Header Surface
`header#feedHeader` uses the same background treatment as `message`'s column headers and this app's `AccountMenu`: `background: var(--surface-strong)` plus `-webkit-backdrop-filter` and `backdrop-filter` of `blur(var(--blur))`, declared in the base rule so the frost is always present rather than appearing only when pinned.

Two consequences to keep in mind before changing it:
- The `blur` is unconditional, so `.stuck` only flattens the top corner radius. Do not re-add a blur to `.stuck`; it would be a duplicate. `.stuck` remains the signal that the header has pinned.
- In the light theme `--surface-strong` is `rgba(255, 255, 255, 0.92)`, which is nearly opaque, so the header reads as a solid white panel and the blur contributes little over the light `--bg`. In the dark theme it is `rgba(255, 255, 255, 0.1)` and the frost does read. If the header should stay translucent in the light theme while keeping the always-on blur, that is a one-token change (`--surface-strong` back to `--surface`).
- `ExploreHeader` and `BookmarksHeader` are unaffected: they are `background: transparent` section headings, not surface panels, so the treatment does not transfer to them without a redesign.

## Theme Toggle
`src/components/ThemeToggle.tsx` renders on the home page and on both auth pages. It is an **icon** button, not a labelled pill: a moon glyph while the current theme is light, a sun glyph while it is dark, so the glyph always shows the theme it switches *to`. `aria-label` and `title` carry the same "Switch to X mode" wording and the glyphs are `aria-hidden="true"`, which is what keeps the accessible name unambiguous now that there is no visible text. The two paths follow the `iconProps` convention already established in `SideNav.tsx` (24px viewBox, `currentColor`, stroke 2, round caps and joins), and `message`'s `ThemeToggle.tsx` draws the identical geometry so the two apps stay visually consistent.

## Home Page Layout
The home page is composed of 3 vertical divisions inside `div#homeLayout`, laid out as a grid of fit-content, the feed, and the Explore rail:
- **Left division**: `nav#sideNav`, referred to as the side nav. A compact fit-content navigation sidebar containing only icons (plus the user's profile picture) that redirect the user when clicked.
- **Center division**: `main#feed`, referred to as the feed. Shows stat and article overviews:
  - Stat: a microblog of no more than 256 characters.
  - Article: longer writing with a title, headings, and text.
- **Right division**: `aside#explore`, referred to as Explore. Contains a search bar and the sections trending, users, community, and legal.

## Left Nav Icon Set
- Icons (no messages, dvibd has a separate Message app): Home, Explore, Notifications, Bookmarks, Profile, Settings, plus the user's profile picture.
- Placeholder pages for each icon's route live under `src/routes/(pages)/(home)/`.