export function suppressHydrationWarning() {
	if (typeof window === "undefined") {
		return;
	}

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
}
