import { layout, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { ProfilePage } from "./app/pages/profile/profile-page";
import { apiRoutes } from "@/api/routes";
import { Document } from "@/app/document/Document";
import { setCommonHeaders } from "@/app/document/headers";
import { AppLayout } from "@/app/layouts/app-layout";
import { Home } from "@/app/pages/home";
import { NotFound } from "@/app/pages/not-found";
import { SignIn } from "@/app/pages/sign-in/sign-in-page";
import { appMiddleware } from "@/middleware/app-middleware";
import { redirectIfAuth, requireAuth } from "@/middleware/auth-interruptors";

export type { AppContext } from "@/types/app";

export default defineApp([
	setCommonHeaders(),

	appMiddleware,

	apiRoutes,

	render(Document, [
		layout(AppLayout, [
			route("/", Home),
			route("/sign-in", [redirectIfAuth, SignIn]),
			route("/profile", [requireAuth, ProfilePage]),
		]),
		route("*", NotFound),
	]),
]);
