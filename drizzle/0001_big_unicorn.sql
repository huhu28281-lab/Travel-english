CREATE TABLE `study_path` (
	`user_id` text NOT NULL,
	`level` text NOT NULL,
	`week_index` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `level`)
);
