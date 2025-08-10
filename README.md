# RWSDK-Guestbook (Fullstack RedwoodSDK Cloudflare Example)

This repo contains a fullstack example to build on Cloudflare with the following stack.

## Stack

- **RedwoodSDK**: A React framework to run React 19 with SSR, RSC, and server functions on Cloudflare
- **Drizzle ORM**: Lightweight, type-safe SQL ORM with migrations
- **better-auth**: Simple, flexible authentication library — this example is set up to use Email OTP plus Google and GitHub
- **Alchemy**: TypeScript-native Infrastructure-as-Code
- **shadcn/ui**: Composable, accessible UI components
- **Bun**: Fast JavaScript all-in-one toolkit

## Resources

- **D1**: Primary database (SQLite/D1)
- **R2**: Avatar/file storage (served via `/r2/avatars/:key`)
- **Workers**: Website running on Cloudflare Workers using RedwoodSDK

All required resources are configured via Alchemy in `alchemy.run.ts`.

## Credits

- **Nick Balestra-Foster**: This example is inspired by Nick's repo (`https://github.com/nickbalestra/fullstack-cf-example`).
- **MJ Meyer**: Also inspired by MJ's repo (`https://github.com/mj-meyer/rwsdk-better-auth-drizzle`).
  - Check `types/env.d.ts` to see how IaC defines our types (no need to generate types with Wrangler)
  - Check `alchemy.run.ts` to see how the whole infra is defined as code via Alchemy

## Getting Started

### 1. Create your new project

```shell
git clone https://github.com/oscabriel/rwsdk-guestbook
cd rwsdk-guestbook
bun install
```

### 2. Set up your environment variables

This project uses separate env files for development and production.

Create `.env.dev` (used by `bun dev`):

```bash
ALCHEMY_STAGE=dev

# Required for Alchemy local secret encryption
ALCHEMY_PASSWORD=your-secure-password

# Better Auth
BETTER_AUTH_SECRET=your-better-auth-secret

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
```

Create `.env.prod` (used by `bun infra:up` and prod tooling):

```bash
ALCHEMY_STAGE=prod

ALCHEMY_PASSWORD=your-secure-password

# Better Auth
BETTER_AUTH_SECRET=your-better-auth-secret

# Social Providers
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Email (Resend)
RESEND_API_KEY=...

# Domain (optional but recommended for prod)
CUSTOM_DOMAIN=custom-domain.com
CLOUDFLARE_ZONE_ID=...

# Drizzle (prod migrations)
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_DATABASE_ID=...
CLOUDFLARE_API_TOKEN=...
```

### 3. Set up local dev environment, then launch the dev server

```shell
bun dev:init
bun dev
```

The application will be available at the URL displayed in your terminal (typically `http://localhost:5173`).

### 4. Deploy to Cloudflare

This will provision all the resources needed (DB, R2 bucket, worker) and deploy the app. The application will be available at the Cloudflare URL displayed in your terminal (or your `CUSTOM_DOMAIN` if configured).

```shell
bun infra:up
```

To tear everything down in production:

```shell
bun infra:down
```

## Application Routes

Key routes include:

- `/` — Landing page if unauthenticated; Guestbook when authenticated
- `/profile` — User profile management with device session control (requires authentication)
- `/sign-in` — Authentication page with Email OTP and social login options

API routes:

- `/api/auth/*` — better-auth handler
- `/r2/avatars/:key` — Serves avatar images from R2 with long-lived caching

Protected routes use interruptor-based authentication middleware.

## Authentication Flow

This example includes a complete authentication system with:

- Email OTP for signup and login (via Resend)
- Social authentication (Google & GitHub OAuth)
- Native better-auth session management with database persistence
- Protected routes with interruptor-based authentication
- Multi-device session support with proper logout functionality

## Database Configuration

### Local Development

The project uses Cloudflare D1 (SQLite) with Drizzle ORM. A local database is created during `bun dev:init` and used automatically in dev. Local DB files are managed under `.alchemy/` (preferred) or `.wrangler/`.

### Database Schema

The authentication and app schemas are defined in `src/db/schema` and include tables for:

- Users, Sessions, Accounts, Verification (better-auth)
- Guestbook messages

### Making Schema Changes

1. Modify schema files in `src/db/schema`
2. Generate a new migration: `bun db:generate`
3. Apply the migration locally: `bun db:migrate`
4. Apply migrations in prod (optional): `bun db:migrate:prod`

## Deployment

To deploy the whole application (app, DB, R2, etc.) to Cloudflare:

1. Run `bun infra:up` to provision and deploy
2. Run `bun infra:down` to destroy

Every time you change anything in the infra definition and run `infra:up`, your infra will be updated.

## Codebase Enhancements & Architecture

### 🏗️ Session Management

- Server-side session fetching via `auth.api.getSession()` with `disableCookieCache: true` for fresh data
- SSR-friendly: session data loaded in middleware and passed to components
- Efficient client actions: `authClient.signOut()` and `authClient.revokeSession()`

Key files:

- `src/middleware/app-middleware.ts` — server-side session loading
- `src/app/pages/profile/components/session-manager.tsx` — multi-device session management

### 🎨 Theme System

Dark/light theme system that prevents hydration issues and FOUC:

- Blocking theme script `public/theme-script.js` (runs before hydration)
- Theme hook `src/app/hooks/use-theme.ts`
- Theme provider `src/app/providers/theme-provider.tsx`
- Tailwind CSS v4 via `src/app/document/index.css`
- Hydration warning suppression in `src/client.tsx`

### 📁 Feature-Based Architecture

Pages are organized by feature:

```
src/app/pages/
├── guestbook/
│   ├── pages/
│   │   ├── home-page.tsx
│   │   └── landing-page.tsx
│   ├── functions.ts
│   └── components/
├── profile/
│   ├── profile-page.tsx
│   ├── functions.ts
│   └── components/
└── sign-in/
    ├── sign-in-page.tsx
    └── components/
```

Library organization:

```
src/lib/
├── auth/        # better-auth config and utilities
├── utils/       # utility functions, constants, email, etc.
└── validators/  # Zod validation schemas by feature
```

### 🔧 Technical Improvements

- Centralized better-auth config: `src/lib/auth/index.ts`
- Email OTP via Resend, plus Google and GitHub providers
- Feature-based Zod validators under `src/lib/validators`
- Stronger types via `src/types` and Alchemy-generated env types in `types/env.d.ts`
- Biome-based linting/formatting

### 🎯 UI/UX Enhancements

- Onboarding flow: dialog-based onboarding for users without a profile name
- Toast notifications: Sonner integration
- Form validation: Client and server-side validation with helpful messages

## Project Structure

```
rwsdk-guestbook/
├─ public/
│  ├─ favicon.svg
│  └─ theme-script.js
├─ src/
│  ├─ api/
│  │  └─ routes.ts
│  ├─ app/
│  │  ├─ components/
│  │  ├─ document/
│  │  │  ├─ Document.tsx
│  │  │  └─ index.css
│  │  ├─ hooks/
│  │  ├─ layouts/
│  │  ├─ pages/
│  │  │  ├─ guestbook/
│  │  │  ├─ profile/
│  │  │  └─ sign-in/
│  │  └─ providers/
│  ├─ db/
│  │  ├─ migrations/
│  │  └─ schema/
│  ├─ lib/
│  ├─ middleware/
│  ├─ types/
│  ├─ client.tsx
│  └─ worker.tsx
├─ types/
│  ├─ env.d.ts
│  └─ rw.d.ts
├─ alchemy.run.ts
├─ biome.json
├─ components.json
├─ drizzle.config.ts
├─ package.json
├─ tsconfig.json
├─ vite.config.mts
└─ wrangler.jsonc
```

## Useful Scripts

```bash
# Dev
bun dev:init          # touch/generate/migrate local DB
bun dev               # run local dev environment via Alchemy

# Infra
bun infra:up          # provision and deploy to Cloudflare
bun infra:down        # destroy all provisioned resources

# Drizzle
bun db:generate       # generate migrations
bun db:migrate        # apply local migrations
bun db:migrate:prod   # apply migrations to prod D1
bun db:studio         # open local Drizzle Studio
```
