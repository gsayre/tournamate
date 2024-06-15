import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { schema } from "@/server/db";
import { InferSelectModel, eq, like } from "drizzle-orm";

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
});
