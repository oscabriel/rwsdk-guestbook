import type * as React from "react";

export interface FormMessageProps extends React.ComponentProps<"p"> {
	variant?: "destructive" | "success" | "warning";
}
