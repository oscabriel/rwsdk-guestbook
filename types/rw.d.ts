import type { AppContext } from "@/root/src/worker";

declare module "rwsdk/worker" {
	interface DefaultAppContext extends AppContext {}
}
