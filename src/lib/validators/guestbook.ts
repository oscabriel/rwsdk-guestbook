import { z } from "zod/v4";

import {
	COUNTRY_REGEX,
	MESSAGE_REGEX,
	NAME_REGEX,
	REGEX_ERROR_MESSAGES,
} from "@/lib/utils/constants";

// Validation schema for creating guestbook messages
export const createMessageSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(30, "Name must be 30 characters or less")
		.regex(NAME_REGEX, REGEX_ERROR_MESSAGES.NAME),
	message: z
		.string()
		.min(1, "Message is required")
		.max(50, "Message must be 50 characters or less")
		.regex(MESSAGE_REGEX, REGEX_ERROR_MESSAGES.MESSAGE),
	country: z
		.string()
		.max(50, "Country must be 50 characters or less")
		.regex(COUNTRY_REGEX, REGEX_ERROR_MESSAGES.COUNTRY)
		.optional(),
});

// Validation schema for onboarding (completing profile)
export const completeOnboardingSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(30, "Name must be 30 characters or less")
		.regex(NAME_REGEX, REGEX_ERROR_MESSAGES.NAME),
});

// Type exports for use in components
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>;
