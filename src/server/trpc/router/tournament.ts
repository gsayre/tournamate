import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { Type, Format } from "@prisma/client";

export const tournamentRouter = router({
  createTournament: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.nativeEnum(Type),
        dayOne: z.boolean(),
        dayTwo: z.boolean().optional().nullable(),
        dayOneFormat: z.nativeEnum(Format),
        dayTwoFormat: z.nativeEnum(Format).optional().nullable(),
        dayOneDate: z.date(),
        dayTwoDate: z.date().optional().nullable(),
        location: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.dayTwo) {
        const tournament = await ctx.prisma.tournament.create({
          data: {
            name: input.name,
            type: input.type,
            dayOne: input.dayOne,
            dayOneFormat: input.dayOneFormat,
            dayOneDate: input.dayOneDate,
            location: input.location,
            tournamentDirector: { connect: { id: ctx.session.user.id } },
          },
        });
        return tournament;
      } else {
        const tournament = await ctx.prisma.tournament.create({
          data: {
            name: input.name,
            type: input.type,
            dayOne: input.dayOne,
            dayTwo: input.dayTwo,
            dayOneFormat: input.dayOneFormat,
            dayTwoFormat: input.dayTwoFormat,
            dayOneDate: input.dayOneDate,
            dayTwoDate: input.dayTwoDate,
            location: input.location,
            tournamentDirector: { connect: { id: ctx.session.user.id } },
          },
        });
        return tournament;
      }
    }),
  getOwnedTournaments: protectedProcedure.query(async ({ ctx }) => {
    const tournaments = await ctx.prisma.tournament.findMany({
      where: {
        tournamentDirectorId: ctx.session.user.id,
      },
    });
    return tournaments;
  }),
  getTournament: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const tournament = await ctx.prisma.tournament.findUnique({
        where: {
          tournamentId: input.id,
        },
      });
      if (!tournament) {
        throw new Error("Tournament not found");
      }
      const tournamentDirector = await ctx.prisma.user.findUnique({
        where: {
          id: tournament.tournamentDirectorId,
        },
      });
      return {tournament, tournamentDirector};
    }),

  createDivision: protectedProcedure.input(
    z.object({ divisionName: z.string(), tournamentId: z.number(), type: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const division = await ctx.prisma.division.create({
        data: {
          name: input.divisionName,
          tournamentId: input.tournamentId,
          type: input.type,
        }
      })
      return division;
    }),
  
  getDivisions: protectedProcedure
    .input(z.object({ tournamentId: z.number(), type: z.string() }))
    .query(async ({ ctx, input }) => {
      const divisions = await ctx.prisma.division.findMany({
        where: {
          tournamentId: input.tournamentId,
          type: input.type
        }
      })
      return divisions;
    }),
});
