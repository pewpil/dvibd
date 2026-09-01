# `dvibd` Workspace Memory & Remembered Context

This file contains persistent memory, learned rules, and calibration contexts across the `dvibd` repository.

## Viewport Percentage Calibration
- When converting px to %, the user's browser viewport is the primary reference so sizing cascades proportionally to descendants (percentage sizing is relative to parent).
- Calibrate the % value so it corresponds to the pixel size relative to the target viewport:
  - **1440px Desktop Viewport**:
    - `120px` -> `8.3%`
    - `56px` -> `3.9%`
    - `48px` -> `3.3%`
    - `40px` -> `2.8%`
    - `24px` (`--space`) -> `1.7%` (widened to `6%` so page content does not hug viewport edges)
    - `1100px` (`--width`) -> `76.5%`
    - `16px` fixed toggle top -> `1.8%` of viewport height
  - **760px Mobile Viewport**:
    - `64px` -> `8.4%`
- **Units Policy**:
  - Forbidden to use `px` except explicitly for `border-radius`.
  - Media-query breakpoints (e.g. `760px`) are expressed in `rem` (`47.5rem`).
  - Gaps, borders, shadows, blur, and font-sizes use `rem`.
  - All element dimensions, widths, heights, margins, and paddings must use `%`.

## Monorepo Context Memory
- **Self-Contained Backend Ecosystems**: Both `social` and `message` maintain independent self-contained backends with their own auth routes, session tokens, and middleware. They never proxy or relay through `dvibd/api`.
- **Database Centralization**: All apps share the single PostgreSQL instance in `db/` and derive their Prisma clients from `orm/prisma/schema.prisma`.
- **App Boundary**: The `social` app left navigation intentionally omits messages because all messaging functionality lives in the standalone `message` app.
