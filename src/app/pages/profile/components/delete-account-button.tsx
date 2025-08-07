"use client";

import { Mail, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/components/ui/dialog";
import { setupAuthClient } from "@/lib/auth/auth-client";

interface DeleteAccountButtonProps {
	authUrl: string;
}

export function DeleteAccountButton({ authUrl }: DeleteAccountButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [emailSent, setEmailSent] = useState(false);
	const authClient = setupAuthClient(authUrl);

	const handleDeleteAccount = () => {
		startTransition(async () => {
			try {
				const { error } = await authClient.deleteUser();

				if (error) {
					console.error("Error requesting account deletion:", error);
					toast.error("Failed to request account deletion");
				} else {
					// Email verification is configured, so this means the email was sent
					setEmailSent(true);
					toast.success("Confirmation email sent");
				}
			} catch (error) {
				console.error("Error requesting account deletion:", error);
				toast.error("Failed to request account deletion");
			}
		});
	};

	const handleClose = () => {
		setIsOpen(false);
		// Reset state when dialog closes
		setTimeout(() => {
			setEmailSent(false);
		}, 300); // Small delay to avoid visual glitch during close animation
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="destructiveOutline"
					className="flex w-full items-center justify-center space-x-2 text-sm sm:w-auto"
				>
					<Trash2 className="h-4 w-4" />
					<span>Delete Account</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{emailSent ? "Confirmation Email Sent" : "Delete Account"}
					</DialogTitle>
					<DialogDescription>
						{emailSent ? (
							<div className="flex items-start space-x-3">
								<Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
								<div>
									We've sent a confirmation email to your registered email
									address. Please check your inbox and click the link in the
									email to complete the account deletion process.
								</div>
							</div>
						) : (
							"Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data."
						)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
					{emailSent ? (
						<Button variant="outline" onClick={handleClose} className="w-full">
							Close
						</Button>
					) : (
						<>
							<Button
								variant="outline"
								onClick={handleClose}
								disabled={isPending}
								className="w-full sm:w-auto"
							>
								Cancel
							</Button>
							<Button
								variant="destructive"
								onClick={handleDeleteAccount}
								disabled={isPending}
								className="w-full sm:w-auto"
							>
								{isPending ? "Sending..." : "Delete Account"}
							</Button>
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
