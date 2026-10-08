# `db` Rules & Guidelines

Repository-wide standards and instructions live in the repository root `AGENTS.md`.

## Database Service
- The local test PostgreSQL database is managed via Docker Compose in `db/docker-compose.yml`.
- Database version: `postgres:18-alpine`.
- Container name: `dvibd-db`.

## Configuration & Connection
- Exposed port: `${PORT:-3001}:5432` (host port 3001 maps to container 5432).
- Default credentials:
  - User: `${DB_USER:-dvibd}`
  - Password: `${DB_PASSWORD:-dvibd}`
  - Database: `${DB_NAME:-dvibd}`
- Initialization scripts in `db/init/` are mounted read-only to `/docker-entrypoint-initdb.d:ro`.

## Commands
- Start database:
  ```bash
  cd db && docker compose up -d
  ```
- Stop database:
  ```bash
  cd db && docker compose down
  ```
- Stop and remove data volumes:
  ```bash
  cd db && docker compose down -v
  ```
- Check health:
  ```bash
  cd db && docker compose ps
  ```
- Follow logs:
  ```bash
  cd db && docker compose logs -f
  ```