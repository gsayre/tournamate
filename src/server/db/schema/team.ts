import { relations } from "drizzle-orm";
import { double, int, mysqlTableCreator, serial } from "drizzle-orm/mysql-core";

import { users } from "./user";
import { division, tournament, pool, game } from "./tournament";

const createTable = mysqlTableCreator((name) => `tournamate_${name}`);

export const team = createTable("team", {
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
  division: one(division, {
    fields: [team.divisionId],
    references: [division.divisionId],
  }),
  tournament: one(tournament, {
    fields: [team.tournamentId],
    references: [tournament.tournamentId],
  }),
  divisions: many(teamInDivision),
  pool: one(pool, { fields: [team.poolId], references: [pool.poolId] }),
  players: many(userInTeam),
  games: many(teamInGame),
  gamesReffed: many(game), //TODO: check if one-to-many is correct
}));

export const userInTeam = createTable("userInTeam", {
  userId: int("userId").notNull(),
  teamId: int("teamId").notNull(),
});

export const userInTeamRelations = relations(userInTeam, ({ one }) => ({
  team: one(team, { fields: [userInTeam.teamId], references: [team.id] }),
  user: one(users, { fields: [userInTeam.userId], references: [users.id] }),
}));

export const teamInGame = createTable("teamInGame", {
  teamId: int("teamId").notNull(),
  gameId: int("gameId").notNull(),
});

export const teamInGameRelations = relations(teamInGame, ({ one }) => ({
  team: one(team, { fields: [teamInGame.teamId], references: [team.id] }),
  game: one(game, { fields: [teamInGame.gameId], references: [game.gameId] }),
}));

export const teamInDivision = createTable("teamInDivision", {
  teamId: int("teamId").notNull(),
  divisionId: int("divisionId").notNull(),
});

export const teamInDivisionRelations = relations(teamInDivision, ({ one }) => ({
  team: one(team, { fields: [teamInDivision.teamId], references: [team.id] }),
  division: one(division, {
    fields: [teamInDivision.divisionId],
    references: [division.divisionId],
  }),
}));