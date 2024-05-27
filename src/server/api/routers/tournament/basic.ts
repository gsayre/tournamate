import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { schema } from "@/server/db";
import { eq } from "drizzle-orm";

export const tournamentBasicRouter = createTRPCRouter({
  getTournament: protectedProcedure
    .input(z.object({ tournamentId: z.number() }))
    .query(async ({ ctx, input }) => {
      const tournament = await ctx.db.select().from(schema.tournament).where(eq(schema.tournament.tournamentId, input.tournamentId));
      return tournament;
    }),
});
