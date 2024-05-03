import { relations, sql } from "drizzle-orm";
import { boolean, double, index, int, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/mysql-core";



import { mySqlTable } from "./_table";
import { gameStatistics } from "./stats";
import { team, userInTeam } from "./team";
import { division, tournament } from "./tournament";


export const users = mySqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  fullName: varchar("fullName", { length: 255 }),
  isAdmin: boolean("isAdmin").notNull().default(false),
  isTournamentDirector: boolean("isTournamentDirector").notNull().default(false),
  playerRating: double("playerRating", { precision: 7, scale: 2 }).notNull().default(1000.00),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  teamsParticipation: many(userInTeam),
  tournamentsDirected: many(tournament),
  invitationsSent: many(teamInvitations),
  teamInvitations: many(userInInvitations),
  gameStatistics: many(gameStatistics),
}));

export const accounts = mySqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<"oauth" | "oidc" | "email">()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
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
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mySqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mySqlTable(
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

export const comingSoon = mySqlTable("comingSoon", {
  id: serial('comingSoon').notNull().primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
});

export const teamInvitations = mySqlTable("teamInvitations", {
  id: serial('teamInvitations').notNull().primaryKey(),

  inviterId: int('inviterId').notNull(),
  tournamentId: int('tournamentId').notNull(),
  divisionId: int('divisionId').notNull(),

});

export const teamInvitationsRelations = relations(teamInvitations, ({ one, many }) => ({
  inviter: one(users, { fields: [teamInvitations.inviterId], references: [users.id] }),
  tournament: one(tournament, { fields: [teamInvitations.tournamentId], references: [tournament.tournamentId] }),
  division: one(division, { fields: [teamInvitations.divisionId], references: [division.divisionId] }),
  invitees: many(userInInvitations),
}));

export const userInInvitations = mySqlTable("userInInvitations", {
  teamInvitationId: int("teamInvitationId").notNull(),
  inviteeId: int("inviteeId").notNull(),
});

export const userInInvitationsRelations = relations(userInInvitations, ({ one }) => ({
  teamInvitation: one(teamInvitations, { fields: [userInInvitations.teamInvitationId], references: [teamInvitations.id] }),
  invitee: one(users, { fields: [userInInvitations.inviteeId], references: [users.id] }),
}))

export const tournamentDirectorRequests = mySqlTable("tournamentDirectorRequests", {
  id: serial('tournamentDirectorRequests').notNull().primaryKey(),
  content: text('content').notNull(),

  userId: varchar('userId', { length: 255 }).notNull(),
});

export const tournamentDirectorRequestsRelations = relations(tournamentDirectorRequests, ({ one }) => ({
  user: one(users, { fields: [tournamentDirectorRequests.userId], references: [users.id] }),
}));