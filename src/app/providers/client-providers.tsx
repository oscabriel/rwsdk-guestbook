"use client";

import type { ReactNode } from "react";

import { Toaster } from "@/app/components/ui/sonner";
import { ThemeProvider } from "@/app/providers/theme-provider";

interface ClientProvidersProps {
	children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
	return (
		<ThemeProvider defaultTheme="system" storageKey="app-theme">
			{children}
			<Toaster richColors />
		</ThemeProvider>
	);
}
