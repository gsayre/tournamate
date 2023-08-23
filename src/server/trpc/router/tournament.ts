import { router, protectedProcedure } from "../trpc";
import { number, z } from "zod";
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

  getMyPool: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const myPool = await ctx.prisma.pool.findMany({
      where: {
        teams: {
          some: {
            players: {
              some: {
                userId: ctx.user.id,
              },
            },
          },
        },
      },
      include: {
        teams: {
          select: {
            players: {
              select: {
                user: true,
              },
            },
            poolWins: true,
            poolLosses: true,
          },
        },
      },
    });
    return {
      myPool,
      firstName: ctx.user.firstName,
      lastName: ctx.user.lastName,
    };
  }),

  getMyScheudule: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      const mySchedule = await ctx.prisma.pool.findMany({
        where: {
          teams: {
            some: {
              players: {
                some: {
                  userId: ctx.user.id,
                },
              },
            },
          },
        },
        include: {
          games: {
            orderBy: {
              gameOrder: "asc",
            },
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
              referees: {
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
        },
      });
      return {
        mySchedule,
        firstName: ctx.user.firstName,
        lastName: ctx.user.lastName,
      };
    }),

  createPoolSchedule: protectedProcedure
    .input(z.object({ divisionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const divisionToAddSchedule = await ctx.prisma.division.findUnique({
        where: {
          divisionId: input.divisionId,
        },
        include: {
          pools: {
            include: {
              teams: {
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
        },
      });
      let deletedSchedule;
      let schedulesCreated = [];
      if (divisionToAddSchedule && divisionToAddSchedule.pools) {
        deletedSchedule = await ctx.prisma.game.deleteMany({
          where: {
            pool: {
              divisionId: input.divisionId,
            },
          },
        });
        for (let i = 0; i < divisionToAddSchedule?.pools.length; i++) {
          const gamesCreated = [];
          let team1, team2, team3, team4, team5, team6, team7, team8;
          let game1,
            game2,
            game3,
            game4,
            game5,
            game6,
            game7,
            game8,
            game9,
            game10;
          switch (divisionToAddSchedule.pools[i].teams.length) {
            case 3:
              [team1, team2, team3] = divisionToAddSchedule.pools[i].teams;
              game1 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team2.teamId,
                  gameOrder: 1,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team1.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team3.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game2 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team1.teamId,
                  gameOrder: 2,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team2.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team3.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game3 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team3.teamId,
                  gameOrder: 3,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team1.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team2.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game4 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  refereeId: team2.teamId,
                  gameOrder: 4,
                  numSets: 1,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team1.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team3.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game5 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  refereeId: team1.teamId,
                  gameOrder: 5,
                  numSets: 1,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team2.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team3.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game6 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  refereeId: team2.teamId,
                  gameOrder: 6,
                  numSets: 1,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team1.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team2.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              gamesCreated.push(game1, game2, game3, game4, game5, game6);
              break;
            case 4:
              [team1, team2, team3, team4] =
                divisionToAddSchedule.pools[i].teams;
              // add 6 games to the pool with 4 teams
              game1 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team2.teamId,
                  gameOrder: 1,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team1.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team4.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game2 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team4.teamId,
                  gameOrder: 2,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team2.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team3.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game3 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team1.teamId,
                  gameOrder: 3,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team2.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team4.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game4 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team2.teamId,
                  gameOrder: 4,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team1.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team3.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game5 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team1.teamId,
                  gameOrder: 5,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team3.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team4.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game6 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team3.teamId,
                  gameOrder: 6,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team1.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team2.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              gamesCreated.push(game1, game2, game3, game4, game5, game6);
              break;
            case 5:
              [team1, team2, team3, team4, team5] =
                divisionToAddSchedule.pools[i].teams;
              game1 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team2.teamId,
                  gameOrder: 1,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team1.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team5.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game2 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team5.teamId,
                  gameOrder: 2,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team2.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team4.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game3 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team1.teamId,
                  gameOrder: 3,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team2.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team5.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game4 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team2.teamId,
                  gameOrder: 4,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team1.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team3.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game5 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team1.teamId,
                  gameOrder: 5,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team3.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team5.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game6 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team1.teamId,
                  gameOrder: 6,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team3.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team5.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game7 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team3.teamId,
                  gameOrder: 7,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team1.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team4.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game8 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team1.teamId,
                  gameOrder: 8,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team3.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team4.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              game9 = await ctx.prisma.game.create({
                data: {
                  poolId: divisionToAddSchedule.pools[i].poolId,
                  gameOneScoreCap: 21,
                  gameTwoScoreCap: 21,
                  refereeId: team3.teamId,
                  gameOrder: 9,
                  numSets: 2,
                  teams: {
                    create: [
                      {
                        Team: {
                          connect: {
                            teamId: team1.teamId,
                          },
                        },
                      },
                      {
                        Team: {
                          connect: {
                            teamId: team2.teamId,
                          },
                        },
                      },
                    ],
                  },
                },
              });
              gamesCreated.push(
                game1,
                game2,
                game3,
                game4,
                game5,
                game6,
                game7,
                game8,
                game9
              );
              break;
            case 6:
              break;
            case 7:
              break;
            case 8:
              break;
          }
          schedulesCreated.push(gamesCreated);
        }
      }
      return {
        divisionForAdding: divisionToAddSchedule,
        deletedSchedules: deletedSchedule,
        schedulesCreated: schedulesCreated,
      };
    }),

  addPointToGameMock: protectedProcedure
    .input(z.object({ gameId: z.number(), gameNumber: z.number() }))
    .mutation(async ({ ctx, input }) => {
      let pointAdded;
      switch (input.gameNumber) {
        case 1: {
          if (Math.random() < 0.5) {
            pointAdded = await ctx.prisma.game.update({
              where: {
                gameId: input.gameId,
              },
              data: {
                gameOneTeamOneScore: {
                  increment: 1,
                },
              },
            });
          } else {
            pointAdded = await ctx.prisma.game.update({
              where: {
                gameId: input.gameId,
              },
              data: {
                gameOneTeamTwoScore: {
                  increment: 1,
                },
              },
            });
          }
          break;
        }

        case 2: {
          if (Math.random() < 0.5) {
            pointAdded = await ctx.prisma.game.update({
              where: {
                gameId: input.gameId,
              },
              data: {
                gameTwoTeamOneScore: {
                  increment: 1,
                },
              },
            });
          } else {
            pointAdded = await ctx.prisma.game.update({
              where: {
                gameId: input.gameId,
              },
              data: {
                gameTwoTeamTwoScore: {
                  increment: 1,
                },
              },
            });
          }
          break;
        }

        case 3: {
          if (Math.random() < 0.5) {
            pointAdded = ctx.prisma.game.update({
              where: {
                gameId: input.gameId,
              },
              data: {
                gameThreeTeamOneScore: {
                  increment: 1,
                },
              },
            });
          } else {
            pointAdded = ctx.prisma.game.update({
              where: {
                gameId: input.gameId,
              },
              data: {
                gameThreeTeamTwoScore: {
                  increment: 1,
                },
              },
            });
          }
          break;
        }
      }
      let finishSet;
      if (pointAdded) {
        if (
          (pointAdded.gameOneTeamOneScore === pointAdded.gameOneScoreCap ||
            pointAdded.gameOneTeamTwoScore === pointAdded.gameOneScoreCap) &&
          input.gameNumber === 1
        ) {
          finishSet = await ctx.prisma.game.update({
            where: {
              gameId: input.gameId,
            },
            data: {
              currentSet: { increment: 1 },
            },
          });
        } else if (
          (pointAdded.gameTwoTeamOneScore === pointAdded.gameTwoScoreCap ||
            pointAdded.gameTwoTeamTwoScore === pointAdded.gameTwoScoreCap) &&
          input.gameNumber === 2
        ) {
          finishSet = await ctx.prisma.game.update({
            where: {
              gameId: input.gameId,
            },
            data: {
              currentSet: { increment: 1 },
            },
          });
        } else if (
          (pointAdded.gameThreeTeamOneScore === pointAdded.gameThreeScoreCap ||
            pointAdded.gameThreeTeamTwoScore ===
              pointAdded.gameThreeScoreCap) &&
          input.gameNumber === 3
        ) {
          finishSet = await ctx.prisma.game.update({
            where: {
              gameId: input.gameId,
            },
            data: {
              currentSet: { increment: 1 },
            },
          });
        }
      }
      let finishGame;
      if (finishSet) {
        if (finishSet.currentSet === finishSet.numSets) {
          finishGame = await ctx.prisma.game.update({
            where: {
              gameId: input.gameId,
            },
            data: {
              gameFinished: true,
            },
          });
        }
      }
      return pointAdded;
    }),
  finishGameMock: protectedProcedure
    .input(
      z.object({
        gameId: z.number(),
        numSets: z.number(),
        gameOneTeamOneScore: z.number(),
        gameOneTeamTwoScore: z.number(),
        scoreCapGame1: z.number(),
        gameTwoTeamOneScore: z.number().nullable(),
        gameTwoTeamTwoScore: z.number().nullable(),
        scoreCapGame2: z.number().nullable(),
        gameThreeTeamOneScore: z.number().nullable(),
        gameThreeTeamTwoScore: z.number().nullable(),
        scoreCapGame3: z.number().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      let gameOneteamOneScore: number = input.gameOneTeamOneScore;
      let gameOneteamTwoScore: number = input.gameOneTeamTwoScore;
      let gameTwoteamOneScore: number | null = input.gameTwoTeamOneScore;
      let gameTwoteamTwoScore: number | null =
        input.gameTwoTeamTwoScore;
      let gameThreeteamOneScore: number | null =
        input.gameThreeTeamOneScore;
      let gameThreeteamTwoScore: number | null =
        input.gameThreeTeamTwoScore;
      let updatedGame
      switch (input.numSets) {
        case 1: {
          while (
            gameOneteamOneScore < input.scoreCapGame1 &&
            gameOneteamTwoScore < input.scoreCapGame1
          ) {
            if (Math.random() < 0.5) {
              gameOneteamOneScore++;
            } else {
              gameOneteamTwoScore++;
            }
          }
          updatedGame = await ctx.prisma.game.update({
            where: {
              gameId: input.gameId
            },
            data: {
              gameOneTeamOneScore: gameOneteamOneScore,
              gameOneTeamTwoScore: gameOneteamTwoScore,
              gameFinished: true
            }
          })
          break;
        }
        case 2: {
          while (
            gameOneteamOneScore < input.scoreCapGame1 &&
            gameOneteamTwoScore < input.scoreCapGame1
          ) {
            if (Math.random() < 0.5) {
              gameOneteamOneScore++;
            } else {
              gameOneteamTwoScore++;
            }
          }
          if (
            gameTwoteamOneScore !== null &&
            gameTwoteamTwoScore !== null &&
            input.scoreCapGame2 !== null
           ) {
            while (
              gameTwoteamOneScore < input.scoreCapGame2 &&
              gameTwoteamTwoScore < input.scoreCapGame2
            ) {
              if (Math.random() < 0.5) {
                gameTwoteamOneScore++;
              } else {
                gameTwoteamTwoScore++;
              }
            }
          }
          updatedGame = await ctx.prisma.game.update({
            where: {
              gameId: input.gameId,
            },
            data: {
              gameOneTeamOneScore: gameOneteamOneScore,
              gameOneTeamTwoScore: gameOneteamTwoScore,
              gameTwoTeamOneScore: gameTwoteamOneScore,
              gameTwoTeamTwoScore: gameTwoteamTwoScore,
              gameFinished:true
            },
          });
          break;
        }
        case 3: {
          while (
            gameOneteamOneScore < input.scoreCapGame1 &&
            gameOneteamTwoScore < input.scoreCapGame1
          ) {
            if (Math.random() < 0.5) {
              gameOneteamOneScore++;
            } else {
              gameOneteamTwoScore++;
            }
          }
          if (
            gameTwoteamOneScore !== null &&
            gameTwoteamTwoScore !== null &&
            input.scoreCapGame2 !== null
          ) {
            while (
              gameTwoteamOneScore < input.scoreCapGame2 &&
              gameTwoteamTwoScore < input.scoreCapGame2
            ) {
              if (Math.random() < 0.5) {
                gameTwoteamOneScore++;
              } else {
                gameTwoteamTwoScore++;
              }
            }
          }
          if (
            gameThreeteamOneScore !== null &&
            gameThreeteamTwoScore !== null &&
            input.scoreCapGame3 !== null
          ) {
            while (
              gameThreeteamOneScore < input.scoreCapGame3 &&
              gameThreeteamTwoScore < input.scoreCapGame3
            ) {
              if (Math.random() < 0.5) {
                gameThreeteamOneScore++;
              } else {
                gameThreeteamTwoScore++;
              }
            }
          }
          updatedGame = await ctx.prisma.game.update({
            where: {
              gameId: input.gameId,
            },
            data: {
              gameOneTeamOneScore: gameOneteamOneScore,
              gameOneTeamTwoScore: gameOneteamTwoScore,
              gameTwoTeamOneScore: gameTwoteamOneScore,
              gameTwoTeamTwoScore: gameTwoteamTwoScore,
              gameThreeTeamOneScore: gameThreeteamOneScore,
              gameThreeTeamTwoScore: gameThreeteamTwoScore,
              gameFinished: true
            },
          });
          break;
        }
      }
      return {
        updatedGame
      };
    }),
  addPointToGame: protectedProcedure
    .input(z.object({ gameId: z.number(), teamNum: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (input.teamNum === 1) {
              const pointAdded = await ctx.prisma.game.update({
                where: {
                  gameId: input.gameId,
                },
                data: {
                  gameOneTeamOneScore: {
                    increment: 1
                  }
                },
              });
      } else if (input.teamNum === 2) {
              const pointAdded = await ctx.prisma.game.update({
                where: {
                  gameId: input.gameId,
                },
                data: {
                  gameOneTeamTwoScore: {
                    increment: 1
                  }
                },
              });
      }

     }),
  
  getGameAndScore: protectedProcedure.input(z.object({gameId: z.number()})).query(async ({ ctx, input }) => { 
    const gameAndScore = await ctx.prisma.game.findUnique({
      where: {
        gameId: input.gameId
      },
      include: {
        teams: {
          include: {
            Team: {
              include: {
                players: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        }
      }
    })
    return {gameAndScore}
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
              teamRating: "desc",
            },
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

export type gameCreationProps = {
  gameOneScoreCap: number;
  gameTwoScoreCap?: number;
  gameThreeScoreCap?: number;
  isScoreCapped: boolean;
  numSets: number;
  currentSet: number;
  teamOne: FakeEntriesTeam;
  teamTwo: FakeEntriesTeam;
  refs: FakeEntriesTeam;
  poolId: string;
  isBracket?: boolean;
  bracketId?: boolean;
  gameFinished: boolean;
};

export function createGame({
  numSets,
  isBracket,
  gameOneScoreCap,
  gameTwoScoreCap,
  gameThreeScoreCap,
  isScoreCapped,
  currentSet,
  teamOne,
  teamTwo,
  refs,
  poolId,
  gameFinished,
  bracketId,
}: gameCreationProps): FakeGame {
  if (isBracket) {
  }
  switch (numSets) {
    case 1: {
      return {
        poolId,
        gameOneScoreCap,
        currentSet,
        numSets,
        teamOne,
        teamTwo,
        refs,
        gameOneTeamOneScore: 0,
        gameOneTeamTwoScore: 0,
        isScoreCapped,
        gameFinished,
      };
    }
    case 2: {
      return {
        poolId,
        gameOneScoreCap,
        gameTwoScoreCap,
        currentSet,
        numSets,
        teamOne,
        teamTwo,
        refs,
        gameOneTeamOneScore: 0,
        gameOneTeamTwoScore: 0,
        gameTwoTeamOneScore: 0,
        gameTwoTeamTwoScore: 0,
        isScoreCapped,
        gameFinished,
      };
    }
    case 3: {
      return {
        poolId,
        gameOneScoreCap,
        gameTwoScoreCap,
        gameThreeScoreCap,
        currentSet,
        numSets,
        teamOne,
        teamTwo,
        refs,
        gameOneTeamOneScore: 0,
        gameOneTeamTwoScore: 0,
        gameTwoTeamOneScore: 0,
        gameTwoTeamTwoScore: 0,
        gameThreeTeamOneScore: 0,
        gameThreeTeamTwoScore: 0,
        isScoreCapped,
        gameFinished,
      };
    }
  }
  return {} as FakeGame;
}

export function createGameSchedule(pool: FakeEntriesTeamArr): FakeGame[] {
  let gamesToInsert: gameCreationProps[] = [];
  let gamesToReturn: FakeGame[] = [];
  console.log(pool?.length);
  switch (pool?.length) {
    case 3: {
      const [firstTeam, secondTeam, thirdTeam] = [pool[0], pool[1], pool[2]];
      gamesToInsert = [
        {
          teamOne: firstTeam,
          teamTwo: thirdTeam,
          refs: secondTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: secondTeam,
          teamTwo: thirdTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: secondTeam,
          refs: thirdTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: thirdTeam,
          refs: secondTeam,
          gameOneScoreCap: 21,
          isScoreCapped: false,
          numSets: 1,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: secondTeam,
          teamTwo: thirdTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          isScoreCapped: false,
          numSets: 1,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: secondTeam,
          refs: thirdTeam,
          gameOneScoreCap: 21,
          isScoreCapped: false,
          numSets: 1,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
      ];
      for (let i = 0; i < gamesToInsert.length; i++) {
        gamesToReturn.push(createGame(gamesToInsert[i]));
      }
      return gamesToReturn;
    }
    case 4: {
      const [firstTeam, secondTeam, thirdTeam, fourthTeam] = [
        pool[0],
        pool[1],
        pool[2],
        pool[3],
      ];
      gamesToInsert = [
        {
          teamOne: firstTeam,
          teamTwo: fourthTeam,
          refs: secondTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: secondTeam,
          teamTwo: thirdTeam,
          refs: fourthTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: secondTeam,
          teamTwo: fourthTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: thirdTeam,
          refs: secondTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: thirdTeam,
          teamTwo: fourthTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: secondTeam,
          refs: thirdTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
      ];
      for (let i = 0; i < gamesToInsert.length; i++) {
        gamesToReturn.push(createGame(gamesToInsert[i]));
      }
      return gamesToReturn;
    }
    case 5: {
      const [firstTeam, secondTeam, thirdTeam, fourthTeam, fifthTeam] = [
        pool[0],
        pool[1],
        pool[2],
        pool[3],
        pool[4],
      ];
      gamesToInsert = [
        {
          teamOne: firstTeam,
          teamTwo: fifthTeam,
          refs: secondTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: secondTeam,
          teamTwo: fourthTeam,
          refs: fifthTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: secondTeam,
          teamTwo: fifthTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: thirdTeam,
          refs: secondTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: thirdTeam,
          teamTwo: fifthTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: fourthTeam,
          refs: thirdTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: thirdTeam,
          teamTwo: fourthTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: secondTeam,
          refs: fourthTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
      ];
      gamesToInsert.map((game) => {
        return gamesToReturn.push(createGame(game));
      });
      // console.log("Games Returned", gamesToReturn);
      return gamesToReturn;
    }
    case 6: {
    }
    case 7: {
    }
    case 8: {
    }
  }
  return [];
}

// type finishCurrentGameArgs = {
//   mySchedule: FakeGame[];
//   setMySchedule: Dispatch<SetStateAction<FakeGame[] | undefined>>;
//   currentGame: FakeGame;
//   gameIndex: number;
//   pool: FakeEntriesTeamArr;
//   setMyPool: Dispatch<SetStateAction<FakeEntriesTeamArr>>;
// };

// export function finishCurrentGame({
//   mySchedule,
//   setMySchedule,
//   gameIndex,
//   pool,
// }: finishCurrentGameArgs): void {
//   for (
//     mySchedule[gameIndex].currentSet;
//     mySchedule[gameIndex].currentSet < mySchedule[gameIndex].numSets + 1;
//     mySchedule[gameIndex].currentSet++
//   ) {
//     if (mySchedule[gameIndex].currentSet === 1) {
//       while (
//         mySchedule[gameIndex].gameOneScoreCap >
//           mySchedule[gameIndex].gameOneTeamOneScore &&
//         mySchedule[gameIndex].gameOneScoreCap >
//           mySchedule[gameIndex].gameOneTeamTwoScore
//       ) {
//         if (Math.random() > 0.5) {
//           mySchedule[gameIndex].gameOneTeamOneScore++;
//         } else {
//           mySchedule[gameIndex].gameOneTeamTwoScore++;
//         }
//       }
//       // if (mySchedule[gameIndex].gameOneTeamOneScore > mySchedule[gameIndex].gameOneTeamTwoScore) {
//       //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamOne)].poolWins++;
//       //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamTwo)].poolLosses++;
//       // } else {
//       //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamOne)].poolLosses++;
//       //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamTwo)].poolWins++;
//       // }
//     }
//     if (mySchedule[gameIndex].currentSet === 2) {
//       while (
//         mySchedule[gameIndex].gameTwoScoreCap >
//           mySchedule[gameIndex].gameTwoTeamOneScore &&
//         mySchedule[gameIndex].gameTwoScoreCap >
//           mySchedule[gameIndex].gameTwoTeamTwoScore
//       ) {
//         if (Math.random() > 0.5) {
//           mySchedule[gameIndex].gameTwoTeamOneScore++;
//         } else {
//           mySchedule[gameIndex].gameTwoTeamTwoScore++;
//         }
//       }
//       // if (mySchedule[gameIndex].gameTwoTeamOneScore > mySchedule[gameIndex].gameTwoTeamTwoScore) {
//       //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamOne)].poolWins++;
//       //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamTwo)].poolLosses++;
//       // }else {
//       //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamOne)].poolLosses++;
//       //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamTwo)].poolWins++;
//       // }
//     }
//     if (mySchedule[gameIndex].currentSet === 3) {
//     }
//   }
//   mySchedule[gameIndex].gameFinished = true;
//   // setMyPool([...pool])
//   setMySchedule([...mySchedule]);
// }
