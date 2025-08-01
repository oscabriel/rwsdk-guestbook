import { link } from "@/lib/utils/links";
import type { AppContext } from "@/types/app";

/**
 * Authentication-related interruptors for route protection.
 * These run before route handlers to enforce authentication requirements.
 */

// Redirects the request to the home page if the user is authenticated
export const redirectIfAuth = ({ ctx }: { ctx: AppContext }) => {
	if (ctx.user) {
		return new Response(null, {
			status: 302,
			headers: { Location: link("/") },
		});
	}
};

// Redirects the request to the sign-in page if the user is not authenticated
export const requireAuth = ({ ctx }: { ctx: AppContext }) => {
	if (!ctx.user) {
		return new Response(null, {
			status: 302,
			headers: { Location: link("/sign-in") },
		});
	}
};
