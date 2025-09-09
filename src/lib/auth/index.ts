import { env } from "cloudflare:workers";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";

import { db } from "@/db";
import * as schema from "@/db/schema";
import {
	DeleteAccountEmail,
	VerificationCodeEmail,
} from "@/lib/auth/email-templates";
import { EMAIL_FROM_ADDRESS, EMAIL_FROM_NAME } from "@/lib/utils/constants";
import { sendEmail } from "@/lib/utils/email";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: schema,
	}),
	secret: env.BETTER_AUTH_SECRET,
	url: env.BETTER_AUTH_URL,
	session: {
		storeSessionInDatabase: true,
	},
	user: {
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url, token }) => {
				await sendEmail(
					{
						from: `${EMAIL_FROM_NAME} <${EMAIL_FROM_ADDRESS}>`,
						to: user.email,
						subject: "Confirm Account Deletion",
						html: DeleteAccountEmail({ url, token }),
					},
					env.RESEND_API_KEY as string,
				);
			},
		},
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
	},

	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				if (process.env.ALCHEMY_STAGE === "dev") {
					console.log(`Sending ${type} code to ${email}: ${otp}`);
					return;
				}
				if (type === "sign-in") {
					await sendEmail(
						{
							from: `${EMAIL_FROM_NAME} <${EMAIL_FROM_ADDRESS}>`,
							to: email,
							subject: "Your Verification Code",
							html: VerificationCodeEmail({ otp }),
						},
						env.RESEND_API_KEY as string,
					);
				}
			},
		}),
	],
});

/* To use the better-auth cli, you need to use the following auth config,
   commenting out the one above this line. The cli will not work with our actual
	 auth config since we're using the "cloudflare:workers" module for typed env variables.

	 You'll also need to install better-sqlite3 and @types/better-sqlite3. npm is preferred for compilation reasons:

	 `npm install better-sqlite3 && npm install --save-dev @types/better-sqlite3`

	 Any time you change something in the auth config that requires a new schema (like orgs),
	 run the following command to generate a new schema file (make sure to add the
	 changes to the config below, too):

	 `bunx @better-auth/cli@latest generate --config src/lib/auth/index.ts --output src/db/schema/auth-schema.ts`

	 Then you can uninstall the better-sqlite3 packages and clean out the npm files:

	 `npm uninstall better-sqlite3 @types/better-sqlite3`
	 `rm -rf package-lock.json && rm -rf node_modules && bun install`
*/

// import { betterAuth } from "better-auth";
// import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import Database from "better-sqlite3";
// import { drizzle } from "drizzle-orm/better-sqlite3";

// import * as schema from "../../db/schema";
// import { getLocalSQLiteDBPath } from "../utils/db";

// const sqlite = new Database(getLocalSQLiteDBPath());
// const db = drizzle(sqlite);

// export const auth = betterAuth({
// 	database: drizzleAdapter(db, {
// 		provider: "sqlite",
// 		schema: schema,
// 		// plugins: [organization(), etc],
// 	}),
// });
