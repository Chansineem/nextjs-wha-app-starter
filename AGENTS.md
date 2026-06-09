
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

> The rule above is load-bearing: this is **Next.js 16** + **React 19**. APIs and conventions differ from older versions. Before writing Next.js code, read the relevant guide under `node_modules/next/dist/docs/`.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (flat config via eslint-config-next)

npx prisma generate   # regenerate the client into ./generated/prisma (REQUIRED after schema changes)
npx prisma migrate dev --name <name>   # create + apply a migration
npx prisma db pull    # introspect the existing MySQL/MariaDB DB back into schema.prisma
```

There is no test runner configured in this project.

`DATABASE_URL` must be set (a MySQL/MariaDB connection string). It is read via `dotenv` in `src/lib/prisma.ts` and `prisma.config.ts`.

## Architecture

This is a Thai-language e-commerce / course app on the Next.js App Router.

### Prisma 7 with a driver adapter — non-standard client location
- The Prisma client is generated to **`generated/prisma`** (repo root), NOT `node_modules/@prisma/client`. Always import the client from there: `src/lib/prisma.ts` does `from "../../generated/prisma/client"`. After any schema edit you must run `npx prisma generate` or imports break.
- The DB connection uses the **MariaDB driver adapter** (`PrismaMariaDb`), not Prisma's built-in engine. `schema.prisma` has `provider = "mysql"` with **no `url`** — the URL is supplied at runtime via the adapter and in `prisma.config.ts`.
- `src/lib/prisma.ts` exports a global singleton (`globalThis.prismaGlobal`) to survive dev hot-reload. Import the default export, never `new PrismaClient()`.
- The schema mixes two domains: introspected **e-commerce** tables (`products`, `categories`, `orders`, `order_items`, `product_images`, `customers` — snake_case, lowercase model names) and **better-auth** tables (`User`/`Session`/`Account`/`Verification`, `@@map`ed to lowercase). Treat the e-commerce models as introspected: prefer `prisma db pull` over hand-editing if the DB is the source of truth.

### Auth — better-auth (not NextAuth)
- Server instance: `src/lib/auth.ts` (`betterAuth` + `prismaAdapter`, email/password, min password length 8, `autoSignIn: false`).
- Client: `src/lib/auth-client.ts` exports `authClient` (`createAuthClient` from `better-auth/react`). Use `authClient.signIn.email(...)`, etc., from client components with `onSuccess`/`onError` callbacks.
- All auth HTTP is handled by the catch-all route `src/app/api/auth/[...all]/route.ts` via `toNextJsHandler`.

### Routing — two route groups, each its own root layout
- `src/app/(front)/` — public storefront. Its `layout.tsx` is the real root layout (`<html lang="th">` + `<body>` + `Navbar`).
- `src/app/(auth)/` — login/signup, separate layout.
- `(front)/components/` holds page-scoped components (`app-*`); shared/global UI lives in `src/components/` and `src/components/ui/`.
- `loading.tsx` files provide Suspense fallbacks for route segments.

### Caching
- `next.config.ts` sets `cacheComponents: true` (the Next.js component-caching / `"use cache"` model). Be deliberate about data fetching and cache semantics — consult the Next docs before adding `fetch`/cache logic.
- Allowed remote image hosts are whitelisted in `next.config.ts` (`www.fffuel.co`, `api.codingthailand.com`); add hosts there before using `next/image` with new domains.

### State & data patterns
- **Cart**: client-side Zustand store with `persist` middleware → localStorage key `skill-cart` (`src/lib/cart-store.ts`). Selector helpers `totalItems()` / `totalPrice()`.
- **External data**: course data comes from the external `api.codingthailand.com` API, wrapped in a service layer under `src/services/` (e.g. `course-service.ts` exposing typed `getCourses()`). Put external API access in `src/services/`, not inline in components.
- **Forms**: react-hook-form + Zod via `@hookform/resolvers/zod`, using the `Controller` component with shadcn `Field`/`FieldError` primitives. Zod validation messages are written in Thai.

### UI
- shadcn/ui (style `radix-luma`, base color `mist`, RSC enabled, icons from **remixicon** + lucide). Generated primitives live in `src/components/ui/` — re-add/update via the `shadcn` CLI rather than hand-rolling. Path alias `@/*` → `src/*`. Tailwind v4 (PostCSS plugin, no `tailwind.config`; theme in `src/app/globals.css`).

## Commit conventions

Follow [Conventional Commits](https://www.conventionalcommits.org). A template is configured at `.gitmessage` (`git config commit.template .gitmessage`).

```
<type>: <imperative summary, ≤72 chars, no trailing period>
                                    ← blank line
<body: explain WHY, not what — the diff already shows what. Wrap ~72 chars.>
                                    ← blank line
<footer: Fixes #123 / BREAKING CHANGE: ... / Co-Authored-By: ...>
```

- **type** — one of `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `style`, `perf`.
- **Imperative mood** — "Add", "Fix", "Move" (not "Added"/"Adds").
- **Atomic commits** — one logical change per commit. Stage specific paths (`git add <files>`), not `git add .`, so unrelated working-tree changes don't leak in.
- Don't mix reformatting with logic changes in the same commit.
