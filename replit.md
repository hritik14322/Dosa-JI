# Dosa Ji

A full-stack fast-food restaurant web app featuring dosas, pizzas, burgers, and rolls. Customers can browse the menu, add to cart, checkout (with mock Razorpay payment), and track orders. Shopkeepers manage menus and orders. Admins have full control over users, coupons, and analytics.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/dosaji run dev` — run the frontend (proxied at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — seed database with initial menu items and users
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui (warm amber/cream theme)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Auth: JWT (stored in localStorage), `setAuthTokenGetter` from custom-fetch
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle table definitions (users, menu_items, orders, coupons)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/lib/auth.ts` — JWT helpers and middleware
- `artifacts/dosaji/src/` — React frontend
- `artifacts/dosaji/src/contexts/AuthContext.tsx` — auth state + localStorage + setAuthTokenGetter
- `artifacts/dosaji/src/contexts/CartContext.tsx` — cart state (localStorage)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks

## Architecture decisions

- JWT auth stored in localStorage; `setAuthTokenGetter` in AuthContext automatically injects Bearer tokens into all API calls via the generated custom-fetch client.
- Cart is client-side only (no DB table) — stored in localStorage via CartContext.
- Payment is mock Razorpay in dev — creates a fake `rzp_mock_*` order ID and bypasses the Razorpay SDK. Real keys can be set via `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
- DB schema uses Drizzle ORM with `numeric` for all monetary values; serialized as `parseFloat()` in route responses to match the OpenAPI `number` type.
- Orders store `items` and `deliveryAddress` as JSONB columns.

## Product

- **Customer:** Browse menu → add to cart → checkout with address + coupon → mock payment → order confirmation + order history
- **Shopkeeper:** Today's stats, order queue with status updates, menu availability toggles and CRUD
- **Admin:** All stats + revenue/orders charts, full user management (roles, active status), coupon management, full menu and order management

## Default credentials (from seed)

- Admin: `admin@dosaji.com` / `admin123`
- Shopkeeper: `shop@dosaji.com` / `shop123`
- Customer: `customer@dosaji.com` / `customer123`

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any OpenAPI spec change, always run codegen then `typecheck:libs` before checking artifact packages.
- The `pg` and `drizzle-orm` catalog entries exist; `scripts/package.json` uses explicit versions instead to avoid catalog resolution issues with tsx.
- Dynamic `razorpay` import in payment route uses `as any` cast to avoid missing type declarations at compile time.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
