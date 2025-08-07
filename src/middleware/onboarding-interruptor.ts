import type { AppContext } from "@/types/app";

/**
 * Onboarding interruptor that checks if authenticated users need to complete onboarding.
 * Sets ctx.needsOnboarding flag for UI components to display onboarding modals.
 * Uses fresh session data loaded by app middleware.
 */
export const requireOnboarding = async ({
	ctx,
	request,
}: {
	ctx: AppContext;
	request: Request;
}) => {
	// Skip onboarding check for API routes and auth routes
	const url = new URL(request.url);
	if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) {
		return;
	}

	// Check if user is authenticated but missing profile data (name)
	if (ctx.user && !ctx.user.name) {
		ctx.needsOnboarding = true;
	}
};
