import { initClient, initClientNavigation } from "rwsdk/client";

import { suppressHydrationWarning } from "@/lib/utils/hydration";

suppressHydrationWarning();

initClient();

initClientNavigation();
