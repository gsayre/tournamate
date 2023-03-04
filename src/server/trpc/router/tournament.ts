import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { Type, Format, Game } from "@prisma/client";

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
            tournamentDirector: { connect: { id: ctx.user.id } },
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
            tournamentDirector: { connect: { id: ctx.user.id } },
          },
        });
        return tournament;
      }
    }),
  getOwnedTournaments: protectedProcedure.query(async ({ ctx }) => {
    const tournaments = await ctx.prisma.tournament.findMany({
      where: {
        tournamentDirectorId: ctx.user.id,
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
      return { tournament, tournamentDirector };
    }),
  getTournaments: protectedProcedure.query(async ({ ctx }) => {
    const tournaments = await ctx.prisma.tournament.findMany();
    return tournaments;
  }),
  createDivision: protectedProcedure
    .input(
      z.object({
        divisionName: z.string().min(1),
        tournamentId: z.number(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const division = await ctx.prisma.division.create({
        data: {
          name: input.divisionName,
          tournamentId: input.tournamentId,
          type: input.type,
        },
      });
      return division;
    }),

  getDivisionsByType: protectedProcedure
    .input(z.object({ tournamentId: z.number(), type: z.string() }))
    .query(async ({ ctx, input }) => {
      const divisions = await ctx.prisma.division.findMany({
        where: {
          tournamentId: input.tournamentId,
          type: input.type,
        },
      });
      return divisions;
    }),
  getDivision: protectedProcedure
    .input(z.object({ divisionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const division = await ctx.prisma.division.findUnique({
        where: {
          divisionId: input.divisionId,
        },
      });
      return division;
    }),
  getPools: protectedProcedure
    .input(z.object({ divisionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const pools = await ctx.prisma.pool.findMany({
        where: {
          divisionId: input.divisionId,
        },
      });
      return pools;
    }),
  getDivisions: protectedProcedure
    .input(z.object({ tournamentId: z.number() }))
    .query(async ({ ctx, input }) => {
      const divisions = await ctx.prisma.division.findMany({
        where: {
          tournamentId: input.tournamentId,
        },
      });
      return divisions;
    }),
    createPools: protectedProcedure.input(z.object({ divisionId: z.number() })).mutation(async ({ ctx, input }) => {
      const division = await ctx.prisma.division.findUnique({
        where: {
          divisionId: input.divisionId,
        },
        select: {
          entries: true,
        }
      });
      if (!division) {
        throw new Error("Division not found");
      }

      if (division.entries.length < 4) {
       const pool =  await ctx.prisma.pool.create({
          data: {
            divisionId: input.divisionId,
          },
        })
        switch (division.entries.length) {
          case 3:
          
          case 4:

        }
    }else{

      }
}),
getTopFiveParnterResults: protectedProcedure.input(z.object({ partner: z.string() })).query(async ({ ctx, input }) => {
  const results = await ctx.prisma.user.findMany({
    where: {
      fullName: {
        search: input.partner
      }
    }
  });
  return results;
}),
  createTeamInvitation: protectedProcedure.input(z.object({ teammateId: z.string(), tournamentId: z.coerce.number() })).mutation(async ({ ctx, input }) => {
    const teamInvitation = await ctx.prisma.teamInvitation.create({
      data: {
        inviterId: ctx.user.id,
        tournamentId: input.tournamentId,
        invitees: {
          create: [
            {
              Invitee: {
                connect: { id: input.teammateId }
              }
            }
          ]
        }
      },
    });
    return teamInvitation;
  }),
  getTeamInvitations: protectedProcedure.query(async ({ ctx }) => {
    const teamInvitations = await ctx.prisma.teamInvitation.findMany({
      where: {
        invitees: {
          some: {
            Invitee: {
              id: ctx.user.id
            }
          }
        }
      }
    })
    return teamInvitations;
  }),
  acceptTeamInvitation: protectedProcedure.input(z.object({ teamInvitationId: z.number(), inviterId: z.string() })).mutation(async ({ ctx, input }) => {
    const teamInvitation = await ctx.prisma.teamInvitation.delete({
      where: {
        inviteId: input.teamInvitationId
      }
    });
    //delete the users in invitation field
    if (!teamInvitation) {
      throw new Error("Team invitation not found");
    }
    //create a team
    // const team = await ctx.prisma.team.create({
    //   data: {
    //     tournamentId: teamInvitation.tournamentId,
    //     divisionId:
    //   }
    // })
    return null;
  }),
  declineTeamInvitation: protectedProcedure.input(z.object({ teamInvitationId: z.number() })).mutation(async ({ ctx, input }) => {
    const teamInvitation = await ctx.prisma.teamInvitation.delete({
      where: {
        inviteId: input.teamInvitationId
      }
    });
    if (!teamInvitation) {
      throw new Error("Team invitation not found");
    }
    return null;
  }),
})