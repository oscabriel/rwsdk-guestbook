import { defineConfig } from "drizzle-kit";

import { getLocalSQLiteDBPath } from "./src/lib/utils/db";

const isProd = process.env.ALCHEMY_STAGE === "prod";

export default defineConfig({
	dialect: "sqlite",
	schema: "./src/db/schema",
	out: "./src/db/migrations",
	...(isProd
		? {
				driver: "d1-http",
				dbCredentials: {
					accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
					databaseId: process.env.CLOUDFLARE_DATABASE_ID,
					token: process.env.CLOUDFLARE_API_TOKEN,
				},
			}
		: {
				dbCredentials: {
					url: getLocalSQLiteDBPath(),
				},
			}),
});
