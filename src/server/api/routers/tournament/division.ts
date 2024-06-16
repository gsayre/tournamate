import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { schema } from "@/server/db";
import { eq } from "drizzle-orm";

export const tournamentDivisionRouter = createTRPCRouter({
  addDivision: protectedProcedure
    .input(
      z.object({
        tournamentId: z.number(),
        divisionName: z.string(),
        divisionType: z.enum(["MENS", "WOMEN", "COED", "REVCO"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(schema.division).values({
        tournamentId: input.tournamentId,
        name: input.divisionName,
        type: input.divisionType,
      });
    }),
  getDivisions: protectedProcedure
    .input(z.object({ tournamentId: z.number() }))
    .query(async ({ ctx, input }) => {
      const divisions = await ctx.db.query.division.findMany({
        where: eq(schema.division.tournamentId, input.tournamentId),
        with: {
          entries: {
            with: {
              team: {
                with: {
                  players: true,
                },
              },
            },
          },
        },
      });
      return divisions;
    }),
  getDivision: protectedProcedure
    .input(z.object({ divisionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const division = await ctx.db.query.division.findFirst({
        where: eq(schema.division.divisionId, input.divisionId),
        with: {
          entries: {
            with: {
              team: {
                with: {
                  players: true,
                },
              },
            },
          },
        },
      });
      return division;
    }),
});
