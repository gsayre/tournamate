import { relations } from "drizzle-orm";
import { double, int, serial } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { users } from "./auth";
import { division, tournament, pool, game } from "./tournament";

export const team = mySqlTable("team", {
  id: serial("team").notNull().primaryKey(),
  divisionId: int("divisionId").notNull(),
  tournamentId: int("tournamentId").notNull(),
  poolId: int("poolId").notNull(),
  teamRating: double("teamRating", { precision: 7, scale: 2 })
    .notNull()
    .default(1000.0),
  poolLosses: int("poolLosses").notNull().default(0),
  poolWins: int("poolWins").notNull().default(0),
  poolPointDifferential: int("poolPointDifferential").notNull().default(0),
});

export const teamRelations = relations(team, ({ one, many }) => ({
    division: one(division, { fields: [team.divisionId], references: [division.divisionId] }),
    tournament: one(tournament, { fields: [team.tournamentId], references: [tournament.tournamentId] }),
    pool: one(pool, { fields: [team.poolId], references: [pool.poolId] }),
    players: many(userInTeam),
    games: many(teamInGame),
    gamesReffed: many(game), //TODO: check if one-to-many is correct
}));

export const userInTeam = mySqlTable("userInTeam", {
  userId: int("userId").notNull(),
  teamId: int("teamId").notNull(),
});

export const userInTeamRelations = relations(userInTeam, ({ one }) => ({
  team: one(team, { fields: [userInTeam.teamId], references: [team.id] }),
  user: one(users, { fields: [userInTeam.userId], references: [users.id] }),
}));

export const teamInGame = mySqlTable("teamInGame", {
    teamId: int("teamId").notNull(),
    gameId: int("gameId").notNull(),
});

export const teamInGameRelations = relations(teamInGame, ({ one }) => ({
    team: one(team, { fields: [teamInGame.teamId], references: [team.id]}),
    game: one(game, { fields: [teamInGame.gameId], references: [game.gameId] }),
}));