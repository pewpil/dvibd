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

## Agent Skills and This App's Stack
The repository root `.agents/skills/` carries three Vercel skills that exist for this app. Restore them with the repository root restore command documented in the root `AGENTS.md`; they are registered repo-wide, so apply them only when working in `message/`.

- `vercel-react-best-practices` and `vercel-composition-patterns` fit this app directly: it is React 19 on the Next.js App Router.
- `web-design-guidelines` is a review-time wrapper that fetches its rules from a remote URL on every use, so it needs `webfetch` approval each time.

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