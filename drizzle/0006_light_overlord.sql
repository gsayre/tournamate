ALTER TABLE `tournamate_division` MODIFY COLUMN `type` enum('MENS','WOMEN','COED','REVCO') NOT NULL;--> statement-breakpoint
ALTER TABLE `tournamate_division` MODIFY COLUMN `numWildcards` int DEFAULT 0;