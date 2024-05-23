import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { schema } from "@/server/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const adminRouter = createTRPCRouter({
  getTournamentDirectorApplication: protectedProcedure.query(
    async ({ ctx }) => {
      return ctx.db.query.tournamentDirectorRequests.findMany({
        with: {
          user: true,
        },
      });
    },
  ),
  approveTournamentDirectorApplication: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(schema.users)
        .set({
          isTournamentDirector: true,
        })
        .where(eq(schema.users.id, input.userId));
      await ctx.db
        .delete(schema.tournamentDirectorRequests)
        .where(eq(schema.tournamentDirectorRequests.userId, input.userId));
    }),
  denyTournamentDirectorApplication: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(schema.tournamentDirectorRequests)
        .where(eq(schema.tournamentDirectorRequests.userId, input.userId));
    }),
});
