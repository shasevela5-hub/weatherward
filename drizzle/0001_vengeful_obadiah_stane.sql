CREATE TABLE `outfitScans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`detectedItems` text NOT NULL,
	`colorPalette` text NOT NULL,
	`styleScore` int NOT NULL,
	`styleTags` text NOT NULL,
	`weatherCondition` varchar(100),
	`temperature` int,
	`weatherIcon` varchar(50),
	`recommendations` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `outfitScans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `outfitScans` ADD CONSTRAINT `outfitScans_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;