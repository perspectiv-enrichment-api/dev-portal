# AGENTS.md

Guidance for AI agents working in this repository.

## Agent conduct

- **Do only what was asked.** Don't refactor, rename, restyle, or "improve" code beyond the scope of the request. If you notice something worth fixing, mention it — don't fix it unprompted.
- **Don't re-read files you've already read** in the same session. Keep token usage low: read only the files (and only the portions) needed for the task.
- **Never add, remove, upgrade, or swap dependencies without explicit permission.** This includes editing `package.json` dependencies and regenerating lockfiles.
- **npm is the active package manager** (it installed `node_modules` and maintains `package-lock.json`). The `pnpm-lock.yaml` is stale — don't install with pnpm or regenerate it.

## Project overview

This is **perspectiv-portal** (a.k.a. dev-portal): a Next.js 16 App Router developer portal for the Perspectiv API — auth, project management, API key management, and usage analytics. React 19, TypeScript, Tailwind CSS v4, shadcn/ui (new-york style, config in `components.json`).

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (type-checks the project; there is no separate check needed, but `npx tsc --noEmit` is faster for type-checking alone)
- `npm run start` — serve the production build
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`) with `next/core-web-vitals` + `next/typescript`. The React Compiler strictness rules (`react-hooks/set-state-in-effect`, `react-hooks/purity`) are downgraded to warnings because the app's hydrate-from-localStorage pattern and vendored shadcn components trip them; don't re-promote them to errors without fixing those first.
- `npm run pm2-start` — production process management via pm2 (`ecosystem.config.js`, deploys from `/var/www/ui-apps/dev-portal`)

There is no test framework configured.

## Environment

`.env.local` (not committed):

- `NEXT_PUBLIC_API_URL` — backend base URL (defaults to `http://localhost:4000` in `lib/api.ts`)
- `NEXT_PUBLIC_MOCK_SESSION=true` — mock mode: `authStore` returns a fake user and `"mock_access_token"` without hitting the backend. Useful for UI work without a running API.

## Architecture

Everything is client-side (`"use client"`); there are no server actions or API routes in this app — it talks to an external REST backend at `NEXT_PUBLIC_API_URL`.

### API layer — `lib/api.ts`

Single typed API client. A private `request<T>()` wrapper handles JSON headers, bearer tokens, error normalization (throws `Error` with `status` and `data` attached), and **automatic one-shot retry after token refresh on 401**. Endpoints are grouped into exported objects: `authApi`, `usersApi`, `keysApi`, `projectsApi`, `usageApi`. Shared types (`User`, `Project`, `ApiKey`, `Tokens`, `UsageRecord`, …) live here too. Add new endpoints to the matching group; don't call `fetch` directly from components.

### Auth — `lib/auth-*.ts`

- `lib/auth-storage.ts` — raw localStorage read/write for tokens and user, plus a custom auth-change event.
- `lib/auth-store.ts` — the main entry point. `authStore.token()` is **the** way to get an access token: it decodes the JWT locally, refreshes proactively if expired (60s skew), and clears storage + triggers `handleAuthFailure()` on refresh failure. Also exports `dicebearUrl()` for user avatars (`lib/project-avatar.ts` has the project equivalent).
- `lib/auth-context.tsx` — `AuthProvider`/`useAuth` React context that syncs the user across tabs via storage/auth-change events.
- `lib/auth-failure.ts` — centralized redirect-to-login on unrecoverable auth failure.

Typical data-fetch pattern in pages: `const token = await authStore.token(); const res = await someApi.list(token);`

### Routes — `app/`

- `app/auth/*` — login, register, onboarding, OTP verification, password reset, OAuth callback (shared `app/auth/layout.tsx`).
- `app/dashboard/*` — projects list, project detail (`projects/[uid]`), API keys, analytics, settings. `app/dashboard/layout.tsx` provides the sidebar/header shell and wraps children in `DashboardProvider` (`app/dashboard/dashboard-context.tsx`), which holds the shared projects list, `refreshProjects()`, the create-project dialog state, and slot-style `headerContent` that pages inject into the shared header.

### UI

- `components/ui/*` — shadcn/ui primitives; treat as vendored, prefer not to hand-edit.
- `components/*` — app-specific components (create-project dialog, project logo, theme toggle, …).
- Path alias `@/*` maps to the repo root. Icons come from `lucide-react`; toasts from `sonner`.
