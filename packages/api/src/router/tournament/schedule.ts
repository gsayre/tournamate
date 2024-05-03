import { z } from "zod";

import { eq, schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const scheduleRouter = createTRPCRouter({
  getPoolScheudule: protectedProcedure
    .input(z.object({ poolId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.pool.findFirst({
        where: eq(schema.pool.poolId, input.poolId),
        with: {
          games: {
            with: {
              teams: {
                with: { team: { with: { players: { with: { user: true } } } } },
              },
              referee: { with: { players: { with: { user: true } } } },
            },
          },
        },
      });
    }),
});
