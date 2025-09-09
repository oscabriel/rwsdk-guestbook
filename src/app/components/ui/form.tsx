"use client";

import * as React from "react";

import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { Slot as SlotPrimitive } from "@/lib/utils/radix-ui";
import type { FormMessageProps } from "@/types/ui";

// Simple form wrapper - just a div with form styling
const Form = React.forwardRef<
	HTMLFormElement,
	React.HTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
	<form ref={ref} className={cn("space-y-6", className)} {...props} />
));
Form.displayName = "Form";

// Simple form item wrapper
function FormItem({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("space-y-2", className)} {...props} />;
}

// Simple form label - just wraps the Label component
function FormLabel({
	className,
	...props
}: React.ComponentProps<typeof Label>) {
	return (
		<Label
			className={cn(
				"font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
				className,
			)}
			{...props}
		/>
	);
}

// Simple form control wrapper
function FormControl({
	className,
	...props
}: React.ComponentProps<typeof SlotPrimitive.Slot>) {
	return <SlotPrimitive.Slot className={className} {...props} />;
}

// Simple form description
function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p className={cn("text-muted-foreground text-sm", className)} {...props} />
	);
}

function FormMessage({
	className,
	children,
	variant = "destructive",
	...props
}: FormMessageProps) {
	if (!children) {
		return null;
	}

	const variants = {
		destructive: "bg-red-50 text-red-700 border-red-200",
		success: "bg-green-50 text-green-700 border-green-200",
		warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
	};

	return (
		<p
			className={cn(
				"rounded-md border p-3 text-sm",
				variants[variant],
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
}

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage };
