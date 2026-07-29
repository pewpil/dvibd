# Posting Status — Implementation Plan

> Status is the short-form text post (≤256 chars). A separate "post" type with longer content will be added later.

---

## `[x]` Phase 1 — Database Schema

### `[x]` 1.1 Create `src/db/schema/statuses.ts`

Define the `statuses` table in Drizzle:

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK, `defaultRandom()` | Primary key |
| `authorId` | `uuid` FK → `users.id`, `.notNull().references()` | Who wrote it |
| `content` | `varchar(256)`, NOT NULL | Short text, max 256 characters |
| `media` | `jsonb`, nullable | Array of media URLs for future use |
| `replyToId` | `uuid` FK → `statuses.id`, `.references()` | For reply threads |
| `createdAt` | `timestamptz`, `defaultNow()` | Creation timestamp |

Export `Status` / `NewStatus` inferred types.

### `[x]` 1.2 Create `src/db/schema/likes.ts`

Define the `likes` join table:

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK, `defaultRandom()` | |
| `userId` | `uuid` FK → `users.id`, `.notNull().references()` | |
| `statusId` | `uuid` FK → `statuses.id`, `.notNull().references()` | |
| `createdAt` | `timestamptz`, `defaultNow()` | |

Unique constraint on `(userId, statusId)` to prevent duplicate likes.

### `[x]` 1.3 Update `src/db/schema/index.ts`

Add `statuses` and `likes` table exports to the barrel file.

### `[x]` 1.4 Generate and apply migration

```bash
cd web/api && npm run db:generate && npm run db:migrate
```

### Phase 1 — Files created / edited

| File | Action |
|---|---|
| `api/src/db/schema/statuses.ts` | Created — `statuses` table schema |
| `api/src/db/schema/likes.ts` | Created — `likes` table schema |
| `api/src/db/schema/index.ts` | Edited — re-export `statuses` + `likes` |
| `drizzle/0001_round_namor.sql` | Generated — initial migration |
| `drizzle/0002_illegal_layla_miller.sql` | Generated — FK constraint migration |

---

## `[x]` Phase 2 — Backend API (Status Module)

### `[x]` 2.1 Create `src/modules/status/status.validation.ts`

Zod schema for creating a status:
- `content` — required, 1–256 characters
- `media` — optional array of strings (future image uploads)
- `replyToId` — optional UUID for reply threading

### `[x]` 2.2 Create `src/modules/status/status.service.ts`

Three exported functions:
1. **`createStatus(input, authorId)`** — inserts into `statuses`, returns `StatusWithAuthor`
2. **`listStatuses(limit, offset)`** — paginated query, left-joined with `users`, ordered `createdAt DESC`
3. **`getStatusById(id)`** — single status with author, throws `HttpError(404)` if not found

Exports `StatusWithAuthor` type. All variables explicitly typed.

### `[x]` 2.3 Create `src/modules/status/status.controller.ts`

Three Express handlers:
1. **`createStatusHandler`** — `POST`, reads validated body, calls service, responds `201`
2. **`listStatusesHandler`** — `GET`, reads `page`/`limit` query params, responds `200`
3. **`getStatusHandler`** — `GET /:id`, responds `200` or `404`

### `[x]` 2.4 Create `src/routes/status.ts`

```ts
router.post("/", authMiddleware, validate(createStatusSchema), createStatusHandler);
router.get("/", listStatusesHandler);
router.get("/:id", getStatusHandler);
```

### `[x]` 2.5 Register in `src/routes/index.ts`

Mounted at `/status`.

### Phase 2 — Files created / edited

| File | Action |
|---|---|
| `api/src/modules/status/status.validation.ts` | Created — Zod schema + inferred type |
| `api/src/modules/status/status.service.ts` | Created — `createStatus`, `listStatuses`, `getStatusById` |
| `api/src/modules/status/status.controller.ts` | Created — Express route handlers |
| `api/src/routes/status.ts` | Created — status router (POST, GET, GET /:id) |
| `api/src/routes/index.ts` | Edited — mount `statusRoutes` at `/status` |

---

## `[x]` Phase 3 — Frontend: Status Composer UI

### `[x]` 3.1 Create `src/social/uis/components/CreateStatus.tsx`

A glass card above the feed with:
- **Avatar** — user's profile picture from auth
- **Textarea** — multiline input, placeholder "What's on your mind?"
- **Character counter** — `remaining/256`, turns red when over limit
- **Media button** — placeholder with image icon (future upload support)
- **Submit button** — "Post" (or "Posting..."), disabled when empty or over limit
- **Error state** — inline error message if POST fails
- **Enter to submit** — Shift+Enter for newline, plain Enter submits
- Calls `POST /api/status` with `Authorization: Bearer <accessToken>` from localStorage

### `[x]` 3.2 Create `src/social/styles/components/CreateStatus.module.css`

Glass card styling matching the Status component:
- `color-mix(in srgb, var(--surface) 60%, transparent)` + `backdrop-filter: blur(12px)`
- `border: 1px solid var(--border)`, `border-radius: 1.1rem`
- Flex layout with avatar + body (textarea, footer with counter/submit)
- Fully nested rulesets

### `[x]` 3.3 Place `CreateStatus` in the feed

In `Feed.tsx`, render `<CreateStatus />` above `<For each={items()}>`, wrapped in `<Show when={isAuthenticated()}>`.

### Phase 3 — Files created / edited

| File | Action |
|---|---|
| `gui/src/social/uis/components/CreateStatus.tsx` | Created — status composer component |
| `gui/src/social/styles/components/CreateStatus.module.css` | Created — composer styles |
| `gui/src/social/uis/pages/home/Feed.tsx` | Edited — import + render `<CreateStatus />` |
| `gui/src/social/assets/image.svg` | Created — image icon for media button |

---

## `[x]` Phase 4 — Frontend: API Integration

### `[x]` 4.1 Create `src/social/lib/api.ts`

Typed fetch helpers (`createStatus`, `fetchStatuses`, `fetchStatusById`). Handles auth header, error extraction, JSON parsing. Exports `ApiStatus` and `ApiAuthor` types.

### `[x]` 4.2 Refactor CreateStatus to use api.ts

Replaced inline `fetch()` calls with `createStatus()` from `api.ts`.

### `[x]` 4.3 Wire Feed to fetch statuses from API

`Feed.tsx` calls `fetchStatuses(1, 50)` on mount, maps API statuses to UI format via `mapApiStatusToUI` (author username → name/handle, ISO date → relative time).

### `[x]` 4.4 Handle loading, empty, and error states in Feed

| State | UI |
|---|---|
| Loading | Nothing shown while initial fetch is in flight |
| Empty | Centered message: "No statuses yet. Be the first to share!" |
| Error | Error card with message + Retry button |
| Success | Renders `<For>` with returned statuses |

### `[x]` 4.5 Wire status creation → feed refresh

`CreateStatus` calls `onStatusCreated()` callback on success. `Feed` wires it to `loadStatuses()`, re-fetching the full list.

### Phase 4 — Files created / edited

| File | Action |
|---|---|
| `gui/src/social/lib/api.ts` | Created — typed fetch helpers with auth |
| `gui/src/social/uis/components/CreateStatus.tsx` | Edited — use `createStatus()` from api.ts |
| `gui/src/social/uis/pages/home/Feed.tsx` | Edited — API-driven status loading, state handling, feed refresh |
| `gui/src/social/styles/pages/home/Feed.module.css` | Edited — `.state` + `.stateBtn` for empty/error UI |
