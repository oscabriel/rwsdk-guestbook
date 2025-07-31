/// <reference types="@types/node" />

import alchemy from "alchemy";
import { D1Database, Redwood } from "alchemy/cloudflare";

const APP_NAME = "rwsdk-guestbook";

const app = await alchemy(APP_NAME, {
  password: process.env.ALCHEMY_PASSWORD!,
});
    
const database = await D1Database("database", {
  name: `${APP_NAME}-db`,
  adopt: true,
  migrationsDir: "src/db/migrations",
  dev: { remote: true },
  primaryLocationHint: "wnam",
  readReplication: {
    mode: "auto",
  },
});

export const worker = await Redwood("website", {
  name: `${APP_NAME}-site`,
  command: "bun run build",
  bindings: {
    DB: database,
  },
});

console.log({
  url: worker.url,
});

await app.finalize();
    