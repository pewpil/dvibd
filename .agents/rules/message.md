# `message` Project Context

This file contains context specific to the `message` application. Global standards and instructions live in `.agents/rules/instructions.md`.

## Application Overview
- **Framework & Runtime**: Next.js (App Router, React 19), running on Node (`npx tsc --noEmit` in `message/`).
- **File Mirroring**:
  - `src/app/` and `src/styles/app/` mirror each other (e.g. `src/app/(messages)/conversations/page.tsx` <-> `src/styles/app/(messages)/conversations.module.css` or co-located `page.module.css` / `layout.module.css`).
  - `src/components/` and `src/styles/components/` mirror each other (e.g. `src/components/(messages)/ConversationList.tsx` <-> `src/styles/components/(messages)/ConversationList.module.css`).

## Auth Architecture
- `message` is a self-contained backend ecosystem: it never proxies or relays to `api/`. It shares only `orm/` (Prisma client) and `db/` (Postgres).
- Auth HTTP routes live directly under `src/app/(auth)/` as Next.js Route Handlers (e.g. `src/app/(auth)/(endpoints)/login/route.ts` or `src/app/(auth)/login/route.ts` exporting `POST /login`; route group parens are stripped from the URL).
- Page files (`login/page.tsx`, `signup/page.tsx`) must stay client-safe: route logic and verb handlers live in `route.ts` or dedicated server modules. Never import server-only modules (`bcrypt`, `prisma`, `pg`) into Client Components (`"use client"`).
- Pure Route Handler files (`session/route.ts`, `refresh/route.ts`, `logout/route.ts`, `me/route.ts`) have no component and are safe.
- Endpoints: `POST /login`, `POST /signup`, `GET /session`, `POST /refresh`, `POST /logout`, `GET /me`, plus message endpoints (`POST /conversations`, `GET /conversations/:id/messages`, `POST /messages`).
- Session strategy: refresh token (30 days) in httpOnly cookie `message.session`; access token (15 min) returned in the response body and kept in client memory. Every `GET /session` rotates the refresh token (old row deleted, new issued).
- `src/middleware.ts` verifies the session cookie, guards protected paths (`/conversations`, `/messages`, `/settings`, `/profile` redirect to `/login`), and redirects authenticated users away from `/login` and `/signup`.
- Password hashing uses native `bcrypt`. Server modules: `config.ts` (env policy), `db.ts` (Prisma singleton), `tokens.ts`, `session.ts`, `user.ts` (`SafeUser`, `USER_SELECT`); `auth.ts` provides server helpers for SSR and Server Components.

## Message App Layout Divisions
The message application layout is composed of 3 vertical divisions inside `main#messageLayout`:
- **Left division (`conversations`)**: `section#conversations` (referred to as **conversations**). Displays all conversations the user is part of:
  - 1-on-1 direct conversations with another user that the user is interacting with.
  - Conversation channels from a community.
  - Includes a search bar, filter tabs (e.g. Direct, Channels, Unread), and new conversation trigger.
- **Center division (`current`)**: `section#current` (referred to as **current**). Displays the active conversation thread:
  - Header: conversation partner or channel details, active presence/status indicator, and call/action buttons.
  - Message stream: scrollable message thread with message bubbles, timestamps, sender details, and delivery/read receipts.
  - Composer: input area with attachment upload actions, text input, emoji trigger, and send button.
- **Right division (`information`)**: `aside#information` (referred to as **information**). Displays detailed information about the current conversation:
  - User profile or community channel details and description.
  - Participant/member list.
  - Shared media, documents, links, and files.
  - Conversation settings, notification/mute toggles, and conversation actions.
