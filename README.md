# el-hodh0d Turborepo

Monorepo with Next.js (web), Expo (mobile), Fastify + Prisma (API), and shared packages.

## Prerequisites

- Node 18+
- npm 10+

## Install

```bash
npm install
```

## Environment

- apps/web/.env.local
  - NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
- packages/api/.env
  - PORT=5000, DATABASE_URL, REDIS_URL, JWT_SECRET, S3_*, CORS_ORIGIN=http://localhost:3000

## Develop

```bash
# desktop only (fast on Windows)
npm run dev:desktop

# or individually
npm run dev:api
npm run dev:web

# everything (includes mobile; may block on Expo prompts)
npm run dev
```

- Web: http://localhost:3001
- API: http://localhost:5000

First-time Prisma setup for API

```bash
npm run -w packages/api prepare:prisma
npm run dev:api
```

## Build

```bash
npm run build
```

Then start individual apps:

```bash
npm --workspace @el-hodh0d/api run start
npm --workspace @el-hodh0d/web run start
```

## Contribution rules

- Any domain change (types, endpoints, hooks, business rules) must live in `packages/types`, `packages/data`, or `packages/logic` so both web and mobile inherit it.
- UI-only changes should be scoped to `apps/web` or `apps/mobile`.
- Update Zod schemas and React Query hooks when API shapes change.
