import type { auth } from "@/lib/auth";

// Better Auth server types - using $Infer.Session which contains both session and user
export type Session = typeof auth.$Infer.Session;

// Extract user type from the session type
export type User = Session["user"];

// Extract session data type (without user)
export type SessionData = Session["session"];
