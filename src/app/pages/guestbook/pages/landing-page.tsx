import { Button } from "@/app/components/ui/button";
import { Footer } from "@/app/pages/guestbook/components/footer";
import { link } from "@/lib/utils/links";

export function LandingPage() {
	return (
		<div className="bg-background px-4">
			<div className="mx-auto max-w-3xl">
				<div className="mb-8">
					<h1 className="mb-6 font-bold text-5xl">Welcome!</h1>
					<p className="mb-6 text-base text-muted-foreground sm:text-lg">
						Sign in to leave a guestbook message and see what others have
						shared.
					</p>
				</div>
				<div>
					<Button asChild size="lg" className="py-6 text-lg">
						<a href={link("/sign-in")}>Sign In</a>
					</Button>
				</div>
				<Footer />
			</div>
		</div>
	);
}
