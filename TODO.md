# Posting Status — Implementation Plan

> Status is the short-form text post (≤256 chars). A separate "post" type with longer content will be added later.

---

## `[x]` Phase 1 — Database Schema

### `[x]` 1.1 Create `src/db/schema/statuses.ts`

Define the `statuses` table in Drizzle:

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK, `defaultRandom()` | Primary key |
| `authorId` | `uuid` FK → `users.id`, NOT NULL | Who wrote it |
| `content` | `varchar(256)`, NOT NULL | Short text, max 256 characters |
| `media` | `jsonb`, nullable | Array of media URLs for future use |
| `replyToId` | `uuid` FK → `statuses.id`, nullable | For reply threads |
| `createdAt` | `timestamptz`, `defaultNow()` | Creation timestamp |

Export `publicColumns` partial and `Status`/`NewStatus` inferred types.

### `[x]` 1.2 Create `src/db/schema/likes.ts`

Define the `likes` join table:

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK, `defaultRandom()` | |
| `userId` | `uuid` FK → `users.id`, NOT NULL | |
| `statusId` | `uuid` FK → `statuses.id`, NOT NULL | |
| `createdAt` | `timestamptz`, `defaultNow()` | |

Add a unique constraint on `(userId, statusId)` to prevent duplicate likes.

### `[x]` 1.3 Update `src/db/schema/index.ts`

Add `statuses` and `likes` table exports to the barrel file.

### `[x]` 1.4 Generate and apply migration

```bash
cd web/api && npm run db:generate && npm run db:migrate
```

---

## `[x]` Phase 2 — Backend API (Status Module)

### `[x]` 2.1 Create `src/modules/status/status.validation.ts`

Zod schemas:

```
createStatusSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(256),
    media: z.array(z.string()).optional(),
    replyToId: z.string().uuid().optional(),
  }),
})
```

- `content` — required, 1–256 characters
- `media` — optional array of image URLs (future uploads)
- `replyToId` — optional UUID for reply threading

### `[x]` 2.2 Create `src/modules/status/status.service.ts`

Three functions:

1. **`createStatus(input, authorId)`** — inserts a row into `statuses` with `authorId`, returns the created status.
2. **`listStatuses({ limit, offset })`** — queries statuses joined with `users` for author info, ordered by `createdAt DESC`, paginated. Returns `{ statuses, total }`.
3. **`getStatusById(id)`** — single status with author, throws `HttpError(404)` if not found.

Uses `db` from `src/db/client.ts` and Drizzle query builder. Author joined via `users` `publicColumns`.

### `[x]` 2.3 Create `src/modules/status/status.controller.ts`

Three handlers:

1. **`createStatusHandler`** — validates body, calls `statusService.createStatus(input, req.user.id)`, responds `201 { status }`.
2. **`listStatusesHandler`** — reads `page`/`limit` from query, calls `statusService.listStatuses(...)`, responds `200 { statuses, total }`.
3. **`getStatusHandler`** — reads `req.params.id`, calls `statusService.getStatusById(id)`, responds `200 { status }`.

### `[x]` 2.4 Create `src/routes/status.ts`

```ts
router.post("/", authMiddleware, validate(createStatusSchema), createStatusHandler);
router.get("/", listStatusesHandler);
router.get("/:id", getStatusHandler);
```

- `POST /` requires auth (only logged-in users can create statuses)
- `GET /` and `GET /:id` are public

### `[x]` 2.5 Register in `src/routes/index.ts`

```ts
router.use("/status", statusRoutes);
```

---

## `[x]` Phase 3 — Frontend: Status Composer UI

### `[x]` 3.1 Create `src/social/uis/components/CreateStatus.tsx`

A glass card above the feed with:

- **Textarea** — multiline input, placeholder "What's on your mind?"
- **Character count** — shows remaining chars (e.g., `142/256`) below the textarea
- **Media button** — placeholder button with image icon (no upload handler yet, just UI)
- **Submit button** — "Post" button, right-aligned, disabled when content is empty or >256 chars
- **Loading state** — button shows "Posting..." while the request is in flight
- **Error state** — inline error message if the request fails

Uses `createSignal` for `content`, `isSubmitting`, `error`.

### `[x]` 3.2 Create `src/social/styles/components/CreateStatus.module.css`

Glass card styling matching the Status component:
- `color-mix(in srgb, var(--surface) 60%, transparent)`
- `backdrop-filter: blur(12px)`
- `border: 1px solid var(--border)`
- `border-radius: 1.1rem`
- `padding: 1.25rem 1.5rem`
- Nested rulesets for textarea, counter, actions row, submit button

### `[x]` 3.3 Place `CreateStatus` in the feed

In `Feed.tsx`, render `<CreateStatus>` above the `<For each={items()}>` block, inside a `<Show when={isAuthenticated()}>` — only visible when logged in.

---

## `[ ]` Phase 4 — Frontend: API Integration

### `[ ]` 4.1 Create `src/social/lib/api.ts`

Typed API helper:

```ts
async function createStatus(content: string): Promise<ApiStatus> { ... }
async function fetchStatuses(page: number, limit: number): Promise<{ statuses: ApiStatus[]; total: number }> { ... }
```

Uses `fetch()`:
- `POST /api/status` — sends `{ content }` JSON, includes `Authorization: Bearer ${accessToken}`
- `GET /api/status?page=1&limit=20` — fetches paginated statuses
- Handles non-OK responses by throwing with the server's error message
- Reads `accessToken` from `localStorage`

### `[ ]` 4.2 Wire CreateStatus to the API

In `CreateStatus.tsx`, the submit handler:
1. Sets `isSubmitting(true)`
2. Calls `createStatus(content())`
3. On success: clears textarea, emits `onStatusCreated(newStatus)` so Feed can prepend it
4. On error: sets `error(message)` state

### `[ ]` 4.3 Wire Feed to fetch statuses from API

In `Feed.tsx`, replace static data with API-driven loading:

```ts
const [statuses, setStatuses] = createSignal<StatusData[]>([]);

onMount(() => {
  fetchStatuses(1, 20).then(({ statuses }) => {
    setStatuses(statuses.map(mapApiStatusToUI));
  });
});
```

### `[ ]` 4.4 Handle loading, empty, and error states in Feed

| State | UI |
|---|---|
| Loading | Nothing or subtle indicator while first fetch is in flight |
| Empty | Centered message: "No statuses yet. Be the first to share!" |
| Error | Error card: "Could not load statuses. [Retry]" |
| Success | Renders the `<For>` with fetched statuses |

### `[ ]` 4.5 Wire status creation → feed refresh

When `CreateStatus` emits `onStatusCreated(newStatus)`, `Feed.tsx` prepends:

```ts
setStatuses((prev) => [mappedStatus, ...prev]);
```

---

## Summary of Files

### New Files (11)

| File | Purpose |
|---|---|
| `api/src/db/schema/statuses.ts` | Statuses table Drizzle schema |
| `api/src/db/schema/likes.ts` | Likes table Drizzle schema |
| `drizzle/*_migration.sql` | Generated auto-migration |
| `api/src/modules/status/status.validation.ts` | Zod schemas |
| `api/src/modules/status/status.service.ts` | Business logic + DB queries |
| `api/src/modules/status/status.controller.ts` | Express handlers |
| `api/src/routes/status.ts` | Route definitions |
| `gui/src/social/lib/api.ts` | Typed API fetch helpers |
| `gui/src/social/uis/components/CreateStatus.tsx` | Status composer component |
| `gui/src/social/styles/components/CreateStatus.module.css` | Composer styles |

### Edited Files (5)

| File | Change |
|---|---|
| `api/src/db/schema/index.ts` | Re-export status & likes tables |
| `api/src/routes/index.ts` | Mount status router |
| `gui/src/social/uis/pages/home/Feed.tsx` | Add CreateStatus, wire API fetch |
