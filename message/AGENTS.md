# `message` Project Context

This file contains context specific to the `message` application. Repository-wide standards and instructions live in the repository root `AGENTS.md`.

## Application Overview
- **Framework & Runtime**: Next.js 16 (App Router, React 19), running on Node. Type check with `npx tsc --noEmit` or `npm run typecheck` from `message/`.
- **Dev Port**: `3005`, set in the `dev` and `start` scripts (`next dev -p 3005`).
- **Root Layout**: `src/app/layout.tsx` is a Server Component. It exports `metadata` (`title: "Message"`, `description: "dvibd messaging"`) and renders `<html lang="en">`, `<body>`, and a `<div id="app">` wrapper.
- **No Backend Yet**: This app has no backend, no API routes, and no database access. `message/package.json` declares only `next`, `react`, and `react-dom` at runtime, with no Prisma client and no auth library.

## Current Implementation State
The app is a single client-rendered screen, not a set of routes:
- `src/app/page.tsx` is the only route. It is a Client Component (`"use client"`) named `MessagePage`.
- `src/app/layout.tsx` is the only layout.
- There are no route groups anywhere under `src/app/`. The `(messages)` and `(auth)` groups described in earlier drafts do not exist.
- No `src/middleware.ts`, no `route.ts` handlers, and no `api/` directory.
- `src/components/` holds three components, all flat, with no subdirectory: `ConversationsList.tsx`, `CurrentConversation.tsx`, `ConversationInfo.tsx`.
- `src/data/fallback.ts` supplies all data as static fixtures: `currentUser`, `fallbackConversations`, `fallbackMessages`, `fallbackParticipants`, `fallbackSharedFiles`, `fallbackSharedLinks`. Conversation switching and message sending are local `useState` updates against that fixture data. Replace this module when a real backend lands.

## File Mirroring
The app uses both sanctioned patterns, so match whichever the neighbouring file uses:
- **Co-located** for routes. `src/app/page.tsx` imports `./page.module.css`, the co-located `src/app/page.module.css`.
- **Mirrored** for components. Every component under `src/components/` has a same-named module under `src/styles/components/` (e.g. `src/components/ConversationsList.tsx` <-> `src/styles/components/ConversationsList.module.css`), imported as `../styles/components/ConversationsList.module.css`.
- **Known stale duplicate**: `src/styles/app/page.module.css` exists but nothing imports it, and it differs from the co-located `src/app/page.module.css` that the page actually uses. Do not edit it as though it were live; remove it once you confirm the co-located file is the only one wanted.
- Global styles are `src/app/globals.css`, imported once by `src/app/layout.tsx`.

## Message App Layout Structure
`src/app/page.tsx` renders `main#messageLayout` (from `page.module.css`, referenced as `id={style.messageLayout}`) containing two direct children:
- **Left division**: `ConversationsList` renders `section#conversations`. Lists every conversation the user belongs to, covering 1-on-1 direct conversations and community channels, plus a search bar, filter tabs (`All`, and tabs for Direct / Channels / Unread), and a new-conversation trigger.
- **Right division**: `div#conversationArea`, which carries the `infoOpen` class variant to toggle width. It contains:
  - `CurrentConversation` renders `section#current`: the active thread, with a header (partner or channel details, presence status, action buttons), the message stream (bubbles, timestamps, sender details, delivery and read receipts), and the composer (attachment actions, text input, emoji trigger, send button).
  - `ConversationInfo` renders `aside#information`, rendered **only when `infoOpen` is true**. Holds the partner or channel profile and description, the participant list, shared media and documents and links and files, and conversation settings, notification and mute toggles, and conversation actions.

Because the aside is conditional, layout work must handle the two-child case (`section#conversations` plus `section#current`) as well as the three-child case.

## Endpoint Standards
There are no endpoints yet. When adding them, document each one above its handler with the HTTP verb and URL (e.g. `POST /login`, `GET /conversations/:id/messages`) per the repository root `AGENTS.md`.