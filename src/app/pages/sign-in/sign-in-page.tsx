import { SignInForm } from "@/app/pages/sign-in/components/sign-in-form";
import type { AppContext } from "@/types/app";

export function SignIn({ ctx }: { ctx: AppContext }) {
	return (
		<div className="mx-auto max-w-md py-8">
			<SignInForm authUrl={ctx.authUrl} />
		</div>
	);
}
