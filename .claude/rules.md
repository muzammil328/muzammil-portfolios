# Project Rules

## Code Style
- Always place import statements at the top of the file, grouped with existing imports. Never add an import inline in the middle of the file.
- Avoid hardcoded magic numbers unless clearly intentional.
- Do not ignore TypeScript errors with comments unless there is a documented reason.

## HTML Structure
- Heading tags (h1-h6) must follow strict document order, no skipped levels. Never pick a heading tag for something just because its default font-size looks right — decorative or rotated captions ("Follow", small vertical labels) should be span/p, not headings. Do not use heading tags for visual styling; use CSS classes instead.
- List children must be `<li>` (or `<script>`/`<template>`). Never put `<button>`, `<div>`, or other elements directly inside `<ul>`/`<ol>` — wrap them in `<li>` first, even if it's a nav rendered as inline buttons.

## Accessibility
- All interactive elements (buttons, links, inputs, custom controls) must be keyboard-accessible, have visible focus states, and clear accessible names.
- Do not use clickable `<div>` or `<span>` elements — use `<button>` or `<a>` where appropriate.
- Images must have meaningful `alt` text; decorative images use `alt=""`.
- Form inputs must have an associated `<label>`.
- Do not rely on color alone to communicate state, errors, warnings, or success.

## React / Component Structure
- Keep components focused and small; split large components up.
- Avoid duplicating logic across components — extract shared behavior into utilities, hooks, or reusable components.
- Do not define components inside other components unless there's a clear reason.
- Keep props explicit and readable; avoid passing large unrelated objects when only a few fields are needed.
- Prefer derived values over extra state when the value can be calculated from existing state or props.

## State Management
- Keep state as close as possible to where it's used.
- Do not store values in state if they can be derived during render.
- Avoid deeply nested state objects when simpler structures are possible.
- Use clear loading, empty, error, and success states for async UI.

## Styling
- Reuse existing design tokens, spacing, colors, and typography before adding new styles.
- Keep responsive behavior in mind for all layout changes.
- Avoid overly specific CSS selectors that make future overrides difficult.

## Type Safety
- Avoid `any` unless absolutely necessary — prefer precise types over broad generic ones.
- Keep shared types in appropriate type files instead of redefining them in multiple places.
- Validate external or user-provided data before relying on it.

## Forms
- Every form input must have an associated label.
- Show validation errors close to the field they refer to.
- Disable submit actions only when there's a clear reason, and give feedback when submission is blocked.
- Prevent duplicate submissions during async requests.
- Preserve user-entered values when validation fails.

## Performance
- Avoid unnecessary re-renders caused by unstable inline objects/functions passed to memoized children.
- Do not perform expensive calculations directly in render without memoization.
- Lazy-load heavy components only when it improves user experience.
- Avoid fetching the same data repeatedly when it can be cached or reused.
- Keep bundle size in mind when adding new libraries.

## Data Fetching
- Always handle loading, error, empty, and success states.
- Keep API calls in dedicated functions or services when possible.
- Do not hardcode API URLs in components if a shared config exists.
- Avoid making requests in loops when they can be batched.
- Cancel or ignore stale async responses when component state may change before the request completes.

## Error Handling
- Never swallow errors silently (empty catch blocks) — log or surface them clearly.

## Testing
- Add or update tests when changing business logic.
- Test user-visible behavior rather than implementation details.
- Include edge cases, empty states, and error states when relevant.
- Do not remove tests unless the related behavior is intentionally removed.
- Keep tests deterministic and avoid relying on timing when possible.

## Naming
- Use clear, descriptive names for variables, functions, components, and files.
- Boolean variables should read naturally, such as `isOpen`, `hasError`, or `canSubmit`.
- Avoid vague names like `data`, `item`, `thing`, or `handleClick` when more specific names are available.
- Name components by what they represent, not where they are used.
- **Files**: kebab-case (e.g. `user-profile.ts`, `auth-service.ts`).
- **Folders**: kebab-case (e.g. `user-settings/`, `order-history/`).
- **Components**: PascalCase, matching the component name exactly (e.g. `UserProfile.tsx`, `NavBar.tsx`).
- **Pages/routes**: follow the existing project/framework convention (e.g. Next.js `page.tsx` inside a kebab-case route folder like `user-profile/page.tsx`).
 
## Comments
- Write comments only when they explain why something exists, not what the code already says.
- Remove stale or misleading comments.
- Do not leave commented-out code in committed changes.
- Use TODO comments only when they include enough context to be actionable.

## Secrets & Security
- Never hardcode API keys, tokens, passwords, or secrets in code. Use environment variables and reference `.env` (never commit `.env` files).
- Never print or log secret values or sensitive user data, even for debugging.
- Sanitize or validate user-generated content before rendering it.
- Use existing authentication and authorization helpers instead of creating ad hoc checks.
- Treat data from external APIs as untrusted.

## Git / Version Control
- Keep changes scoped to the requested task. Do not reformat unrelated files, rename files, or move code unless necessary.
- Avoid large unrelated refactors while fixing a small issue.
- Leave existing behavior unchanged unless the task explicitly requires changing it.
- Never run `git push`, `git commit --amend`, `git reset --hard`, or force-push commands without asking first.
- Never commit directly to `main`/`master` — use a feature branch unless told otherwise.

## Commands
- Never run install, build, deploy, dependency-update, destructive (delete files, reset git history, clear databases, overwrite generated assets), or repo-wide formatting/lint-fix commands. If one needs to run, tell the user exactly what command to run — do not execute it.
- Prefer reading files and making targeted edits over broad automated changes.

## File Changes
- Never delete files or directories without confirming first.
- Never rewrite a whole file for a small change — use targeted edits.