import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { schema } from "@/server/db";

export const tournamentDirectorRouter = createTRPCRouter({
  createTournament: protectedProcedure
    .input(z.object({ tournamentDirectorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return 1;
    }),
});
