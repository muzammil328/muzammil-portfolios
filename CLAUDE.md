# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # start Next.js dev server (http://localhost:3000)
pnpm build            # production build
pnpm start            # run production build
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
pnpm sanity           # Sanity CLI
pnpm sanity:dev       # Sanity Studio dev server (standalone, outside Next)
pnpm sanity:doctor    # Sanity project health check
pnpm sanity:build     # build Sanity Studio
pnpm sanity:export    # export Sanity data via src/app/output/sanityData.ts
```

There is no test runner configured in this repo (no `test` script, no test files) — don't assume Jest/Vitest exists.

The embedded Sanity Studio is also reachable inside the running Next app at `/studios/[[...tool]]` (see `src/app/studios/[[...tool]]/page.tsx`), separate from running `pnpm sanity:dev` standalone.

## Architecture

**Content flow:** Sanity CMS → `src/services/*Service.ts` (GROQ queries via `src/sanity/lib/client.ts`) → React Server Components in `src/app/**/page.tsx` → passed as props into client components in `src/features/home/*` and shared display components in `src/components/*`. Sanity schema definitions live in `src/sanity/schemaTypes/*` (project, service, post, skill, education, experience, category, author, block content) and are registered in `src/sanity/schemaTypes/index.ts`. Types mirroring the Sanity documents live in `src/types/*` (`Project`, `Service`, `Post`, `Profile`).

**Home page composition** (`src/app/page.tsx`) stacks feature sections in this order: `HeroSection` → `FollowMeBox` → `ProfessionalJourney`/`Education` (side-by-side grid) → `WhatIDo` → `HorizontalProjects` → `Blog` → `ContactSection` → `Footer`. Each section independently fetches its own Sanity data client-side (`useEffect` + service call) and falls back to hardcoded `FALLBACK_*` content/defaults when Sanity returns nothing — check for `FALLBACK_FOCUS`, `FALLBACK_DELIVERABLES`, `FALLBACK_STATS` in `WhatIDo.tsx` and `defaultProfile` in `HeroSection.tsx` as the pattern to follow when adding new sections.

**UI component library** at `src/components/ui` (barrel-exported via `src/components/ui/index.ts` → re-exports `components/`, `forms/`, `icons/`, `theme/`). Always import from `@/components/ui`, not deep file paths. Built on Radix UI primitives + `class-variance-authority` for variants + `tailwind-merge`/`cn` (`src/lib/cn.ts`) for class merging. The `Button` component (`src/components/ui/components/button/button.tsx`) supports `asChild` (via Radix `Slot`) for rendering a `Link` styled as a button — see the gotcha below.

**Styling:** Tailwind CSS v4, config-less (no `tailwind.config.js`) — theme tokens (`--color-*`, `--radius`, etc.) are defined via `@theme inline` and `:root`/`.dark` CSS custom properties directly in `src/app/global.css`. Dark mode is class-based (`@custom-variant dark (&:is(.dark *))`) and toggled by `next-themes` (see `src/components/DarkLightModeButton.tsx`, mounted globally in `src/components/Provider.tsx`).

**Contact form → MongoDB:** `src/features/home/ContactSection.tsx` posts to `src/app/api/contact/route.ts`, which uses `src/lib/mongodb.ts` (cached Mongoose connection, expects `MONGODB_URI` env var) and the `ContactForm` model (`src/models/ContactForm.ts`). This is the only Mongoose/API-route pair in the app currently — don't assume other backend/auth infrastructure exists beyond this.

**Images:** `next.config.ts` only allows remote images from `cdn.sanity.io`; local images live in `public/`. `trailingSlash: true` is set, and `turbopack.root` points outside this directory — be aware builds may warn about turbopack root resolution.

## Rules (general — apply across projects, not just this one)

- **Icon-only buttons/links must have `aria-label`.** Any interactive element whose only content is an icon/SVG (social links, close/scroll-to-top buttons, external-link icons) needs an accessible name. Lighthouse/axe flag these under "Names and labels".
- **Avoid fixed pixel-based sizing on elements that must respond to viewport width** (fixed `width`/`height` in px, or utility classes like `w-120 h-120`). Use `max-width` + `width: 100%`/`w-full` + breakpoint overrides so nothing overflows on mobile.
- **Multi-column grids need a mobile fallback.** A bare `grid-cols-2`+ with no responsive prefix is fine only for small in-card mini-content (2-4 short items); anything that lays out full sections/components side-by-side needs `grid-cols-1` on mobile and `md:`/`lg:grid-cols-N` up.
- **Keep same-role interactive elements the same size and edge offset.** If two floating/fixed controls (e.g. a theme toggle and a social rail) sit at opposite corners, mirror their diameter and inset (`left-4` / `right-4`) rather than leaving one flush at `0`.
- **Prefer the project's shared component library over hand-rolled markup** for buttons/links/inputs, so styling and accessibility fixes only need to happen in one place. When a link needs to look like a button, render the button component with an "as child" / slot pattern wrapping the actual `<a>`, rather than copy-pasting the button's classes onto the link.
- **When a component supports an "as child" / slot pattern, don't wrap `children` in extra fragments or conditional JSX when that mode is active.** The slot implementation usually expects to clone props onto exactly one real element; wrapping it (even in a `<>...</>`) breaks prop/class forwarding silently — no error, just missing styles.
- **Don't assume headless-browser tooling (Playwright, Puppeteer) is installed in the environment.** Try it, but have a fallback of manual review (reading the Tailwind classes / JSX structure) so a missing dependency doesn't stall the task.
- **`priority` on `next/image` does not automatically set `fetchPriority="high"`** in this Next.js version — pass it explicitly on LCP images.
- **Don't set `unoptimized` on `next/image`** unless you have a specific reason to bypass Next's resize/format optimization — it forces the browser to download the full-size source file.
- **After UI changes, mentally re-run Lighthouse's common categories**: Accessibility (names/labels, contrast, heading order, list structure), Best Practices, and mobile Performance/CLS — these are the categories that regress most often from quick UI edits.

## Known gotcha: `Button` + `asChild`
`src/components/ui/components/button/button.tsx` renders `asChild ? children : (...)` — when `asChild` is true, `children` must be passed through directly to Radix's `Slot` as a single element. Don't wrap `children` in extra fragments/conditionals when `asChild` is set, or `Slot`'s prop/class merging silently breaks (renders as a bare unstyled element).

## Verifying changes
- No Playwright/browser automation available in this env by default — rely on manual code review of Tailwind responsive classes and structural HTML (heading order, list structure, aria-labels) rather than assuming a headless browser check is available.
- Check PageSpeed Insights / Lighthouse "Accessibility" and "Best Practices" categories after UI changes — recurring issues here: missing accessible names on icon-only controls, heading order, non-`li` list children.
