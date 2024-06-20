import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { db, schema } from "@/server/db";
import { type InferSelectModel, eq, like, and } from "drizzle-orm";
import { division } from "@/server/db/schema/tournament";

export type findPartnerQueryT = InferSelectModel<typeof schema.users>;

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
              division: true,
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
      //Add users to the division for the tournament
      const invite = await ctx.db.query.teamInvitations.findFirst({
        where: eq(schema.teamInvitations.id, input.inviteId),
        with: {
          division: true,
          invitees: true,
          inviter: true,
        },
      });
      if (!invite) return;
      await ctx.db.insert(schema.userInTeam).values({
        teamId: input.divisionId,
        userId: input.userId,
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
      const deletedInviteArr = await ctx.db
        .select({ inviteId: schema.teamInvitations.id })
        .from(schema.teamInvitations)
        .where(eq(schema.teamInvitations.id, input.inviteId))
        .execute();
      for (const deletedInvite of deletedInviteArr) {
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
                deletedInvite.inviteId,
              ),
            ),
          )
          .execute();
      }
    }),
});
