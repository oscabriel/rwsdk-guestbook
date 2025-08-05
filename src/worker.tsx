import { layout, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "@/app/document/Document";
import { setCommonHeaders } from "@/app/document/headers";
import { AppLayout } from "@/app/layouts/app-layout";
import { GuestbookPage } from "@/app/pages/guestbook/guestbook-page";
import { Home } from "@/app/pages/home";
import { NotFound } from "@/app/pages/not-found";
import { SignIn } from "@/app/pages/sign-in/sign-in-page";
import { auth } from "@/lib/auth";
import { appMiddleware } from "@/middleware/app-middleware";
import { redirectIfAuth, requireAuth } from "@/middleware/auth-interruptors";

export type { AppContext } from "@/types/app";

export default defineApp([
	setCommonHeaders(),

	appMiddleware,

	route("/api/auth/*", ({ request }) => {
		return auth.handler(request);
	}),

	render(Document, [
		layout(AppLayout, [
			route("/", Home),
			route("/sign-in", [redirectIfAuth, SignIn]),
			route("/guestbook", [requireAuth, GuestbookPage]),
		]),
		route("*", NotFound),
	]),
]);
