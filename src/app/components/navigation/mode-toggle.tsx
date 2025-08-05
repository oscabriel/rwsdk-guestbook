"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { useTheme } from "@/app/hooks/use-theme";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
			<Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
			<Moon className="hidden h-5 w-5 dark:block" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
