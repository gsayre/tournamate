import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import {
  Type,
  Format,
  Game,
  Division,
  User,
  Tournament,
  TeamInvitation,
  Team,
  UsersInTeam,
} from "@prisma/client";

export const tournamentRouter = router({
  //Tournament Queries/Mutations
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
        const tournament: Tournament = await ctx.prisma.tournament.create({
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
      const tournamentDirector: User | null = await ctx.prisma.user.findUnique({
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
  getOwnedTournaments: protectedProcedure.query(async ({ ctx }) => {
    const tournaments = await ctx.prisma.tournament.findMany({
      where: {
        tournamentDirectorId: ctx.user.id,
      },
    });
    return tournaments;
  }),

  //Pool Queries/Mutations
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

  getMyPool: protectedProcedure.input(z.object({divisionId: z.number()})).query(async ({ctx, input}) => {
    const myPool = await ctx.prisma.pool.findMany({
      where: {
        teams: {
          some: {
            players: {
              some: {
                userId: ctx.user.id
              }
            }
          }
        }
      },
      include: {
        teams: {
          select: {
            players: {
              select: {
                user: true
              }
            },
            poolWins: true,
            poolLosses: true
          }
        }
      }
    })
    return myPool
  }),
  //Division Queries/Mutations
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
  getDivision: protectedProcedure
    .input(z.object({ divisionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const division = await ctx.prisma.division.findUnique({
        where: {
          divisionId: input.divisionId,
        },
        include: {
          entries: {
            include: {
              players: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
      return division;
    }),
  getDivisions: protectedProcedure
    .input(z.object({ tournamentId: z.number() }))
    .query(async ({ ctx, input }) => {
      const divisions = await ctx.prisma.division.findMany({
        where: {
          tournamentId: input.tournamentId,
        },
        include: {
          entries: {
            include: {
              players: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
      return divisions;
    }),
  getDivisionsByType: protectedProcedure
    .input(z.object({ tournamentId: z.number(), type: z.string() }))
    .query(async ({ ctx, input }) => {
      const divisions: Division[] = await ctx.prisma.division.findMany({
        where: {
          tournamentId: input.tournamentId,
          type: input.type,
        },
        include: {
          entries: {
            include: {
              players: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
      return divisions;
    }),
  getDivisionsForPartner: protectedProcedure
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

  //Team Queries/Mutations
  createTeamInvitation: protectedProcedure
    .input(
      z.object({
        teammateId: z.string(),
        tournamentId: z.coerce.number(),
        divisionId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const teamInvitation = await ctx.prisma.teamInvitation.create({
        data: {
          inviterId: ctx.user.id,
          tournamentId: input.tournamentId,
          divisionId: input.divisionId,
          invitees: {
            create: [
              {
                Invitee: {
                  connect: { id: input.teammateId },
                },
              },
            ],
          },
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
              id: ctx.user.id,
            },
          },
        },
      },
    });
    return teamInvitations;
  }),
  acceptTeamInvitation: protectedProcedure
    .input(
      z.object({
        teamInvitationId: z.number(),
        inviterId: z.string(),
        tournamentId: z.coerce.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const teamInvitation = await ctx.prisma.teamInvitation.delete({
        where: {
          inviteId: input.teamInvitationId,
        },
        include: {
          invitees: true,
        },
      });
      //delete the users in invitation field
      if (!teamInvitation) {
        throw new Error("Team invitation not found");
      }
      //create a team
      const team = await ctx.prisma.team.create({
        data: {
          divisionId: teamInvitation.divisionId,
          tournamentId: input.tournamentId,
        },
      });
      if (!team) {
        throw new Error("Team not found");
      }
      const updateWithInviter = await ctx.prisma.team.update({
        where: { teamId: team.teamId },
        data: {
          players: {
            create: [
              {
                user: {
                  connect: { id: input.inviterId },
                },
              },
            ],
          },
        },
      });
      const updateWithOtherInvitees = teamInvitation.invitees.map((invitee) => {
        ctx.prisma.team.update({
          where: { teamId: team.teamId },
          data: {
            players: {
              create: [
                {
                  user: {
                    connect: { id: invitee.inviteeId },
                  },
                },
              ],
            },
          },
        });
      });
      const divUpdated = await ctx.prisma.division.update({
        where: {
          divisionId: teamInvitation.divisionId,
        },
        data: {
          entries: {
            connect: {
              teamId: team.teamId,
            },
          },
        },
      });
      return divUpdated;
    }),
  declineTeamInvitation: protectedProcedure
    .input(z.object({ teamInvitationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const teamInvitation = await ctx.prisma.teamInvitation.delete({
        where: {
          inviteId: input.teamInvitationId,
        },
      });
      if (!teamInvitation) {
        throw new Error("Team invitation not found");
      }
      return null;
    }),
  getTopFiveParnterResults: protectedProcedure
    .input(z.object({ partner: z.string() }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.prisma.user.findMany({
        where: {
          fullName: {
            search: input.partner,
          },
        },
      });
      return results;
    }),
  startTournamentDay: protectedProcedure
    .input(z.object({ tournamentId: z.number(), tournamentDay: z.number() }))
    .mutation(async ({ ctx, input }) => {
      let tournament;
      if (input.tournamentDay === 1) {
        tournament = await ctx.prisma.tournament.update({
          where: {
            tournamentId: input.tournamentId,
          },
          data: {
            dayOneStarted: true,
          },
        });
      } else {
        tournament = await ctx.prisma.tournament.update({
          where: {
            tournamentId: input.tournamentId,
          },
          data: {
            dayTwoStarted: true,
          },
        });
      }
      return tournament;
    }),
  mockTournamentEntries: protectedProcedure
    .input(
      z.object({
        divisionId: z.number(),
        tournamentId: z.number(),
        typeOfEntry: z.nativeEnum(Format),
        sexOfEntry: z.enum(["MENS", "WOMENS"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let fullName: string, idSegment: string;
      let entryOneBoy, entryTwoBoy, entryOneGirl, entryTwoGirl;
      // create two users
      if (input.typeOfEntry === "SAME_SEX_DOUBLES") {
        if (input.sexOfEntry === "MENS") {
          idSegment = Math.ceil(Math.random() * 1000000000).toString();
          fullName = `Boy ${idSegment}`;
          entryOneBoy = await ctx.prisma.user.create({
            data: {
              id: idSegment,
              fullName: fullName,
              playerRating: Math.floor(Math.random() * (1500 - 500) + 500),
            },
          });
          idSegment = Math.ceil(Math.random() * 1000000000).toString();
          fullName = `Boy ${idSegment}`;
          entryTwoBoy = await ctx.prisma.user.create({
            data: {
              id: idSegment,
              fullName: fullName,
              playerRating: Math.floor(Math.random() * (1500 - 500) + 500),
            },
          });
        } else if (input.sexOfEntry === "WOMENS") {
          idSegment = Math.ceil(Math.random() * 1000000000).toString();
          fullName = `Girl ${idSegment}`;
          entryOneGirl = await ctx.prisma.user.create({
            data: {
              id: idSegment,
              fullName: fullName,
              playerRating: Math.floor(Math.random() * (1500 - 500) + 500),
            },
          });
          idSegment = Math.ceil(Math.random() * 1000000000).toString();
          fullName = `Girl ${idSegment}`;
          entryTwoGirl = await ctx.prisma.user.create({
            data: {
              id: idSegment,
              fullName: fullName,
              playerRating: Math.floor(Math.random() * (1500 - 500) + 500),
            },
          });
        }
      } else if (
        input.typeOfEntry === "COED_DOUBLES" ||
        input.typeOfEntry === "REVERSE_COED_DOUBLES"
      ) {
        idSegment = Math.ceil(Math.random() * 1000000000).toString();
        fullName = `Boy ${idSegment}`;
        entryOneBoy = await ctx.prisma.user.create({
          data: {
            id: idSegment,
            fullName: fullName,
            playerRating: Math.floor(Math.random() * (1500 - 500) + 500),
          },
        });
        idSegment = Math.ceil(Math.random() * 1000000000).toString();
        fullName = `Girl ${idSegment}`;
        entryOneGirl = await ctx.prisma.user.create({
          data: {
            id: idSegment,
            fullName: fullName,
            playerRating: Math.floor(Math.random() * (1500 - 500) + 500),
          },
        });
      }

      let teammateOneId, teammateTwoId;
      let teammateOne, teammateTwo;
      // create a team and add the users to the team and to the division
      if (input.typeOfEntry === "SAME_SEX_DOUBLES") {
        if (input.sexOfEntry === "MENS") {
          teammateOne = entryOneBoy;
          teammateTwo = entryTwoBoy;
          teammateOneId = entryOneBoy?.id;
          teammateTwoId = entryTwoBoy?.id;
        } else if (input.sexOfEntry === "WOMENS") {
          teammateOne = entryOneGirl;
          teammateTwo = entryTwoBoy;
          teammateOneId = entryOneGirl?.id;
          teammateTwoId = entryTwoGirl?.id;
        }
      } else if (
        input.typeOfEntry === "COED_DOUBLES" ||
        input.typeOfEntry === "REVERSE_COED_DOUBLES"
      ) {
        teammateOne = entryOneBoy;
        teammateTwo = entryOneGirl;
        teammateOneId = entryOneBoy?.id;
        teammateTwoId = entryOneGirl?.id;
      }
      const entryTeam = await ctx.prisma.team.create({
        data: {
          divisionId: input.divisionId,
          tournamentId: input.tournamentId,
          teamRating:
            teammateOne && teammateTwo
              ? (teammateOne?.playerRating + teammateTwo?.playerRating) / 2
              : 1000,
          players: {
            create: [
              {
                user: {
                  connect: {
                    id: teammateOneId,
                  },
                },
              },
              {
                user: {
                  connect: {
                    id: teammateTwoId,
                  },
                },
              },
            ],
          },
        },
      });
      return entryTeam;
    }),
  updatePool: protectedProcedure
    .input(
      z.object({
        poolId: z.string().nullable(),
        divisionId: z.number(),
        isDayOf: z.boolean().nullable(),
        division: z.object({
          divisionId: z.number(),
          name: z.string(),
          type: z.string(),
          isDayOf: z.boolean(),
          tournamentId: z.number(),
          entries: z.array(
            z.object({
              teamId: z.number(),
              teamRating: z.number(),
              divisionId: z.number(),
              tournamentId: z.number(),
              poolId: z.string().nullable(),
              players: z.array(
                z.object({
                  userId: z.string(),
                  teamId: z.number(),
                  user: z.object({
                    id: z.string(),
                    fullName: z.string(),
                    isAdmin: z.boolean(),
                    isTournamentDirector: z.boolean(),
                    playerRating: z.number(),
                  }),
                })
              ),
            })
          ),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newPools = createPoolsFromEntries(input.division);
      const newPoolsWithoutEntries = newPools.map((pool, i) => {
        return {
          divisionId: input.divisionId,
          poolId: "Division " + input.divisionId + " Pool " + i,
        };
      });
      const newPoolsWithEntries = newPools.map((pool, i) => {
        return {
          poolId: "Division " + input.divisionId + " Pool " + i,
          teams: pool.map((team) => {
            return { teamId: team.teamId };
          }),
        };
      });

      const deletedPools = await ctx.prisma.pool.deleteMany({
        where: {
          divisionId: input.divisionId,
        },
      });

      for (let i = 0; i < newPoolsWithoutEntries.length; i++) {
        const newPool = await ctx.prisma.pool.create({
          data: {
            poolId: newPoolsWithoutEntries[i].poolId,
            divisionId: newPoolsWithoutEntries[i].divisionId,
          },
        });
      }

      for (let i = 0; i < newPoolsWithEntries.length; i++) {
        const poolsWithTeams = await ctx.prisma.pool.update({
          where: {
            poolId: newPoolsWithEntries[i].poolId,
          },
          data: {
            teams: {
              connect: newPoolsWithEntries[i].teams,
            },
          },
        });
      }

      return null;
    }),
  toggleDayOfDivision: protectedProcedure
    .input(z.object({ divisionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const updatedDivision = await ctx.prisma.division.update({
        where: {
          divisionId: input.divisionId,
        },
        data: {
          isDayOf: true,
        },
      });

      return { updatedDivision };
    }),
  getPoolsByDivision: protectedProcedure
    .input(z.object({ divisionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const poolsForDivision = await ctx.prisma.pool.findMany({
        where: {
          divisionId: input.divisionId,
        },
        include: {
          teams: {
            include: {
              players: {
                include: {
                  user: true,
                },
              },
            },
            orderBy: {
              teamRating: "desc"
            }
          },
          games: {
            include: {
              teams: {
                include: {
                  Team: {
                    include: {
                      players: {
                        include: {
                          user: true,
                        },
                      },
                    },
                  },
                },
              },
              referees: true,
            },
          },
        },
      });
      return poolsForDivision;
    }),
});

type FakeTeamCriteria = {
  teamId: number;
  divisionId: number;
  teamRating: number;
  tournamentId: number;
  poolId: number;
  userOneId: string;
  userTwoId: string;
  userOneName: string;
  userTwoName: string;
};

type FakeEntriesTeamArr = FakeEntriesTeam[];

export type FakeEntriesTeam = Team & {
  players: (UsersInTeam & {
    user: User;
  })[];
  poolWins: number;
  poolLosses: number;
};

export function createFakeTeam({
  teamId,
  teamRating,
  divisionId,
  tournamentId,
  poolId,
  userOneId,
  userTwoId,
  userOneName,
  userTwoName,
}: FakeTeamCriteria): Team {
  const fakeTeam = {
    teamId,
    divisionId,
    tournamentId,
    teamRating,
    poolId,
    poolWins: 0,
    poolLosses: 0,
    players: [
      {
        userId: userOneId,
        teamId,
        user: {
          id: userOneId,
          fullName: userOneName,
          isAdmin: false,
          isTournamentDirector: false,
          playerRating: Math.floor(Math.random() * 1500),
        },
      },
      {
        userId: userTwoId,
        teamId,
        user: {
          id: userTwoId,
          fullName: userTwoName,
          isAdmin: false,
          isTournamentDirector: false,
          playerRating: Math.floor(Math.random() * 1500),
        },
      },
    ],
  };
  return fakeTeam;
}

export type DivisionEntriesForPool = Division & {
  entries: (Team & {
    players: (UsersInTeam & {
      user: User;
    })[];
  })[];
};

export type TeamWithPlayerData = (Team & {
  players: (UsersInTeam & {
    user: User;
  })[];
})[];

export const createPoolsFromEntries = (
  division: DivisionEntriesForPool
): Array<TeamWithPlayerData> => {
  const returnArr: Array<TeamWithPlayerData> = [];
  let zigzag = 0;
  let zig = false;
  let zag = false;
  let pausezigzag = false;
  division.entries.sort(function (a, b) {
    return b.teamRating - a.teamRating;
  });
  if (division.entries.length > 5) {
    const numPools = Math.ceil(division.entries.length / 4);
    for (let i = 0; i < numPools; i++) {
      returnArr.push([]);
    }
    for (const team of division.entries) {
      if (zigzag == 0 && zag == false && zig == false) {
        zig = true;
        zag = false;
        returnArr[zigzag].push(team);
        zigzag++;
      } else if (zigzag == 0) {
        zig = true;
        zag = false;
        returnArr[zigzag].push(team);
        if (pausezigzag) {
          pausezigzag = false;
          zigzag++;
        } else {
          pausezigzag = true;
        }
      } else if (zigzag == numPools - 1) {
        zig = false;
        zag = true;
        returnArr[zigzag].push(team);
        if (pausezigzag) {
          pausezigzag = false;
          zigzag--;
        } else {
          pausezigzag = true;
        }
      } else if (zig) {
        returnArr[zigzag].push(team);
        zigzag++;
      } else if (zag) {
        returnArr[zigzag].push(team);
        zigzag--;
      }
    }
    return returnArr;
  } else {
    returnArr.push(division.entries);
    return returnArr;
  }
};
