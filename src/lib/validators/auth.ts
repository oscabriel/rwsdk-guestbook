import { z } from "zod/v4";

export const signInEmailSchema = z.object({
	email: z.email(),
});

export const signInOtpSchema = z.object({
	email: z.email(),
	otp: z.string().length(6, "Verification code must be 6 digits"),
});

export type SignInEmailInput = z.infer<typeof signInEmailSchema>;
export type SignInOtpInput = z.infer<typeof signInOtpSchema>;
