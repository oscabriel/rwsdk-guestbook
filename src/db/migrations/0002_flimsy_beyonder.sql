ALTER TABLE `guestbook_message` ADD `user_id` text REFERENCES user(id);--> statement-breakpoint
CREATE INDEX `idx_guestbook_user_id` ON `guestbook_message` (`user_id`);