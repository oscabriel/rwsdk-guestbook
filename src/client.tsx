import { initClient, initClientNavigation } from "rwsdk/client";

// Suppress hydration warnings for Radix UI ID mismatches
const originalError = console.error;
console.error = (...args) => {
	if (
		typeof args[0] === "string" &&
		args[0].includes("A tree hydrated but some attributes")
	) {
		return;
	}
	originalError(...args);
};

initClient();

initClientNavigation();
