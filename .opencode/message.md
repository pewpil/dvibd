# `message` App Notes

### Architecture
- The Message app is a separate app within the `dvibd` workspace. It is distinct from `social`; `social`'s left nav intentionally omits messages because messaging lives here.
- It shares `orm/` (Prisma schema, generated client) and `db/` (Postgres) with the other apps in the project. It does not define its own schema.
- Follow the same self-contained backend pattern as `social` where applicable: auth HTTP routes live directly under `src/routes/(auth)/` with no `/api` prefix; page files stay client-safe (verb handlers live in `(auth)/(endpoints)/`), and server-only modules (bcrypt, prisma, pg, h3) must never be imported into a file with a default page component.

### Layout
- [Document the Message app's page/component layout as development proceeds, mirroring the structure used in `social` (side nav, main content, and any secondary rail) and its CSS Module conventions above.]
