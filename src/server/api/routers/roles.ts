import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { eq, schema } from "@/server/db";

export const roleRouter = createTRPCRouter({
  createTournamentDirectorApplication: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(schema.tournamentDirectorRequests)
        .values({ userId: input.userId });
    }),
  getActiveTournamentDirectorApplications: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      const activeTDRequest = ctx.db.query.tournamentDirectorRequests.findFirst({
        where: eq(schema.tournamentDirectorRequests.userId, input.userId),
      })
      return activeTDRequest !== undefined;
    }),
});
