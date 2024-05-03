import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { eq, schema } from "@acme/db";

export const divisionRouter = createTRPCRouter({
  updateNumBreakingPool: protectedProcedure
    .input(z.object({ divisionId: z.number(), numBreaking: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.update(schema.division).set({ numBreakingPool: input.numBreaking }).where(eq(schema.division.divisionId,input.divisionId));
    }),
  allowWildCards: protectedProcedure
    .input(z.object({ divisionId: z.number() }))  
    .mutation(async ({ input, ctx }) => {
      return ctx.db.update(schema.division).set({ hasWildcards: true, numWildcards: 2 }).where(eq(schema.division.divisionId,input.divisionId));
    }),
});
