"use client";

import { ModeToggle } from "@/app/components/navigation/mode-toggle";
import { Button } from "@/app/components/ui/button";
import { link } from "@/lib/utils/links";
import type { AppContext } from "@/types/app";

interface HeaderProps {
	ctx: AppContext;
}

export function Header({ ctx }: HeaderProps) {
	const currentUser = ctx.user;

	return (
		<div className="flex items-center gap-6">
			{!currentUser ? (
				<Button variant="outline" size="sm" className="h-9 px-3" asChild>
					<a href={link("/sign-in")}>Sign In</a>
				</Button>
			) : (
				<a
					href={link("/profile")}
					className="text-foreground underline decoration-muted-foreground transition-colors hover:decoration-foreground"
				>
					Profile
				</a>
			)}
			<ModeToggle />
		</div>
	);
}
