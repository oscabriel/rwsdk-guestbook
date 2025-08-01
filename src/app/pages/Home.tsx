import { Button } from "@/app/components/ui/button";
import { link } from "@/lib/utils/links";

export function Home() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-16">
				<div className="text-center space-y-6 max-w-3xl mx-auto">
					<h1 className="text-4xl md:text-6xl font-bold text-foreground">
						Welcome to Our <span className="text-primary">Guestbook</span>
					</h1>
					<p className="text-xl text-muted-foreground leading-relaxed">
						Share your thoughts, leave a message, and connect with our
						community. Every story matters and every voice is welcome here.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" className="text-lg px-8" asChild>
							<a href={link("/sign-in")}>Sign In</a>
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="text-lg px-8"
							asChild
						>
							<a href={link("/guestbook")}>View Messages</a>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
