<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Core Agent Rules & Guidelines

## 1. Strict Permission & User Confirmation

- Never perform actions, create unexpected files, or make significant modifications without explicit user permission.
- Always ask for confirmation or provide a clear plan before proceeding with major changes.

## 2. Precise Scope (Only Make What Is Requested)

- Only build exactly what the user explicitly asks for.
- Do not introduce unsolicited features, boilerplate bloat, or unrelated refactorings.
- Follow the user's total instruction completely and faithfully.

## 3. DRY Principle (Don't Repeat Yourself) & Code Readability

- Always adhere to the DRY principle: eliminate duplicate logic, styles, and templates.
- Maintain clean, highly readable, and maintainable code with clear naming and structure.

## 4. Reusable & Modular Components

- Prioritize creating reusable, composable, and modular components for UI and shared utilities.
- Avoid tightly-coupled, one-off monoliths when reusable patterns can be cleanly applied.
