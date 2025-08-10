/// <reference types="@types/node" />

import alchemy from "alchemy";
import { D1Database, Redwood, R2Bucket, WranglerJson } from "alchemy/cloudflare";

const APP_NAME = "rwsdk-guestbook";

const app = await alchemy(APP_NAME, {
  password: process.env.ALCHEMY_PASSWORD!,
});
    
const database = await D1Database("database", {
  name: `${APP_NAME}-db`,
  adopt: true,
  migrationsDir: "src/db/migrations",
  primaryLocationHint: "wnam",
  readReplication: {
    mode: "auto",
  },
});

const avatarsBucket = await R2Bucket("avatars", {
  name: `${APP_NAME}-avatars`,
  adopt: true,
});

export const worker = await Redwood("redwood-app", {
  name: `${APP_NAME}-site`,
  adopt: true,
  compatibilityDate: "2025-08-08",
  bindings: {
    DB: database,
    AVATARS_BUCKET: avatarsBucket,
    BETTER_AUTH_SECRET: alchemy.secret(process.env.BETTER_AUTH_SECRET!),
    GOOGLE_CLIENT_ID: alchemy.secret(process.env.GOOGLE_CLIENT_ID!),
    GOOGLE_CLIENT_SECRET: alchemy.secret(process.env.GOOGLE_CLIENT_SECRET!),
    GITHUB_CLIENT_ID: alchemy.secret(process.env.GITHUB_CLIENT_ID!),
    GITHUB_CLIENT_SECRET: alchemy.secret(process.env.GITHUB_CLIENT_SECRET!),
    RESEND_API_KEY: alchemy.secret(process.env.RESEND_API_KEY || ""),
  },
  domains: [
    {
      domainName: process.env.CUSTOM_DOMAIN!,
      zoneId: process.env.CLOUDFLARE_ZONE_ID!,
      adopt: true,
    },
  ],
});

await WranglerJson("wrangler", {
  worker,
});

console.log({
  url: `https://${process.env.CUSTOM_DOMAIN || "http://localhost:5173"}`,
});

await app.finalize();
    