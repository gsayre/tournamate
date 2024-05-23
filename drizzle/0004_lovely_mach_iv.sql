CREATE TABLE `tournamate_teamInvitations` (
	`teamInvitations` serial AUTO_INCREMENT NOT NULL,
	`inviterId` int NOT NULL,
	`tournamentId` int NOT NULL,
	`divisionId` int NOT NULL,
	CONSTRAINT `tournamate_teamInvitations_teamInvitations` PRIMARY KEY(`teamInvitations`)
);
--> statement-breakpoint
CREATE TABLE `tournamate_userInInvitations` (
	`teamInvitationId` int NOT NULL,
	`inviteeId` int NOT NULL
);
--> statement-breakpoint
DROP TABLE `tournamate_post`;--> statement-breakpoint
ALTER TABLE `tournamate_user` ADD `playerRating` double(7,2) DEFAULT 1000 NOT NULL;