import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import alchemy from "alchemy/cloudflare/redwood";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [alchemy(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
