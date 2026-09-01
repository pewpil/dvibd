---
name: orm-workflows
description: >-
  Use this skill when modifying the Prisma database schema in orm/prisma/schema.prisma, running database migrations, or regenerating typed Prisma clients for dvibd api, dvibd gui, and social.
---

# ORM Workflows

This skill provides step-by-step procedures for managing database schema changes and client generation in the `dvibd` repository.

## 1. Modifying the Prisma Schema

The canonical schema is located at `orm/prisma/schema.prisma`.

When adding or updating models:
1. Ensure all generator blocks remain intact:
   - `api-client` (outputs to `../../dvibd/api/src/generated`)
   - `gui-client` (outputs to `../../dvibd/gui/src/generated`)
   - `social-client` (outputs to `../../social/src/server/generated`)
2. Use standard Prisma datatypes and relations.

## 2. Regenerating Clients

After modifying `schema.prisma`, regenerate all client packages:

```bash
cd orm && npm run generate
```

## 3. Creating & Applying Migrations

To create and apply a migration during local development:

```bash
cd orm && npx prisma migrate dev --name <migration_name>
```

## 4. Verification

After generating clients, verify that client consumers typecheck properly:
- In `dvibd/api`: `deno check src/main.ts`
- In `social`: `npx tsc --noEmit`
