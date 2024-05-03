import { serial, int, boolean } from "drizzle-orm/mysql-core";
import { mySqlTable } from "./_table";
import { relations } from "drizzle-orm";
import { users } from "./auth";
import { game } from "./tournament";

export const gameStatistics = mySqlTable("gameStatistics", {
    gameStatisticsId: serial("gameStatisticsId").primaryKey(),
    isPool: boolean("isPool").notNull().default(false),
    isBracket: boolean("isBracket").notNull().default(false),

    wins: int("wins").notNull().default(0),
    losses: int("losses").notNull().default(0),
    totalGames: int("totalGames").notNull().default(0),
    aces: int("aces").notNull().default(0),
    kills: int("kills").notNull().default(0),
    blocks: int("blocks").notNull().default(0),
    hittingErrors: int("hittingErrors").notNull().default(0),
    serviceErrors: int("serviceErrors").notNull().default(0),
    netViolations: int("netViolations").notNull().default(0),
    doubleContacts: int("doubleContacts").notNull().default(0),
    assits: int("assits").notNull().default(0),
    lifts: int("lifts").notNull().default(0),


    gameId: int("gameId").notNull(),
    userId: int("userId").notNull(),
    
});

export const gameStatisticsRelations = relations(gameStatistics, ({ one }) => ({
    game: one(game, { fields: [gameStatistics.gameId], references: [game.gameId] }),
    user: one(users, { fields: [gameStatistics.userId], references: [users.id] }),
}));
