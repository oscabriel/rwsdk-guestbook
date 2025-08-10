import type { RequestInfo } from "rwsdk/worker";

import { GuestbookPage } from "./guestbook-page";
import { LandingPage } from "./landing-page";

export async function HomePage(requestInfo: RequestInfo) {
	const { ctx } = requestInfo;
	const isAuthenticated = !!ctx.user;

	if (isAuthenticated) {
		return <GuestbookPage {...requestInfo} />;
	}

	return <LandingPage />;
}
