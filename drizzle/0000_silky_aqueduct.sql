CREATE TABLE `prompts` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`prompt_id` text NOT NULL,
	`title` text,
	`body` text NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`prompt_id`) REFERENCES `prompts`(`id`) ON UPDATE no action ON DELETE cascade
);
