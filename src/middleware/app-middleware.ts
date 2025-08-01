import type { RouteMiddleware } from "rwsdk/router";

import { auth } from "@/lib/auth";

/**
 * Central application middleware that runs on every request.
 * Handles url context setup, user auth and session loading, and onboarding flow checks.
 */
export const appMiddleware: RouteMiddleware = async ({ ctx, request }) => {
	const url = new URL(request.url);
	ctx.authUrl = url.origin;

	try {
		const sessionResult = await auth.api.getSession({
			headers: request.headers,
			query: {
				disableCookieCache: true,
			},
		});

		if (sessionResult?.session && sessionResult?.user) {
			ctx.session = sessionResult.session;
			ctx.user = {
				...sessionResult.user,
				image: sessionResult.user.image ?? null,
			};
		}
	} catch (error) {
		console.warn("Failed to get session:", error);
	}
};
