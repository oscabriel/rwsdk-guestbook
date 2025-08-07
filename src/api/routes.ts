import { env } from "cloudflare:workers";

import { route } from "rwsdk/router";

import { auth } from "@/lib/auth";

export const apiRoutes = [
	// Authentication routes
	route("/api/auth/*", ({ request }) => {
		return auth.handler(request);
	}),

	// R2 avatar serving route - optimized for image serving
	route("/r2/avatars/:key", async ({ params }) => {
		if (!params.key) {
			return new Response("Object Not Found", { status: 404 });
		}

		try {
			// Get object from R2
			const object = await env.AVATARS_BUCKET.get(`avatars/${params.key}`);

			if (object === null) {
				return new Response("Object Not Found", { status: 404 });
			}

			// Create response headers
			const headers = new Headers();

			// Let R2 object write its HTTP metadata (content-type, cache-control, etc.)
			// Note: Type assertion needed due to conflict between Cloudflare Workers Headers
			// and standard Web API Headers types (Cloudflare has additional 'getAll' method)
			// biome-ignore lint/suspicious/noExplicitAny: see above
			object.writeHttpMetadata(headers as any);

			// Set ETag for caching
			headers.set("etag", object.httpEtag);

			// Add cache control for better performance (1 year cache for avatars)
			headers.set("cache-control", "public, max-age=31536000, immutable");

			// Add CORS headers for cross-origin requests
			headers.set("access-control-allow-origin", "*");
			headers.set("access-control-allow-methods", "GET");

			// Note: Type assertion needed due to conflict between Cloudflare Workers ReadableStream
			// and standard Web API ReadableStream types (different async iterator support)
			// biome-ignore lint/suspicious/noExplicitAny: see above
			return new Response(object.body as any, {
				headers,
			});
		} catch (error) {
			console.error("Error serving avatar:", error);
			return new Response("Internal Server Error", { status: 500 });
		}
	}),
];
