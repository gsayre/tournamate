import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { schema } from "@/server/db";
import { eq } from "drizzle-orm";

export const tournamentDirectorRouter = createTRPCRouter({
  createTournament: protectedProcedure
    .input(
      z.object({
        tournamentDirectorId: z.string(),
        name: z.string(),
        dayTwo: z.boolean().optional(),
        dayOneDate: z.date(),
        dayOneFormat: z.enum([
          "none",
          "same sex doubles",
          "coed doubles",
          "reverse coed doubles",
          "same sex sixes",
          "coed sixes",
          "reverse coed quads",
          "same sex triples",
        ]),
        dayTwoDate: z.date().optional(),
        dayTwoFormat: z
          .enum([
            "none",
            "same sex doubles",
            "coed doubles",
            "reverse coed doubles",
            "same sex sixes",
            "coed sixes",
            "reverse coed quads",
            "same sex triples",
          ])
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(schema.tournament)
        .values({
          name: input.name,
          type: "none",
          dayOne: true,
          dayTwo: input.dayTwo ?? false,
          dayOneFormat: input.dayOneFormat,
          dayTwoFormat: input.dayTwoFormat,
          dayOneDate: input.dayOneDate,
          dayTwoDate: input.dayTwoDate,
          tournamentDirectorId: input.tournamentDirectorId,
        });
    }),
  getMyTournaments: protectedProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx, input }) => {
    const myTournaments = await ctx.db.select().from(schema.tournament).where(eq(schema.tournament.tournamentDirectorId, input.userId));
    return myTournaments;
  }),
});
