CREATE TABLE `guestbook_message` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`message` text NOT NULL,
	`country` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_guestbook_created_at` ON `guestbook_message` (`created_at`);