CREATE TABLE `ai_usage` (
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`window` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`user_id`, `provider`, `window`)
);
--> statement-breakpoint
CREATE TABLE `cloudflare_daily_usage` (
	`account_id` text NOT NULL,
	`day` text NOT NULL,
	`calls` integer DEFAULT 0 NOT NULL,
	`reserved_neurons` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`account_id`, `day`)
);
--> statement-breakpoint
CREATE TABLE `study_progress` (
	`user_id` text NOT NULL,
	`lesson_id` integer NOT NULL,
	`stage_id` integer NOT NULL,
	`completed_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `lesson_id`, `stage_id`)
);
--> statement-breakpoint
CREATE TABLE `vocabulary` (
	`user_id` text NOT NULL,
	`word_key` text NOT NULL,
	`english` text NOT NULL,
	`meaning` text NOT NULL,
	`example` text NOT NULL,
	`example_ko` text NOT NULL,
	`known` integer DEFAULT 0 NOT NULL,
	`saved` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `word_key`)
);
--> statement-breakpoint
CREATE TABLE `weekly_curriculum` (
	`week_start` text NOT NULL,
	`level` text NOT NULL,
	`payload` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`week_start`, `level`)
);
