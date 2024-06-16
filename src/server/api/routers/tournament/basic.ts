import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { schema } from "@/server/db";
import { type InferSelectModel, eq, like } from "drizzle-orm";

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
  createPartnerInvie: protectedProcedure
    .input(
      z.object({
        playerId: z.string(),
        divisionId: z.number(),
        inviterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Create the team invitation
      const teamInvitation = await ctx.db.insert(schema.teamInvitations).values({ inviterId: input.inviterId, divisionId: input.divisionId }).execute();
      if (teamInvitation.insertId) {
        // Add the invitee to the team invitation
        await ctx.db.insert(schema.userInInvitations).values({ teamInvitationId: parseInt(teamInvitation.insertId), inviteeId: input.playerId }).execute();
      }
    }),
});
