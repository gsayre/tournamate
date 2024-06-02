import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { eq, schema } from "@/server/db";

export const userRouter = createTRPCRouter({
  hasName: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(schema.users.id, input.userId),
      });
      return user?.name !== null;
    }),
  updateName: protectedProcedure
    .input(z.object({ userId: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(schema.users)
        .set({ name: input.name })
        .where(eq(schema.users.id, input.userId));
    }),
});
