import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { clientSchema } from "@/server/db";
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
        .update(clientSchema.users)
        .set({
          isTournamentDirector: true,
        })
        .where(eq(clientSchema.users.id, input.userId));
      await ctx.db
        .delete(clientSchema.tournamentDirectorRequests)
        .where(
          eq(clientSchema.tournamentDirectorRequests.userId, input.userId),
        );
    }),
  denyTournamentDirectorApplication: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(clientSchema.tournamentDirectorRequests)
        .where(
          eq(clientSchema.tournamentDirectorRequests.userId, input.userId),
        );
    }),
});
