<!-- vibe-rules Integration -->

<rwsdk_rwsdk-interruptors>
Always Apply: false - This rule should only be applied when relevant files are open
Always apply this rule in these files: worker.tsx, src/app/**/routes.ts, src/app/**/*/routes.ts



# RedwoodSDK: Request Interruptors

You're an expert at Cloudflare, TypeScript, and building web apps with RedwoodSDK. Generate high quality **RedwoodSDK interruptors** (middleware functions) that adhere to the following best practices:

## Guidelines

1. Create focused, single-responsibility interruptors
2. Organize interruptors in dedicated files (e.g., `interruptors.ts`, `interceptors.ts`, or `middleware.ts`)
3. Compose interruptors to create more complex validation chains
4. Use typed parameters and return values
5. Include clear error handling and user feedback

## What are Interruptors?

Interruptors are middleware functions that run before your route handlers. They can:

- Validate user authentication and authorization
- Transform request data
- Validate inputs
- Rate limit requests
- Log activity
- Redirect users based on conditions
- Short-circuit request handling with early responses

## Example Templates

### Basic Interruptor Structure

```tsx
async function myInterruptor({ request, params, ctx }) {
  // Perform checks or transformations here

  // Return modified context to pass to the next interruptor or handler
  ctx.someAddedData = "value";

  // OR return a Response to short-circuit the request
  // return new Response('Unauthorized', { status: 401 });
}
```

### Authentication Interruptors

```tsx
export async function requireAuth({ request, ctx }) {
  if (!ctx.user) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/user/login" },
    });
  }
}

export async function requireAdmin({ request, ctx }) {
  if (!ctx?.user?.isAdmin) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/user/login" },
    });
  }
}
```

### Input Validation Interruptor

```tsx
import { z } from "zod";

// Create a reusable validator interruptor
export function validateInput(schema) {
  return async function validateInputInterruptor({ request, ctx }) {
    try {
      const data = await request.json();
      const validated = (ctx.data = schema.parse(data));
    } catch (error) {
      return Response.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
  };
}

// Usage example with a Zod schema
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18).optional(),
});

export const validateUser = validateInput(userSchema);
```

### Logging Interruptor

```tsx
export async function logRequests({ request, ctx }) {
  const start = Date.now();

  // Add a function to the context that will log when called
  ctx.logCompletion: (response) => {
      const duration = Date.now() - start;
      const status = response.status;
      console.log(
        `${request.method} ${request.url} - ${status} (${duration}ms)`,
      );
    },
  };
}

// Usage in a route handler
route('/', [
  logRequests,
  async ({request, ctx}) => {
    // Call the logging function
    ctx.logCompletion(response);
    return Response.json({ success: true });;
  },
]);
```

### Composing Multiple Interruptors

```tsx
import { route } from "rwsdk/router";
import {
  requireAuth,
  validateUser,
  apiRateLimit,
  logRequests,
} from "@/app/interruptors";

// Combine multiple interruptors
route("/api/users", [
    logRequests, // Log all requests
    requireAuth, // Ensure user is authenticated
    validateUser, // Validate user input
    async ({ request, ctx }) => {
      // Handler receives validated data and session from interruptors
      const newUser = await db.user.create({
        data: {
          /* ... */,
          createdBy: ctx.user.userId,
        },
      });

      return Response.json(newUser, { status: 201 });
    },
  ],
});
```

### Role-Based Access Control

```tsx
import { getSession } from "rwsdk/auth";

// Create a function that generates role-based interruptors
export function hasRole(allowedRoles) {
  return async function hasRoleInterruptor({ request, ctx }) {
    const session = await getSession(request);

    if (!session) {
      return Response.redirect("/login");
    }

    if (!allowedRoles.includes(session.role)) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    return { ...ctx, session };
  };
}

// Create specific role-based interruptors
export const isAdmin = hasRole(["ADMIN"]);
export const isEditor = hasRole(["ADMIN", "EDITOR"]);
export const isUser = hasRole(["ADMIN", "EDITOR", "USER"]);
```

### Organization with Co-located Interruptors

Create a file at `./src/app/interruptors.ts`:

```tsx
import { getSession } from "rwsdk/auth";

// Authentication interruptors
export async function requireAuth({ request, ctx }) {
  const session = await getSession(request);

  if (!session) {
    return Response.redirect("/login");
  }

  return { ...ctx, session };
}

// Role-based interruptors
export function hasRole(allowedRoles) {
  return async function hasRoleInterruptor({ request, ctx }) {
    const session = await getSession(request);

    if (!session) {
      return Response.redirect("/login");
    }

    if (!allowedRoles.includes(session.role)) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    return { ...ctx, session };
  };
}

export const isAdmin = hasRole(["ADMIN"]);
export const isEditor = hasRole(["ADMIN", "EDITOR"]);

// Other common interruptors
export async function logRequests({ request, ctx }) {
  console.log(`${request.method} ${request.url}`);
  return ctx;
}
```

Then import these interruptors in your route files:

```tsx
// src/app/pages/admin/routes.ts
import { route } from "rwsdk/router";
import { isAdmin, logRequests } from "@/app/interruptors";

import { AdminDashboard } from "./AdminDashboard";
import { UserManagement } from "./UserManagement";

export const routes = [
  route("/", [isAdmin, logRequests, AdminDashboard]),
  route("/users", [isAdmin, logRequests, UserManagement]),
];
```


</rwsdk_rwsdk-interruptors>

<rwsdk_rwsdk-middleware>
Always Apply: false - This rule should only be applied when relevant files are open
Always apply this rule in these files: worker.tsx, middleware.ts, middleware.tsx



# RedwoodSDK: Middleware

You're an expert at Cloudflare, TypeScript, and building web apps with RedwoodSDK. Generate high quality **RedwoodSDK middleware** that adhere to the following best practices:

## Guidelines

1. Create focused, single-responsibility middleware functions
2. Organize middleware in dedicated files (e.g., `middleware.ts`, `middleware.tsx`)
3. Use typed parameters and return values
4. Include clear error handling and logging
5. Follow the principle of least privilege
6. Implement proper security headers and CORS policies
7. Optimize for performance with caching strategies

## What is Middleware?

Middleware functions in RedwoodSDK are functions that run on every request before your route handlers. They can:

- Add security headers
- Handle CORS
- Implement caching strategies
- Add request/response logging
- Transform request/response data
- Implement rate limiting
- Add performance monitoring
- Handle error boundaries
- Setup sessions
- Authenticate users

## Example Templates

### Basic Middleware Structure

```tsx
export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request, headers }) => {
    await setupDb(env);
    setupSessionStore(env);
    try {
      // Grab the session's data.
      ctx.session = await sessions.load(request);
    } catch (error) {
      if (error instanceof ErrorResponse && error.code === 401) {
        await sessions.remove(request, headers);
        headers.set("Location", "/user/login");

        return new Response(null, {
          status: 302,
          headers,
        });
      }

      throw error;
    }

    // Populate the ctx with the user's data
    if (ctx.session?.userId) {
      ctx.user = await db.user.findUnique({
        where: {
          id: ctx.session.userId,
        },
      });
    }
  },
  // Route handlers
]);
```

</rwsdk_rwsdk-middleware>

<rwsdk_rwsdk-react>
Always Apply: false - This rule should only be applied when relevant files are open
Always apply this rule in these files: src/app/**/*/*.tsx, Document.tsx


# React, React Server Components, and React Server Functions Rules

## React Server Components (RSC)

1. By default, all components are server components unless explicitly marked as client components.
2. Server components are rendered on the server as HTML and streamed to the browser.
3. Server components cannot include client-side interactivity (state, effects, event handlers).
4. Server components can directly fetch data and include it in the initial payload.
5. Server components can be async and can be wrapped in Suspense boundaries.

Example:

```tsx
export default function MyServerComponent() {
  return <div>Hello, from the server!</div>;
}
```

## Client Components

1. Must be explicitly marked with the "use client" directive at the top of the file.
2. Required when the component needs:
   - Interactivity (click handlers, state management)
   - Browser APIs
   - Event listeners
   - Client-side effects
   - Client-side routing
3. Will be hydrated by React in the browser.

Example:

```tsx
"use client";

export default function MyClientComponent() {
  return <button onClick={() => console.log("clicked")}>Click me</button>;
}
```

## Data Fetching in Server Components

1. Server components can directly fetch data without useEffect or other client-side data fetching methods.
2. Use Suspense boundaries to handle loading states for async server components.
3. Pass context (ctx) through props to child components that need it.

Example:

```tsx
export async function TodoList({ ctx }) {
  const todos = await db.todo.findMany({ where: { userId: ctx.user.id } });

  return (
    <ol>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ol>
  );
}
```

## Server Functions

1. Must be marked with the "use server" directive at the top of the file.
2. Can be imported and used in client components.
3. Execute on the server when called from client components.
4. Have access to the request context via requestInfo.ctx.
5. Can handle form submissions and other server-side operations.

Example:

```tsx
"use server";

import { requestInfo } from "rwsdk/worker";

export async function addTodo(formData: FormData) {
  const { ctx } = requestInfo;
  const title = formData.get("title");
  await db.todo.create({ data: { title, userId: ctx.user.id } });
}
```

## Context Usage

1. Context is available to all server components and server functions.
2. Access context via:
   - requestInfo in server functions:
   ```
   import { requestInfo } from "rwsdk/worker";
   const { ctx } = requestInfo
   ```
3. Context is populated by middleware and interruptors and is request-scoped.

## Best Practices

1. Keep server components as the default choice unless client-side interactivity is needed.
2. Use client components only when necessary to minimize the JavaScript bundle size.
3. Leverage server components for data fetching and initial rendering.
4. Use Suspense boundaries appropriately for loading states.
5. Keep client components as small as possible, moving server-side logic to server components or server functions.
6. Always mark client components with "use client" directive.
7. Always mark server functions with "use server" directive.


</rwsdk_rwsdk-react>

<rwsdk_rwsdk-request-response>
Always Apply: false - This rule should only be applied when relevant files are open
Always apply this rule in these files: worker.tsc, src/app/**/routes.ts, src/app/**/*/routes.ts


# RedwoodSDK: Request handling and responses

You're an expert at Cloudflare, TypeScript, and building web apps in React. Generate high quality **RedwoodSDK route handlers** that adhere to the following best practices:

## Guidelines

1. Try to use Web APIs instead of external dependencies (e.g. use fetch instead of Axios, use WebSockets API instead of node-ws)
2. Co-locate related routes into a separate `routes.ts` file in `./src/app/pages/<section>` (e.g. keep all "user" routes in `./src/app/pages/user/routes.ts`, all "blog" routes in `./src/app/pages/blog/routes.ts`), and then import them into `defineApp` with the `prefix` function
4. Structure response data consistently with proper status codes
5. Handle errors gracefully and return appropriate error responses

## Example Templates

### Basic Routing

Routes are matched in the order they are defined. Define routes using the `route` function. Trailing slashes are optional and normalized internally.

#### Static Path Matching

```tsx
// Match exact pathnames
route("/", function handler() {
  return <>Home Page</>
})

route("/about", function handler() {
  return <>About Page</>
})

route("/contact", function handler() {
  return <>Contact Page</>
})
```

#### Dynamic Path Parameters

```tsx
// Match dynamic segments marked with a colon (:)
route("/users/:id", function handler({ params }) {
  // params.id contains the value from the URL
  return <>User profile for {params.id}</>
})

route("/posts/:postId/comments/:commentId", function handler({ params }) {
  // Access multiple parameters
  return <>Comment {params.commentId} on Post {params.postId}</>
})
```

#### Wildcard Path Matching

```tsx
// Match all remaining segments after the prefix
route("/files/*", function handler({ params }) {
  // params.$0 contains the wildcard value
  return <>File: {params.$0}</>
})

route("/docs/*/version/*", function handler({ params }) {
  // Multiple wildcards available as params.$0, params.$1, etc.
  return <>Document: {params.$0}, Version: {params.$1}</>
})
```

### Response Types

#### Plain Text Response

```tsx
import { route } from "rwsdk/router";

route("/api/status", function handler() {
  return new Response("OK", {
    status: 200,
    headers: { "Content-Type": "text/plain" }
  })
})
```

#### JSON Response

```tsx
import { route } from "rwsdk/router";

route("/api/users/:id", function handler({ params }) {
  const userData = { id: params.id, name: "John Doe", email: "john@example.com" }

  return Response.json(userData, {
    status: 200,
    headers: {
      "Cache-Control": "max-age=60"
    }
  })
})
```

#### JSX/React Components Response

```tsx
import { route } from "rwsdk/router";
import { UserProfile } from '@/app/components/UserProfile'

route("/users/:id", function handler({ params }) {
  return <UserProfile userId={params.id} />
})
```

#### Custom Document Template

```tsx
import { render, route } from "rwsdk/router";
import { Document } from '@/app/Document'

render(Document, [
  route("/", function handler() {
    return <>Home Page</>
  }),
  route("/about", function handler() {
    return <>About Page</>
  })
])
```

### Error Handling

```tsx
import { route } from "rwsdk/router";

route("/api/posts/:id", async function handler({ params }) {
  try {
    const post = await db.post.findUnique({ where: { id: params.id } })

    if (!post) {
      return Response.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    return Response.json(post)
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Failed to retrieve post" },
      { status: 500 }
    )
  }
})
```

### Organization with Co-located Routes

Create a file at `./src/app/pages/blog/routes.ts`:

```tsx
import { route } from "rwsdk/router";
import { isAdminUser } from '@/app/interceptors'

import { BlogLandingPage } from './BlogLandingPage'
import { BlogPostPage } from './BlogPostPage'
import { BlogAdminPage } from './BlogAdminPage'

export const routes = [
  route('/', BlogLandingPage),
  route('/post/:postId', BlogPostPage),
  route('/post/:postId/edit', [isAdminUser, BlogAdminPage])
]
```

Then import these routes in your main worker file:

```tsx
// src/worker.tsx
import { defineApp, render, route, prefix } from "rwsdk/router";
import { Document } from '@/app/Document'
import { HomePage } from '@/app/pages/home/HomePage'
import { routes as blogRoutes } from '@/app/pages/blog/routes'

export default defineApp([
  /* middleware */
  render(Document, [
    route('/', HomePage),
    prefix('/blog', blogRoutes)
  ]),
])
```

### Advanced: Route with Query Parameters

```tsx
import { route } from "rwsdk/router";

route("/api/search", function handler({ request }) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q') || ''
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '10')

  return Response.json({
    query,
    page,
    limit,
    results: [] // Your search results would go here
  })
})
```


</rwsdk_rwsdk-request-response>

<alchemy_cloudflare>
Always Apply: true - This rule should ALWAYS be applied by the AI
Always apply this rule in these files: *.ts

# Alchemy - TypeScript-native Infrastructure as Code

Alchemy is a TypeScript-native Infrastructure-as-Code framework that allows you to define cloud resources using familiar TypeScript patterns. This guide focuses on Cloudflare integration.

## Core Concepts

**Resources**: Async functions that manage cloud infrastructure lifecycle (create, update, delete)
**Bindings**: Type-safe connections between resources (workers, KV stores, databases)
**State Management**: Tracks resource state for consistent deployments
**Finalization**: Always call `app.finalize()` to clean up orphaned resources

## Basic Setup

### Project Structure
```typescript
// alchemy.run.ts - Your infrastructure definition
import alchemy from "alchemy";
import { Worker, KVNamespace } from "alchemy/cloudflare";

const app = await alchemy("my-app");

export const worker = await Worker("api", {
  entrypoint: "./src/worker.ts",
  bindings: {
    CACHE: await KVNamespace("cache", { title: "cache-store" })
  }
});

console.log({ url: worker.url });
await app.finalize(); // ⚠️ ALWAYS call finalize()
```

### Environment Setup
```bash
# .env - Required for secret encryption
ALCHEMY_PASSWORD=your-secure-password

# Optional: Use Cloudflare state store in production
ALCHEMY_STATE_STORE=cloudflare
```

### Commands
```bash
bun alchemy deploy            # Deploy
bun alchemy dev               # Local development
bun alchemy destroy           # Destroy all resources
```

## Workers

### Basic Worker
```typescript
const worker = await Worker("api", {
  entrypoint: "./src/worker.ts",
  url: true, // Get public URL
});
```

### Worker with Bindings
```typescript
const worker = await Worker("api", {
  entrypoint: "./src/worker.ts",
  bindings: {
    // Resource bindings
    CACHE: kvNamespace,
    STORAGE: r2Bucket,
    COUNTER: durableObjectNamespace,
    QUEUE: queue,
    API: otherWorker,
    
    // Environment variables
    API_KEY: alchemy.secret(process.env.API_KEY),
    DEBUG: "true"
  }
});
```

### Worker Implementation
```typescript
// src/worker.ts
import type { worker } from "../alchemy.run";

export default {
  async fetch(request: Request, env: typeof worker.Env): Promise<Response> {
    // Type-safe access to all bindings
    const cached = await env.CACHE.get("key");
    const apiKey = env.API_KEY;
    
    return new Response("Hello World");
  }
};
```

### Type Safety Setup
```typescript
// types/env.d.ts
import type { worker } from "../alchemy.run";

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends typeof worker.Env {}
  }
}
```

## Durable Objects

### Creating Durable Object Namespace
```typescript
// Use 'new' instead of 'await' for DurableObjectNamespace
const counter = DurableObjectNamespace("counter", {
  className: "Counter",
  sqlite: true, // Enable SQLite storage
});

const worker = await Worker("api", {
  entrypoint: "./src/worker.ts",
  bindings: {
    COUNTER: counter, // Bind to worker
  }
});
```

### Durable Object Implementation
```typescript
// src/counter.ts
import { DurableObject } from "cloudflare:workers";

export class Counter extends DurableObject {
  async increment(): Promise<number> {
    let count = (await this.ctx.storage.get("count")) || 0;
    count++;
    await this.ctx.storage.put("count", count);
    return count;
  }

  async fetch(request: Request): Promise<Response> {
    const count = await this.increment();
    return new Response(JSON.stringify({ count }));
  }
}
```

### Using Durable Objects in Worker
```typescript
// src/worker.ts
export default {
  async fetch(request: Request, env: typeof worker.Env) {
    // Get a Durable Object instance
    const id = env.COUNTER.idFromName("global-counter");
    const obj = env.COUNTER.get(id);
    
    // Call the Durable Object
    return obj.fetch(request);
  }
};
```

### Cross-Script Durable Objects
```typescript
// Method 1: Re-export from provider worker
const sharedCounter = host.bindings.SHARED_COUNTER;

// Method 2: Reference by worker script name
const counter = DurableObjectNamespace("counter", {
  className: "Counter",
  scriptName: "provider-worker"
});
```

## Key Resources

### KV Namespace
```typescript
const cache = await KVNamespace("cache", {
  title: "my-cache-store"
});

// Usage in worker
const value = await env.CACHE.get("key");
await env.CACHE.put("key", "value", { expirationTtl: 3600 });
```

### R2 Bucket
```typescript
const storage = await R2Bucket("storage", {
  allowPublicAccess: false
});

// Usage in worker
const object = await env.STORAGE.get("file.txt");
await env.STORAGE.put("file.txt", "content");
```

### Queue
```typescript
// Typed queue
const queue = await Queue<{ name: string; email: string }>("notifications");

// Producer worker
const producer = await Worker("producer", {
  bindings: { QUEUE: queue },
  // Queue sending code
});

// Consumer worker
const consumer = await Worker("consumer", {
  eventSources: [queue], // Register as consumer
  // Queue processing code
});

// Worker implementation for queue processing
export default {
  async queue(batch: typeof queue.Batch, env: Env) {
    for (const message of batch.messages) {
      console.log("Processing:", message.body);
      message.ack(); // Acknowledge message
    }
  }
};
```

### Custom Domains
```typescript
const worker = await Worker("api", {
  entrypoint: "./src/worker.ts",
  routes: [
    { pattern: "api.example.com/*", zone: "example.com" },
    { pattern: "example.com/api/*", zone: "example.com" }
  ]
});
```

## Converting Existing Cloudflare Projects

### 1. Migrate wrangler.toml Configuration
```toml
# Old wrangler.toml
name = "my-worker"
main = "src/index.js"

[env.production]
kv_namespaces = [
  { binding = "CACHE", id = "abc123" }
]

[[env.production.r2_buckets]]
binding = "STORAGE"
bucket_name = "my-bucket"
```

```typescript
// New alchemy.run.ts
const worker = await Worker("my-worker", {
  entrypoint: "./src/index.js",
  bindings: {
    CACHE: await KVNamespace("cache", { 
      title: "cache-store",
      adopt: true // Use existing KV namespace
    }),
    STORAGE: await R2Bucket("storage", {
      name: "my-bucket",
      adopt: true // Use existing bucket
    })
  }
});
```

### 2. Enable Development Compatibility
```typescript
// Generate wrangler.json for local development
await WranglerJson("wrangler.json", {
  worker,
});
```

### 3. Adopt Existing Resources
```typescript
// Use adopt: true to use existing resources instead of failing
const bucket = await R2Bucket("storage", {
  name: "existing-bucket-name",
  adopt: true // Won't fail if bucket already exists
});
```

### 4. State Store Migration
```typescript
// Local development (default)
const app = await alchemy("my-app");

// Production with Cloudflare state store
const app = await alchemy("my-app", {
  stateStore: process.env.NODE_ENV === "production" 
    ? (scope) => new DOStateStore(scope)
    : undefined
});
```

## Advanced Patterns

### Framework Integration (Vite/React/etc.)
```typescript
const website = await Vite("website", {
  main: "./src/worker.ts",
  command: "bun run build", // Build command
  bindings: {
    API: await Worker("api", { entrypoint: "./api/worker.ts" }),
    STORAGE: await R2Bucket("assets")
  }
});
```

### Resource Scoping
```typescript
// Organize resources into logical groups
await alchemy.run("backend", async () => {
  await Worker("api", { entrypoint: "./api.ts" });
  await KVNamespace("cache", { title: "api-cache" });
});

await alchemy.run("frontend", async () => {
  await Vite("website", { main: "./src/worker.ts" });
});
```

### Testing Pattern
```typescript
import { alchemy } from "../../src/alchemy";
const test = alchemy.test(import.meta, { prefix: "test" });

describe("Worker Tests", () => {
  test("creates worker", async (scope) => {
    const worker = await Worker("test-worker", {
      entrypoint: "./src/worker.ts"
    });
    
    expect(worker.url).toBeTruthy();
    // Resources auto-cleaned after test
  });
});
```

## Best Practices

1. **Always call finalize()**: `await app.finalize()` at the end of your script
2. **Use adoption for migrations**: `adopt: true` when converting existing projects  
3. **Type-safe bindings**: Set up env.d.ts for full type safety
4. **Resource naming**: Use consistent, descriptive names for resources
5. **State store**: Use DOStateStore for production deployments
6. **Secrets**: Use `alchemy.secret()` for sensitive values
7. **Scoping**: Organize related resources using `alchemy.run()`
8. **Testing**: Use `alchemy.test()` for integration tests

## Common Issues

- **Missing finalize()**: Resources won't be cleaned up properly
- **Wrong DurableObject syntax**: Use `DurableObjectNamespace()` not `await`
- **Type errors**: Set up env.d.ts file for binding types
- **State conflicts**: Use different stages/prefixes for different environments
- **Resource adoption**: Use `adopt: true` when migrating existing resources

## Development Workflow

```bash
# Create new project
bunx alchemy create my-app --template=vite
cd my-app

# Set up authentication (one-time)
bun wrangler login

# Deploy infrastructure
bun run deploy

# Local development
bun run dev

# Clean up
bun run destroy
```
</alchemy_cloudflare>

<!-- /vibe-rules Integration -->
