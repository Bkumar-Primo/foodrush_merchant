<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project structure

## `src/app/` — routes only

Use **route groups** (parentheses) to organize layouts without changing URLs.

```
app/
  layout.tsx              # Root HTML shell, fonts, globals
  globals.css
  (dashboard)/            # Merchant console — URL stays /
    layout.tsx            # DashboardProvider + DashboardShell (header, sidebar, sheets)
    page.tsx              # Tab content only (DashboardMainContent)
  (auth)/                 # Login / onboarding — URL /login, etc.
    layout.tsx
    login/page.tsx
  api/                    # Route handlers only — thin wrappers
    images/search/route.ts
```

- Route handlers call into `src/lib/api/`, not the other way around.
- Do not put feature UI inside `app/` except page entrypoints.

## `src/lib/` — non-UI shared code

```
lib/
  api/          # Server-side fetchers & external integrations
  db/           # Firebase, validators, persistence
  utils/        # cn(), design tokens
```

- Import utils via `@/lib/utils` (barrel).
- Import db via `@/lib/db` (barrel — firebase + validators).
- Import api helpers via `@/lib/api` (barrel).

## `src/components/`

```
components/
  common/       # Reusable primitives (FieldLabel, SearchInput, …)
  dashboard/    # Merchant shell — DashboardProvider, DashboardShell, Header, Sidebar, sheets
  ui/           # shadcn primitives
```

## `src/features/` — domain UI

One feature per folder (`orders/`, `menu/`, …). Colocate components, hooks, and utils under the feature.

```
features/orders/
  components/
  hooks/
  utils/
```

## Other top-level `src/` folders

| Folder      | Purpose                          |
|-------------|----------------------------------|
| `lib/constants/` | App-wide copy, storage keys, timing (`@/lib/constants`) |
| `hooks/`    | App-wide React hooks             |
| `stores/`   | Zustand stores                   |
| `types/`    | Shared TypeScript types          |

## Constants

- **App-wide** (`src/lib/constants/`): brand, auth copy, storage keys, timing, splash bootstrap.
- **Dashboard** (`src/components/dashboard/constants/`): navigation, settings, dialogs, notifications.
- **Features** (`src/features/<domain>/constants/`): domain labels, tabs, UI copy.
- Import via barrels (`@/lib/constants`, `@/features/orders/constants`). Do not hardcode user-facing strings or magic numbers in components.
