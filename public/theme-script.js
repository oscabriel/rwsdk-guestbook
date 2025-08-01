(function() {
	try {
		var theme = localStorage.getItem("app-theme") || "system";
		var root = document.documentElement;
		
		root.classList.remove("light", "dark");
		
		if (theme === "system") {
			var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			root.classList.add(systemTheme);
		} else {
			root.classList.add(theme);
		}
	} catch (e) {
		// Fallback to system theme if there's an error
		var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		document.documentElement.classList.add(systemTheme);
	}
})();