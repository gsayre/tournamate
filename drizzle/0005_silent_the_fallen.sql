CREATE TABLE `tournamate_gameStatistics` (
	`gameStatisticsId` serial AUTO_INCREMENT NOT NULL,
	`isPool` boolean NOT NULL DEFAULT false,
	`isBracket` boolean NOT NULL DEFAULT false,
	`wins` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`totalGames` int NOT NULL DEFAULT 0,
	`aces` int NOT NULL DEFAULT 0,
	`kills` int NOT NULL DEFAULT 0,
	`blocks` int NOT NULL DEFAULT 0,
	`hittingErrors` int NOT NULL DEFAULT 0,
	`serviceErrors` int NOT NULL DEFAULT 0,
	`netViolations` int NOT NULL DEFAULT 0,
	`doubleContacts` int NOT NULL DEFAULT 0,
	`assits` int NOT NULL DEFAULT 0,
	`lifts` int NOT NULL DEFAULT 0,
	`gameId` int NOT NULL,
	`userId` int NOT NULL,
	CONSTRAINT `tournamate_gameStatistics_gameStatisticsId` PRIMARY KEY(`gameStatisticsId`)
);
--> statement-breakpoint
CREATE TABLE `tournamate_team` (
	`team` serial AUTO_INCREMENT NOT NULL,
	`divisionId` int NOT NULL,
	`tournamentId` int NOT NULL,
	`poolId` int NOT NULL,
	`teamRating` double(7,2) NOT NULL DEFAULT 1000,
	`poolLosses` int NOT NULL DEFAULT 0,
	`poolWins` int NOT NULL DEFAULT 0,
	`poolPointDifferential` int NOT NULL DEFAULT 0,
	CONSTRAINT `tournamate_team_team` PRIMARY KEY(`team`)
);
--> statement-breakpoint
CREATE TABLE `tournamate_teamInGame` (
	`teamId` int NOT NULL,
	`gameId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tournamate_userInTeam` (
	`userId` int NOT NULL,
	`teamId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tournamate_bracket` (
	`bracketId` serial AUTO_INCREMENT NOT NULL,
	`isFinished` boolean NOT NULL DEFAULT false,
	`divisionId` int NOT NULL,
	CONSTRAINT `tournamate_bracket_bracketId` PRIMARY KEY(`bracketId`)
);
--> statement-breakpoint
CREATE TABLE `tournamate_division` (
	`divisionId` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`type` enum('BB','B','A','AA','Open') NOT NULL,
	`isDayOf` boolean NOT NULL DEFAULT false,
	`isPoolFinished` boolean NOT NULL DEFAULT false,
	`isBracketFinished` boolean NOT NULL DEFAULT false,
	`numBreakingPool` int NOT NULL DEFAULT 0,
	`numWildcards` int,
	`hasWildcards` boolean NOT NULL DEFAULT false,
	`tournamentId` int NOT NULL,
	CONSTRAINT `tournamate_division_divisionId` PRIMARY KEY(`divisionId`)
);
--> statement-breakpoint
CREATE TABLE `tournamate_game` (
	`gameId` serial AUTO_INCREMENT NOT NULL,
	`currentSet` int NOT NULL DEFAULT 1,
	`gameFinished` boolean NOT NULL DEFAULT false,
	`nextGameId` int,
	`gameOrder` int,
	`isScoreCapped` boolean NOT NULL DEFAULT false,
	`gameOneScoreCap` int NOT NULL DEFAULT 21,
	`gameTwoScoreCap` int NOT NULL DEFAULT 21,
	`gameThreeScoreCap` int NOT NULL DEFAULT 15,
	`gameOneTeamOneScore` int NOT NULL DEFAULT 0,
	`gameOneTeamTwoScore` int NOT NULL DEFAULT 0,
	`gameTwoTeamOneScore` int NOT NULL DEFAULT 0,
	`gameTwoTeamTwoScore` int NOT NULL DEFAULT 0,
	`gameThreeTeamOneScore` int NOT NULL DEFAULT 0,
	`gameThreeTeamTwoScore` int NOT NULL DEFAULT 0,
	`poolId` int,
	`bracketId` int,
	`refereeId` int,
	CONSTRAINT `tournamate_game_gameId` PRIMARY KEY(`gameId`)
);
--> statement-breakpoint
CREATE TABLE `tournamate_pool` (
	`poolId` serial AUTO_INCREMENT NOT NULL,
	`isFinished` boolean NOT NULL DEFAULT false,
	`divisionId` int NOT NULL,
	CONSTRAINT `tournamate_pool_poolId` PRIMARY KEY(`poolId`)
);
--> statement-breakpoint
CREATE TABLE `tournamate_tournament` (
	`tournamentId` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`type` enum('none','grass','sand','indoor') NOT NULL,
	`dayOne` boolean NOT NULL,
	`dayTwo` boolean NOT NULL DEFAULT false,
	`dayOneFormat` enum('none','same sex doubles','coed doubles','reverse coed doubles','same sex sixes','coed sixes','reverse coed quads','same sex triples') NOT NULL,
	`dayTwoFormat` enum('none','same sex doubles','coed doubles','reverse coed doubles','same sex sixes','coed sixes','reverse coed quads','same sex triples'),
	`dayOneDate` timestamp NOT NULL,
	`dayTwoDate` timestamp,
	`dayOneStarted` boolean NOT NULL DEFAULT false,
	`dayTwoStarted` boolean NOT NULL DEFAULT false,
	`id` varchar(255) NOT NULL,
	CONSTRAINT `tournamate_tournament_tournamentId` PRIMARY KEY(`tournamentId`)
);
