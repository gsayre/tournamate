import { relations, sql } from "drizzle-orm";
import {
  boolean,
  double,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";
import { gameStatistics } from "./stats";
import { userInTeam } from "./team";
import { division, tournament } from "./tournament";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `tournamate_${name}`);


export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  isTournamentDirector: boolean("isTournamentDirector").default(false),
  playerRating: double("playerRating", { precision: 7, scale: 2 })
    .notNull()
    .default(1000.0),
  isAdmin: boolean("isAdmin").default(false),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  teamsParticipation: many(userInTeam),
  tournamentsDirected: many(tournament),
  invitationsSent: many(teamInvitations),
  teamInvitations: many(userInInvitations),
  gameStatistics: many(gameStatistics),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("accounts_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const tournamentDirectorRequests = createTable(
  "tournamentDirectorRequests",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
  },
);

export const tournamentDirectorRequestsRelations = relations(
  tournamentDirectorRequests,
  ({ one }) => ({
    user: one(users, {
      fields: [tournamentDirectorRequests.userId],
      references: [users.id],
    }),
  }),
);

export const teamInvitations = createTable("teamInvitations", {
  id: serial("teamInvitations").notNull().primaryKey(),

  inviterId: varchar("inviterId", { length: 255 }).notNull(),
  divisionId: int("divisionId").notNull(),
});

export const teamInvitationsRelations = relations(
  teamInvitations,
  ({ one, many }) => ({
    inviter: one(users, {
      fields: [teamInvitations.inviterId],
      references: [users.id],
    }),
    division: one(division, {
      fields: [teamInvitations.divisionId],
      references: [division.divisionId],
    }),
    invitees: many(userInInvitations),
  }),
);

export const userInInvitations = createTable("userInInvitations", {
  teamInvitationId: int("teamInvitationId").notNull(),
  inviteeId: varchar("inviteeId", { length: 255 }).notNull(),
});

export const userInInvitationsRelations = relations(
  userInInvitations,
  ({ one }) => ({
    teamInvitation: one(teamInvitations, {
      fields: [userInInvitations.teamInvitationId],
      references: [teamInvitations.id],
    }),
    invitee: one(users, {
      fields: [userInInvitations.inviteeId],
      references: [users.id],
    }),
  }),
);