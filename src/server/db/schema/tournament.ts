import { InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { teamInvitations, users } from "./user";
import { gameStatistics } from "./stats";
import { team, teamInDivision, teamInGame } from "./team";

const createTable = mysqlTableCreator((name) => `tournamate_${name}`);

export const tournament = createTable("tournament", {
  tournamentId: serial("tournamentId").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  type: mysqlEnum("type", ["none", "grass", "sand", "indoor"]).notNull(),
  dayOne: boolean("dayOne").notNull(),
  dayTwo: boolean("dayTwo").notNull().default(false),
  dayOneFormat: mysqlEnum("dayOneFormat", [
    "none",
    "same sex doubles",
    "coed doubles",
    "reverse coed doubles",
    "same sex sixes",
    "coed sixes",
    "reverse coed quads",
    "same sex triples",
  ]).notNull(),
  dayTwoFormat: mysqlEnum("dayTwoFormat", [
    "none",
    "same sex doubles",
    "coed doubles",
    "reverse coed doubles",
    "same sex sixes",
    "coed sixes",
    "reverse coed quads",
    "same sex triples",
  ]),
  dayOneDate: timestamp("dayOneDate").notNull(),
  dayTwoDate: timestamp("dayTwoDate"),
  dayOneStarted: boolean("dayOneStarted").notNull().default(false),
  dayTwoStarted: boolean("dayTwoStarted").notNull().default(false),

  tournamentDirectorId: varchar("id", { length: 255 }).notNull(),
});

export const tournamentRelations = relations(tournament, ({ one, many }) => ({
  tournamentDirector: one(users, {
    fields: [tournament.tournamentDirectorId],
    references: [users.id],
  }),
  divisions: many(division),
}));

export const division = createTable("division", {
  divisionId: serial("divisionId").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  type: mysqlEnum("type", ["MENS", "WOMEN", "COED", "REVCO"]).notNull(),
  isDayOf: boolean("isDayOf").notNull().default(false),
  isPoolFinished: boolean("isPoolFinished").notNull().default(false),
  isBracketFinished: boolean("isBracketFinished").notNull().default(false),
  numBreakingPool: int("numBreakingPool").notNull().default(0),
  numWildcards: int("numWildcards").default(0),
  hasWildcards: boolean("hasWildcards").notNull().default(false),

  tournamentId: int("tournamentId").notNull(),
});

export const divisionRelations = relations(division, ({ one, many }) => ({
  tournament: one(tournament, {
    fields: [division.tournamentId],
    references: [tournament.tournamentId],
  }),
  pools: many(pool),
  entries: many(teamInDivision),
  brackets: one(bracket, {
    fields: [division.divisionId],
    references: [bracket.divisionId],
  }),
}));

export type DivisionType = InferSelectModel<typeof division>;

export const pool = createTable("pool", {
  poolId: serial("poolId").primaryKey(),
  isFinished: boolean("isFinished").notNull().default(false),

  divisionId: int("divisionId").notNull(),
});

export const poolRelations = relations(pool, ({ one, many }) => ({
  division: one(division, {
    fields: [pool.divisionId],
    references: [division.divisionId],
  }),
  games: many(game),
  teams: many(team),
}));

export const bracket = createTable("bracket", {
  bracketId: serial("bracketId").primaryKey(),
  isFinished: boolean("isFinished").notNull().default(false),

  divisionId: int("divisionId").notNull(),
});

export const bracketRelations = relations(bracket, ({ one, many }) => ({
  division: one(division, {
    fields: [bracket.divisionId],
    references: [division.divisionId],
  }),
  games: many(game),
}));

export const game = createTable("game", {
  gameId: serial("gameId").primaryKey(),
  currentSet: int("currentSet").notNull().default(1),
  gameFinished: boolean("gameFinished").notNull().default(false),
  nextGameId: int("nextGameId"),
  gameOrder: int("gameOrder"),
  isScoreCapped: boolean("isScoreCapped").notNull().default(false),
  gameOneScoreCap: int("gameOneScoreCap").notNull().default(21),
  gameTwoScoreCap: int("gameTwoScoreCap").notNull().default(21),
  gameThreeScoreCap: int("gameThreeScoreCap").notNull().default(15),
  gameOneTeamOneScore: int("gameOneTeamOneScore").notNull().default(0),
  gameOneTeamTwoScore: int("gameOneTeamTwoScore").notNull().default(0),
  gameTwoTeamOneScore: int("gameTwoTeamOneScore").notNull().default(0),
  gameTwoTeamTwoScore: int("gameTwoTeamTwoScore").notNull().default(0),
  gameThreeTeamOneScore: int("gameThreeTeamOneScore").notNull().default(0),
  gameThreeTeamTwoScore: int("gameThreeTeamTwoScore").notNull().default(0),

  poolId: int("poolId"),
  bracketId: int("bracketId"),
  refereeId: int("refereeId"),
});

export const gameRelations = relations(game, ({ one, many }) => ({
  pool: one(pool, { fields: [game.poolId], references: [pool.poolId] }),
  bracket: one(bracket, {
    fields: [game.bracketId],
    references: [bracket.bracketId],
  }),
  referee: one(team, { fields: [game.refereeId], references: [team.id] }),
  teams: many(teamInGame),
  gameStatistics: many(gameStatistics),
}));
