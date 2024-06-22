import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { schema } from "@/server/db";
import { type InferSelectModel, eq, like, and, lt, gte } from "drizzle-orm";

export type findPartnerQueryT = InferSelectModel<typeof schema.users>;
export type getTournamentInvitesQueryT = InferSelectModel<typeof schema.teamInvitations>;

export const tournamentBasicRouter = createTRPCRouter({
  getTournament: protectedProcedure
    .input(z.object({ tournamentId: z.number() }))
    .query(async ({ ctx, input }) => {
      const tournament = await ctx.db
        .select()
        .from(schema.tournament)
        .where(eq(schema.tournament.tournamentId, input.tournamentId));
      return tournament;
    }),
  getPastTournaments: protectedProcedure.query(async ({ ctx }) => {
      const tournaments = await ctx.db.query.tournament.findMany({
        where: lt(schema.tournament.dayOneDate, new Date()),
      });
      return tournaments;
    }),
  getUpcomingTournaments: protectedProcedure.query(async ({ ctx }) => {
      const tournaments = await ctx.db.query.tournament.findMany({
        where: gte(schema.tournament.dayOneDate, new Date()),
      });
      return tournaments;
    }),
  findPartner: protectedProcedure
    .input(z.object({ playerName: z.string() }))
    .query(async ({ ctx, input }) => {
      const potentialPartners = await ctx.db
        .select()
        .from(schema.users)
        .where(like(schema.users.name, "%" + input.playerName + "%"));
      return potentialPartners;
    }),
  createPartnerInvite: protectedProcedure
    .input(
      z.object({
        playerId: z.string(),
        divisionId: z.number(),
        inviterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Create the team invitation
      const teamInvitation = await ctx.db
        .insert(schema.teamInvitations)
        .values({ inviterId: input.inviterId, divisionId: input.divisionId })
        .execute();
      if (teamInvitation.insertId) {
        // Add the invitee to the team invitation
        await ctx.db
          .insert(schema.userInInvitations)
          .values({
            teamInvitationId: parseInt(teamInvitation.insertId),
            inviteeId: input.playerId,
          })
          .execute();
      }
    }),
  getTournamentInvites: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const invites = await ctx.db.query.userInInvitations.findMany({
        where: eq(schema.userInInvitations.inviteeId, input.userId),
        with: {
          teamInvitation: {
            with: {
              division: {
                with: {
                  tournament: true,
                }
              },
              inviter: true,
            },
          },
        },
      });
      return invites;
    }),
  acceptTournamentInvite: protectedProcedure
    .input(
      z.object({
        inviteId: z.number(),
        userId: z.string(),
        divisionId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //Fetch the team invitation
      const invite = await ctx.db.query.teamInvitations.findFirst({
        where: eq(schema.teamInvitations.id, input.inviteId),
        with: {
          division: true,
          invitees: true,
          inviter: true,
        },
      });
      if (!invite) return;
      //Create the team
      const team = await ctx.db
        .insert(schema.team)
        .values({
          tournamentId: invite.division.tournamentId,
          divisionId: input.divisionId,
        })
        .execute();
      const teamId = parseInt(team.insertId);
      //Add the players to the team
      await ctx.db.insert(schema.userInTeam).values({
        userId: invite.inviter.id,
        teamId: teamId,
      });
      for (const invitee of invite.invitees) {
        await ctx.db.insert(schema.userInTeam).values({
          userId: invitee.inviteeId,
          teamId: teamId,
        });
      }
      //Add the team to the division
      await ctx.db.insert(schema.teamInDivision).values({
        teamId: teamId,
        divisionId: input.divisionId,
      });

      //Delete the invitation and related rows
      if (invite?.invitees) {
        for (const invitee of invite?.invitees) {
          await ctx.db
            .delete(schema.teamInvitations)
            .where(
              and(
                eq(schema.teamInvitations.id, input.inviteId),
                eq(schema.teamInvitations.divisionId, input.divisionId),
              ),
            )
            .execute();
          await ctx.db
            .delete(schema.userInInvitations)
            .where(
              and(
                eq(schema.userInInvitations.inviteeId, input.userId),
                eq(
                  schema.userInInvitations.teamInvitationId,
                  invitee.teamInvitationId,
                ),
              ),
            )
            .execute();
        }
      }
    }),
  declineTournamentInvite: protectedProcedure
    .input(
      z.object({
        inviteId: z.number(),
        userId: z.string(),
        divisionId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //Delete the invitation and related rows
      const invite = await ctx.db.query.teamInvitations.findFirst({
        where: eq(schema.teamInvitations.id, input.inviteId),
        with: {
          division: true,
          invitees: true,
          inviter: true,
        },
      });
      if (!invite) return;
      //Delete the invitation and related rows
      await ctx.db
        .delete(schema.userInInvitations)
        .where(
          and(
            eq(schema.userInInvitations.inviteeId, input.userId),
            eq(schema.userInInvitations.teamInvitationId, input.inviteId),
          ),
        )
        .execute();
      await ctx.db
        .delete(schema.teamInvitations)
        .where(
          and(
            eq(schema.teamInvitations.inviterId, invite.inviterId),
            eq(schema.teamInvitations.id, input.inviteId),
          ),
        )
        .execute();
    }),
});
