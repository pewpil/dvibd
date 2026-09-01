---
name: db-management
description: >-
  Use this skill when starting, stopping, resetting, or verifying the health of the local Postgres database service in db/docker-compose.yml.
---

# Database Management

This skill provides procedures for operating the local PostgreSQL test database.

## 1. Starting the Database

To start the PostgreSQL container in the background:

```bash
cd db && docker compose up -d
```

## 2. Checking Status and Health

To check whether the database container is healthy:

```bash
cd db && docker compose ps
```

The container is named `dvibd-db` and exposes port `3001` on localhost.

## 3. Viewing Logs

To view container logs:

```bash
cd db && docker compose logs -f
```

## 4. Stopping the Database

To stop the database container:

```bash
cd db && docker compose down
```

To stop and remove data volumes:

```bash
cd db && docker compose down -v
```
