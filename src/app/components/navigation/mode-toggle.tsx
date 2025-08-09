"use client";

import { Button } from "@/app/components/ui/button";
import { useTheme } from "@/app/hooks/use-theme";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			size="icon"
			variant="ghost"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
		>
			<span className="text-xl dark:hidden">☀️</span>
			<span className="hidden text-xl dark:block">🌙</span>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
