import type { RequestInfo } from "rwsdk/worker";

import { GuestbookForm } from "@/app/pages/guestbook/components/guestbook-form";
import { GuestbookList } from "@/app/pages/guestbook/components/guestbook-list";
import { getAllGuestbookMessages } from "@/app/pages/guestbook/functions";

// Main Guestbook Page Component
export async function GuestbookPage({ ctx }: RequestInfo) {
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
				<GuestbookForm user={ctx?.user} />
				<GuestbookList
					messagesResult={messagesResult}
					currentUser={ctx?.user}
				/>
			</div>
		</div>
	);
}
