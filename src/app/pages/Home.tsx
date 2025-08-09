import type { RequestInfo } from "rwsdk/worker";

import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { GuestbookForm } from "@/app/pages/guestbook/components/guestbook-form";
import { GuestbookList } from "@/app/pages/guestbook/components/guestbook-list";
import { getAllGuestbookMessages } from "@/app/pages/guestbook/functions";
import { GITHUB_REPO_URL, MAIN_SITE_URL } from "@/lib/utils/constants";
import { link } from "@/lib/utils/links";

function Footer() {
	return (
		<div className="mt-12">
			<Separator className="my-8" />
			<p className="text-sm text-muted-foreground">
				This {""}
				<a href={GITHUB_REPO_URL} className="underline">
					website
				</a>{" "}
				is built with RedwoodSDK and deployed to Cloudflare Workers. Check out
				my other projects at {""}
				<a href={MAIN_SITE_URL} className="underline">
					{MAIN_SITE_URL}
				</a>
				.
			</p>
		</div>
	);
}

function LandingPage() {
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
					<Button asChild size="lg" className="text-lg py-6">
						<a href={link("/sign-in")}>Sign In</a>
					</Button>
				</div>
				<Footer />
			</div>
		</div>
	);
}

async function GuestbookPage({ ctx }: RequestInfo) {
	const messagesResult = await getAllGuestbookMessages();

	return (
		<div className="bg-background px-4">
			<div className="mx-auto max-w-3xl">
				<div className="mb-8">
					<h1 className="mb-6 font-bold text-5xl">Guestbook</h1>
					<p className="mb-6 text-base text-muted-foreground sm:text-lg">
						Leave a message and see what others have shared
					</p>
				</div>

				{/* Guestbook Form */}
				<GuestbookForm user={ctx?.user} />
				{/* Messages List */}
				<GuestbookList
					messagesResult={messagesResult}
					currentUser={ctx?.user}
				/>
				<Footer />
			</div>
		</div>
	);
}

export async function Home(requestInfo: RequestInfo) {
	const { ctx } = requestInfo;
	const isAuthenticated = !!ctx.user;

	if (isAuthenticated) {
		return <GuestbookPage {...requestInfo} />;
	}

	return <LandingPage />;
}
