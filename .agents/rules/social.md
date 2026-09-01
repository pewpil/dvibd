# `social` Project Context

This file contains context specific to the `social` application. Global standards and instructions live in `.agents/rules/instructions.md`.

## Application Overview
- **Framework & Runtime**: SolidStart with Vite, running on Node (`npx tsc --noEmit` in `social/`).
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
