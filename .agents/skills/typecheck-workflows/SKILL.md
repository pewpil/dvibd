---
name: typecheck-workflows
description: >-
  Use this skill when verifying type correctness across workspaces in the dvibd repository, including Deno type checks for dvibd/api and Node/TypeScript type checks for social, message, and dvibd/gui.
---

# Typecheck Workflows

This skill outlines how to run type checking for each workspace in the repository.

## Workspace Matrix

Workspace | Runtime | Command
:--- | :--- | :---
`dvibd/api` | Deno | `cd dvibd/api && deno check src/main.ts`
`dvibd/gui` | Node / Vite | `cd dvibd/gui && npx tsc -b`
`social` | Node / SolidStart | `cd social && npx tsc --noEmit`
`message` | Node / Next.js | `cd message && npx tsc --noEmit`

## Important Rules

1. **Never run `deno check` in `social/` or `message/`**: These are Node-based applications and must be type-checked with TypeScript (`tsc --noEmit`).
2. **Never skip type declarations**: All variables, parameters, and function returns across all codebases must be explicitly typed.
