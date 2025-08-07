import { Button } from "@/app/components/ui/button";
import { link } from "@/lib/utils/links";
import type { AppContext } from "@/types/app";

export function Home({ ctx }: { ctx: AppContext }) {
	const isAuthenticated = !!ctx.user;

	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
			<div className="text-center space-y-6 max-w-3xl mx-auto px-4">
				<h1 className="text-4xl md:text-6xl font-bold text-foreground">
					Welcome to Our <span className="text-primary">Guestbook</span>
				</h1>
				<p className="text-xl text-muted-foreground leading-relaxed">
					Share your thoughts, leave a message, and connect with our community.
					Every story matters and every voice is welcome here.
				</p>
				<div className="pt-4">
					<Button asChild size="lg" className="text-lg py-6">
						<a href={link(isAuthenticated ? "/guestbook" : "/sign-in")}>
							{isAuthenticated ? "View Messages" : "Sign In"}
						</a>
					</Button>
				</div>
			</div>
		</div>
	);
}
