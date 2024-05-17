import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { clientSchema } from "@/server/db";

export const roleRouter = createTRPCRouter({
  createTournamentDirectorApplication: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(clientSchema.tournamentDirectorRequests)
        .values({ userId: input.userId });
    }),
});
