import type { LayoutProps } from "rwsdk/router";

import { OnboardingDialog } from "../pages/guestbook/components/onboarding-dialog";
import { Header } from "@/app/components/navigation/header";
import { ClientProviders } from "@/app/providers/client-providers";
import { link } from "@/lib/utils/links";

export function AppLayout({ children, requestInfo }: LayoutProps) {
	const ctx = requestInfo?.ctx;

	return (
		<ClientProviders>
			<div className="min-h-screen bg-background">
				<header className="fixed top-0 z-50 w-full bg-background/80 px-4 backdrop-blur-sm">
					<nav className="mx-auto flex max-w-3xl items-center justify-between py-4">
						<a href={link("/")} className="text-3xl">
							☁️
						</a>
						{requestInfo && <Header ctx={requestInfo.ctx} />}
					</nav>
				</header>
				<main className="pt-20">{children}</main>

				{/* Onboarding Dialog */}
				{ctx?.needsOnboarding && ctx.user && (
					<OnboardingDialog isOpen={true} userEmail={ctx.user.email} />
				)}
			</div>
		</ClientProviders>
	);
}
