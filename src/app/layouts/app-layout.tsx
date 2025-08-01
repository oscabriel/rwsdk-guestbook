import type { LayoutProps } from "rwsdk/router";

import { SignOutButton } from "@/app/components/sign-out-button";
import { Button } from "@/app/components/ui/button";
import { ClientProviders } from "@/app/providers/client-providers";
import { link } from "@/lib/utils/links";

export function AppLayout({ children, requestInfo }: LayoutProps) {
	const ctx = requestInfo?.ctx;

	return (
		<ClientProviders>
			<div className="min-h-screen bg-background">
				<header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 dark:bg-background/50">
					<div className="container mx-auto flex h-16 items-center justify-between px-6">
						<a href={link("/")} className="font-semibold text-3xl">
							☁️
						</a>
						<div className="flex items-center gap-4">
							{ctx?.user ? (
								<SignOutButton authUrl={ctx.authUrl} />
							) : (
								<Button asChild>
									<a href={link("/sign-in")}>Sign In</a>
								</Button>
							)}
						</div>
					</div>
				</header>
				<main className="container mx-auto px-6 py-8">{children}</main>
			</div>
		</ClientProviders>
	);
}
