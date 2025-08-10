import { Separator } from "@/app/components/ui/separator";
import { GITHUB_REPO_URL, MAIN_SITE_URL } from "@/lib/utils/constants";

export function Footer() {
	return (
		<div className="mt-12 pb-16">
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
