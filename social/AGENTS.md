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
- Password hashing uses native `bcrypt`. Server modules: `config.ts` (env resolution; the local scripts export `LOCAL_ENV=1`, so localhost runs lock to the dev defaults and ignore the environment, per the root `AGENTS.md` env policy), `db.ts` (Prisma singleton), `tokens.ts`, `session.ts`, `user.ts` (`SafeUser`, `USER_SELECT`); `auth.ts` is the `"use server"` facade (`fetchSession`) so SSR renders correct auth state.

## Deployment
`netlify.toml` sits beside `package.json`, so the Netlify base directory is `social`. It publishes `dist` and relies on `nitro/vite`: Nitro detects the Netlify build environment and writes the catch-all function to `.netlify/functions-internal/server/server.mjs` with `path: "/*"` and `preferStatic: true`, so `dist` assets win and everything else reaches the function. The build command runs `npm --prefix ../orm run generate` first, because `src/server/generated` is gitignored and missing from a fresh clone. Do not add `@netlify/vite-plugin`: that path expects a `dist/client` publish directory and would change what this config publishes. The build command also carries the masked-`DATABASE_URL` guard described in the root `AGENTS.md` deployment section: `--secret` values reach local CLI builds masked, so the command unsets the variable and `prisma generate` resolves the real URL from `orm/.env` through dotenv, while deployed functions read the unmasked value from Netlify env at runtime.

## Header Surface
`header#feedHeader` uses the same background treatment as `message`'s column headers and this app's `AccountMenu`: `background: var(--surface-strong)` plus `-webkit-backdrop-filter` and `backdrop-filter` of `blur(var(--blur))`, declared in the base rule so the frost is always present rather than appearing only when pinned.

Two consequences to keep in mind before changing it:
- The `blur` is unconditional, so `.stuck` only flattens the top corner radius. Do not re-add a blur to `.stuck`; it would be a duplicate. `.stuck` remains the signal that the header has pinned.
- In the light theme `--surface-strong` is `rgba(255, 255, 255, 0.85)`, so the header reads as frosted glass in both themes; the frost is part of the design, not an accident to fix. Dark theme keeps it at `rgba(255, 255, 255, 0.1)`.
- `ExploreHeader` and `BookmarksHeader` are unaffected in structure: they are transparent section headings inside the glass `FeedHeader`, not separate surface panels.

## Design Tokens (2026-10 rework)
The app follows the "Indigo dusk" token system set in `src/app.css` (the app's original bluish palette, restored 2026-10-20; names and structure unchanged). Key facts for future edits:
- **Accent, not primary.** The old `--primary` / `--primary-strong` / `--primary-soft` tokens were renamed to `--accent` / `--accent-strong` / `--accent-soft`. The accent is violet-blue (`#6d5dfc` light, `#8b7dff` dark) and is reserved for state: active tabs, selected filters, links, the theme-toggle hover, danger-adjacent emphasis. Generic hover states use `--wash` (a neutral ink wash), never `--accent-soft`.
- **`--accent-ink`** is the text/icon color to use on accent fills (`#ffffff` in both themes; `#8b7dff` on `#ffffff` matches the pre-rework look). Never hardcode `#fff` on top of an accent background.
- **Semantic tokens** `--like` (#f43f5e) and `--repost` (#22c55e) exist for post action states; `--danger` (#dc2626) for errors. All three keep the previous palette's literals, identical in both themes. Recolor them in `app.css` only, never in component modules.
- **Glass chrome vs paper content.** Glass (fill + blur + edge highlight via `box-shadow: var(--glass-shadow), var(--glass-inset)`) belongs only on chrome surfaces: `SideNav`, `FeedHeader`, `ThemeToggle`, `AccountMenu`, the explore rail Sections/Cards, the auth card, and the profile header stack (`img#cover` + `ProfileCard` + standalone `ProfileTabs`, which form one contiguous panel: cover owns the top border and top radius, the card owns the sides and the glass fill, the tabs own the bottom border and bottom radius). Posts, notification rows, and empty states are deliberately flat (`border: none`, transparent background) and separate with hairline borders (`:not(:first-child) { border-top: 0.0625rem solid var(--line) }`); `main#feed` carries no gap, the posts manage their own spacing.
- **Feed parity invariant (user decision, 2026-10-20):** the profile feed under the tabs is the same paper feed as `main#feed` on `/`: `div#profilePosts` is a chrome-less column and its `article#post` rows carry the identical flat styling from `Post.module.css`. Never wrap the profile posts inside the glass header stack; when `tabsStuck` fires, `ProfileCard`'s `complete` variant takes over the panel's bottom border and radius because the hidden tabs paint nothing.
- **Radius scale**, never one value everywhere: `--radius-panel` (1rem) for glass panels, `--radius-control` (0.625rem) for inputs and icon buttons, `999px` only for pills and avatars.
- **Fallbacks are token-level** in `app.css`: `@media (prefers-reduced-transparency: reduce)` swaps fills for opaque colors and zeroes `--blur`; `@supports not (backdrop-filter: blur(1px))` raises fill alphas; `:where(...):focus-visible` gives every control the accent ring; `@media (prefers-reduced-motion: reduce)` collapses every transition and resets `scroll-behavior` (all motion in the app is transition-based state response, no ambient keyframes).
- The light `data-theme="dark"` block and the `prefers-color-scheme` fallback block now carry identical values (the old `0.6` vs `0.02` `--surface` drift is gone); keep them in sync if either changes.

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