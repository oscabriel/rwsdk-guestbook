import { Button } from "@/app/components/ui/button";
import { GitHubIcon } from "@/app/pages/sign-in/components/github-icon";
import { GoogleIcon } from "@/app/pages/sign-in/components/google-icon";
import {
	SIGN_IN_FORM,
	SOCIAL_PROVIDERS,
	type SocialProvider,
} from "@/lib/utils/constants";

interface SocialSignInButtonProps {
	provider: SocialProvider;
	onClick: (provider: SocialProvider) => void;
	disabled?: boolean;
	isLoading?: boolean;
	currentProvider?: SocialProvider | null;
}

const providerConfig = {
	[SOCIAL_PROVIDERS.GOOGLE]: {
		icon: GoogleIcon,
		label: "Sign in with Google",
		loadingLabel: SIGN_IN_FORM.LOADING_MESSAGES.REDIRECTING_GOOGLE,
	},
	[SOCIAL_PROVIDERS.GITHUB]: {
		icon: GitHubIcon,
		label: "Sign in with GitHub",
		loadingLabel: SIGN_IN_FORM.LOADING_MESSAGES.REDIRECTING_GITHUB,
	},
} as const;

export function SocialSignInButton({
	provider,
	onClick,
	disabled = false,
	isLoading = false,
	currentProvider,
}: SocialSignInButtonProps) {
	const config = providerConfig[provider];
	const IconComponent = config.icon;
	const isCurrentProviderLoading = currentProvider === provider;

	return (
		<Button
			type="button"
			className="relative flex w-full items-center justify-center space-x-2 border border-gray-300 bg-background text-foreground hover:bg-accent dark:border-gray-600"
			onClick={() => onClick(provider)}
			disabled={disabled || isLoading}
		>
			<IconComponent />
			<span>
				{isCurrentProviderLoading ? config.loadingLabel : config.label}
			</span>
		</Button>
	);
}
