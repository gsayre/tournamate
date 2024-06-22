ALTER TABLE `tournamate_teamInDivision` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `tournamate_teamInDivision` ADD PRIMARY KEY(`teamId`,`divisionId`);--> statement-breakpoint
ALTER TABLE `tournamate_teamInDivision` DROP COLUMN `tIdID`;