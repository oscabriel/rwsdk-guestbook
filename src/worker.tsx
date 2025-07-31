import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "@/app/document/Document";
import { setCommonHeaders } from "@/app/document/headers";
import { Home } from "@/app/pages/home";

export default defineApp([
	setCommonHeaders(),

	render(Document, [route("/", Home)]),
]);
