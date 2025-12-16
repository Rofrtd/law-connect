CREATE TABLE `prompts` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`prompt_id` text NOT NULL,
	`title` text,
	`body` text NOT NULL,
	`order` integer NOT NULL
);
