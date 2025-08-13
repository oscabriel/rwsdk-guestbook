import path from "node:path";

import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import alchemy from "alchemy/cloudflare/redwood";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		cloudflare({
			viteEnvironment: { name: "worker" },
		}),
		alchemy(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
