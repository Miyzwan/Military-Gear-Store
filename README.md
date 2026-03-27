# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Military gear and uniform e-commerce website for Indonesian market.

## Monorepo Structure

```
warzone-tactical/
├── artifacts/
│   ├── api-server/          → Express 5 REST API (backend)
│   │   └── src/
│   │       ├── routes/      → API route handlers (products, categories, settings, auth)
│   │       ├── middlewares/ → Express middlewares (auth.ts = requireAdmin)
│   │       ├── lib/         → Session config, admin seed
│   │       └── app.ts       → Express app config (CORS, session, routes)
│   └── militer-store/       → React+Vite storefront (public + admin)
│       └── src/
│           ├── pages/
│           │   ├── home.tsx, catalog.tsx, product-detail.tsx   ← public
│           │   └── admin/                                      ← admin (protected)
│           ├── components/
│           │   ├── layout/  → PublicLayout, AdminLayout
│           │   ├── auth/    → ProtectedRoute
│           │   └── ui/      → shadcn UI components
│           ├── contexts/    → AuthContext (session state)
│           ├── services/    → apiFetch, formatPrice, buildWhatsAppUrl (NO business logic in components)
│           └── config/      → constants (routes, sort options, store defaults)
│
├── lib/                     → Shared generated packages (auto-generated — do not edit manually)
│   ├── api-spec/            → OpenAPI YAML spec (source of truth for API contract)
│   ├── api-zod/             → Zod schemas + TypeScript types (generated from OpenAPI)
│   ├── api-client-react/    → TanStack Query hooks (generated from OpenAPI)
│   └── db/                  → Drizzle ORM schema + DB client
│
├── packages/
│   └── shared/              → Shared types, utils, config (hand-maintained)
│       └── src/
│           ├── types/       → Re-exports domain types from api-zod
│           ├── utils/       → formatPrice, formatDate, buildWhatsAppUrl, truncate
│           └── config/      → Constants shared across packages
│
├── scripts/                 → Code generation scripts (orval, openapi-codegen)
├── .env.example             → Template for required environment variables
└── pnpm-workspace.yaml      → Workspace roots: artifacts/*, lib/*, packages/*, scripts
```

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui

## Project: WARZONE TACTICAL - Military Store

A tactical gear and uniform e-commerce website targeting the Indonesian market.

### Key Features
- Public storefront with hero, product catalog, category filter, search, product detail
- WhatsApp purchase redirect ("Beli Sekarang" button opens wa.me with pre-filled message)
- Admin dashboard (/admin) for product, category, and store settings management
- Dark military theme: charcoal black, olive green, amber/gold accents

### Pages
- `/` — Home (hero, featured products, categories, about, contact)
- `/produk` — Product catalog with category filter + search
- `/produk/:id` — Product detail with WhatsApp buy button
- `/admin` — Admin dashboard (stats overview)
- `/admin/products` — Product management CRUD
- `/admin/products/new` — Add product form
- `/admin/products/:id/edit` — Edit product form
- `/admin/categories` — Category management
- `/admin/settings` — Store settings (name, WhatsApp number, hero content, contact info)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── militer-store/      # React Vite frontend (military store)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

- `categories` — Product categories (name, description, slug, imageUrl)
- `products` — Products (name, description, price, imageUrl, categoryId, stock, featured, isActive)
- `store_settings` — Store config (storeName, whatsappNumber, heroTitle, heroSubtitle, address, email, etc.)

## Authentication

Admin authentication uses **express-session** with a PostgreSQL session store.

- Sessions are stored in the `admin_sessions` table (auto-created)
- Passwords are hashed with **bcrypt** (12 salt rounds)
- Session cookie: `warzone.sid` (httpOnly, sameSite=lax, 7 days)

### Credentials & Secrets

| Where | Variable | Purpose |
|---|---|---|
| Replit Secret | `SESSION_SECRET` | Signs the session cookie (auto-generated) |
| Replit Env | `ADMIN_USERNAME` | Admin login username |
| Replit Env | `ADMIN_PASSWORD` | Admin login password |

**To change admin credentials:** Update `ADMIN_USERNAME` and/or `ADMIN_PASSWORD` in the Replit Secrets/Env tab, then restart the API server. The server auto-syncs the account on every startup via `src/lib/adminSeed.ts`.

**Never hardcode credentials** — always use env vars.

### Subdomain split readiness
To isolate admin to `admin.warzone.id` later:
1. Extract `/api/auth` + write routes to a separate Express app
2. Keep only public GET routes on the main server
3. Update CORS `origin` to allow the admin subdomain

## API Endpoints

- `GET /api/healthz` — Health check
- `GET/POST /api/products` — List/create products (supports ?categoryId, ?search, ?featured filters)
- `GET/PUT/DELETE /api/products/:id` — Product CRUD
- `GET/POST /api/categories` — List/create categories
- `PUT/DELETE /api/categories/:id` — Category CRUD
- `GET/PUT /api/settings` — Store settings

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. Run `pnpm run typecheck` from root.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build`
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client and Zod schemas

## Packages

### `artifacts/militer-store` (`@workspace/militer-store`)
React + Vite military store frontend. Tailwind CSS + shadcn/ui components.
- Entry: `src/main.tsx`
- App: `src/App.tsx` — wouter routing, React Query provider
- Pages: `src/pages/` — home, catalog, product-detail, admin/dashboard, admin/products, admin/categories, admin/settings

### `artifacts/api-server` (`@workspace/api-server`)
Express 5 API server. Routes live in `src/routes/`.
- Depends on: `@workspace/db`, `@workspace/api-zod`

### `lib/db` (`@workspace/db`)
Database layer using Drizzle ORM with PostgreSQL.

### `lib/api-spec` (`@workspace/api-spec`)
OpenAPI 3.1 spec + Orval codegen config.
