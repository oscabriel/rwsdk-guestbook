import { ArrowLeft } from "lucide-react";
import type { RequestInfo } from "rwsdk/worker";

import { DeleteAccountButton } from "./components/delete-account-button";
import { ProfileInfo } from "./components/profile-info";
import { SessionManager } from "./components/session-manager";
import { getUserProfile } from "./functions";
import { SignOutButton } from "@/app/components/navigation/sign-out-button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { auth } from "@/lib/auth";
import { link } from "@/lib/utils/links";

export async function ProfilePage({ ctx, request }: RequestInfo) {
	if (!ctx.user) {
		throw new Error("User not authenticated");
	}

	// Fetch user profile and session list - use session data from middleware
	const [userProfile, activeSessions] = await Promise.all([
		getUserProfile(ctx.user.id as string),
		auth.api
			.listSessions({
				headers: request.headers,
			})
			.catch(() => []),
	]);

	// Get the base URL for the auth client
	const url = new URL(request.url);
	const authUrl = `${url.protocol}//${url.host}`;

	return (
		<div className="bg-background px-4">
			<div className="mx-auto max-w-3xl">
				<div className="mb-8">
					<h1 className="mb-6 font-bold text-5xl">Profile</h1>
					<p className="mb-6 text-base text-muted-foreground sm:text-lg">
						Manage your account settings and profile information
					</p>
				</div>

				<Card className="bg-background">
					<CardContent className="space-y-3 sm:space-y-6">
						{/* Profile Information */}
						<ProfileInfo user={userProfile} />

						<Separator />

						{/* Active Sessions */}
						<SessionManager
							authUrl={authUrl}
							currentSession={
								ctx.session && ctx.user
									? { session: ctx.session, user: ctx.user }
									: null
							}
							activeSessions={
								Array.isArray(activeSessions) ? activeSessions : []
							}
						/>

						<Separator />

						{/* Action Buttons */}
						<div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:space-x-3 sm:space-y-0">
							<SignOutButton
								authUrl={authUrl}
								variant="outline"
								className="flex w-full items-center justify-center space-x-2 text-sm sm:w-auto"
							/>
							<DeleteAccountButton authUrl={authUrl} />
						</div>
					</CardContent>
				</Card>

				{/* Return to Guestbook Link */}
				<div className="mt-8">
					<a
						href={link("/")}
						className="inline-flex items-center gap-2 text-foreground underline decoration-muted-foreground transition-colors hover:decoration-foreground"
					>
						<ArrowLeft className="h-4 w-4" />
						Return to Guestbook
					</a>
				</div>
			</div>
		</div>
	);
}
