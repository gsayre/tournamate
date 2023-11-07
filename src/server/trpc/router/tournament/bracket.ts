import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";
import { Game, Prisma, PrismaClient, Team, User, UsersInTeam } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const bracketRouter = router({
  createBracketSchedule: protectedProcedure
    .input(z.object({ divisionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const divisionToAddBracket = await ctx.prisma.division.findUnique({
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
      let teamsThatBrokePool = [];
      let potentialWildcardArray = [];
      let wildcardArray: TeamsForBracketT = [];
      const DivisionTypeToMock = divisionToAddBracket;
      if (DivisionTypeToMock && DivisionTypeToMock.pools) {
        const howManyBreak = DivisionTypeToMock?.numBreakingPool;
        const hasWildCard = DivisionTypeToMock?.hasWildcards;
        const numWildCard = DivisionTypeToMock?.numWildcards;

        //Add teams that clean broke to an array
        for (let i = 0; i < DivisionTypeToMock.pools.length; i++) {
          const pool = DivisionTypeToMock.pools[i];
          const teams = pool.teams;
          const sortedTeams = teams.sort((a, b) => {
            return (
              b.poolWins / b.poolLosses - a.poolWins / a.poolLosses ||
              b.poolPointDifferential - a.poolPointDifferential
            );
          });

          const teamsThatBroke = sortedTeams.slice(0, howManyBreak);
          //Check for wildcards and if so add them to the array
          if (hasWildCard && numWildCard) {
            const teamsThatCouldEarnedWildcard = sortedTeams.slice(
              howManyBreak,
              sortedTeams.length,
            );
            potentialWildcardArray.push(teamsThatCouldEarnedWildcard);
          }
          teamsThatBrokePool.push(teamsThatBroke);
        }
        let flattentedWildcardArray = potentialWildcardArray.flat();
        const orderedWildcardCandidates = flattentedWildcardArray.sort(
          (a: FakeTeamInFakeDivision, b: FakeTeamInFakeDivision) => {
            return (
              b.poolWins / b.poolLosses - a.poolWins / a.poolLosses ||
              b.poolPointDifferential - a.poolPointDifferential
            );
          },
        );
        wildcardArray = orderedWildcardCandidates
          .slice(0, numWildCard)
          .sort((a: FakeTeamInFakeDivision, b: FakeTeamInFakeDivision) => {
            return (
              b.poolWins / b.poolLosses - a.poolWins / a.poolLosses ||
              b.poolPointDifferential - a.poolPointDifferential
            );
          });
        BracketMakerHelper({
          teamsThatCleanBroke: teamsThatBrokePool.flat(),
          teamsThatGotWildCard: wildcardArray,
          numPools: DivisionTypeToMock?.pools.length,
          prismaContext: ctx.prisma,
          divisionId: input.divisionId
        });
      }
      return {
        teamsThatCleanBroke: teamsThatBrokePool.flat(),
        wildcards: wildcardArray,
      };
    }),
});

type TeamsForBracketT = (Team & {
  players: (UsersInTeam & {
    user: User;
  })[];
})[];

type TeamInBracketT = (Team & {
  players: (UsersInTeam & {
    user: User;
  })[]
});

type BracketMakerHelperProps = {
  teamsThatCleanBroke: TeamsForBracketT;
  teamsThatGotWildCard?: TeamsForBracketT;
  numPools: number;
  prismaContext: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  divisionId: number;
};

const BracketMakerHelper = async ({
  teamsThatCleanBroke,
  teamsThatGotWildCard,
  numPools,
  prismaContext,
  divisionId
}: BracketMakerHelperProps): Promise<void> => {
  let fullBracketTeams;
  let numByes;
  if (teamsThatGotWildCard) {
    fullBracketTeams = teamsThatCleanBroke.concat(teamsThatGotWildCard);
  } else {
    fullBracketTeams = teamsThatCleanBroke;
  }
  const lowerPower = Math.pow(
    2,
    Math.floor(Math.log2(fullBracketTeams.length)),
  );
  const higherPower = Math.pow(
    2,
    Math.ceil(Math.log2(fullBracketTeams.length)),
  );

  numByes = Math.min(
    Math.abs(fullBracketTeams.length - lowerPower),
    Math.abs(fullBracketTeams.length - higherPower),
  );

  const upperEschelonPogchamps: TeamsForBracketT[] = [];
  for (let i = 0; i < teamsThatCleanBroke.length; i++) {
    if (Array.isArray(upperEschelonPogchamps[i % numPools])) {
      upperEschelonPogchamps[i % numPools] = [
        ...upperEschelonPogchamps[i % numPools],
        teamsThatCleanBroke[i],
      ];
    } else {
      upperEschelonPogchamps[i % numPools] = [teamsThatCleanBroke[i]];
    }
  }
  // splice from the 0 position in the sorted upper eschelon array based on the number of teams that get a bye
  let teamsThatGetByes: TeamsForBracketT = [];
  for (let i = 0; i < upperEschelonPogchamps.length; i++) {
    upperEschelonPogchamps[i].sort((a, b) => {
      return (
        b.poolWins / b.poolLosses - a.poolWins / a.poolLosses ||
        b.poolPointDifferential - a.poolPointDifferential
      );
    });
  }
  teamsThatGetByes = pullOutByes(
    teamsThatGetByes,
    upperEschelonPogchamps,
    numByes,
  );
  const teamsThatAreUpper = upperEschelonPogchamps
    .flat()
    .filter((team) => !teamsThatGetByes.includes(team))
    .sort((a: FakeTeamInFakeDivision, b: FakeTeamInFakeDivision) => {
      return (
        b.poolWins / b.poolLosses - a.poolWins / a.poolLosses ||
        b.poolPointDifferential - a.poolPointDifferential
      );
    });
  const gameArray = createGameArray(
    fullBracketTeams.sort(
      (a: FakeTeamInFakeDivision, b: FakeTeamInFakeDivision) => {
        return (
          b.poolWins / b.poolLosses - a.poolWins / a.poolLosses ||
          b.poolPointDifferential - a.poolPointDifferential
        );
      },
    ),
  );
  const previousBracket = await prismaContext.bracket.findFirst({
    where: {
      divisionId: divisionId,
    },
  });

  console.log("previous bracket",previousBracket);
  if (previousBracket) {
    const bracketDeleted = await prismaContext.bracket.delete({
      where: {
        bracketId: previousBracket.bracketId,
      },
    });
    console.log('bracket deleted',bracketDeleted);
  }
  const bracketCreated = await prismaContext.bracket.create({
    data: {
    divisionId: divisionId,
    }
  })
  
  console.log('bracket created', bracketCreated);
  createGames(gameArray[0], gameArray[1],prismaContext, bracketCreated.bracketId);

  // if the number of teams that get a bye are greater than the length of the first array in the upper eschelon array move to the next array and so on
  // you'll then be able to make the bracket by sorting and flattening the upper eschelon array and concatting it with the wildcard array and matching the top and bottom
  // teams up until you have no more teams, then you have to create the next round of the bracket by taking the winners of those rounds and matching them up against each other
  // or the teams that got a bye. You'll have to take into account that you don't want to put teams early in playoffs against each other if they played in pool play
};

const pullOutByes = (
  teamThatGetByesArr: TeamsForBracketT,
  demGoodBois: TeamsForBracketT[],
  numByes: number,
): TeamsForBracketT => {
  for (let i = 0; i < demGoodBois.length; i++) {
    if (numByes === 0) {
      return teamThatGetByesArr;
    }
    if (numByes >= demGoodBois[i].length) {
      teamThatGetByesArr = teamThatGetByesArr.concat(
        demGoodBois[i].slice(0, demGoodBois[i].length),
      );
      numByes = numByes - demGoodBois[i].length;
    } else {
      teamThatGetByesArr = teamThatGetByesArr.concat(
        demGoodBois[i].slice(0, numByes),
      );
      numByes = 0;
    }
  }
  return [];
};

const createGameArray = (wholeBracket: TeamsForBracketT): any[] => {
  const games: Game[] = [];
  // if there are byes and wildcards
  const twoSidesOfBracket: Array<TeamsForBracketT | TeamInBracketT> = [[], []];
  let sideOfBracket: number = 0;
  let sideOfBracketXtra = "0";
  for (let i = 0; i < wholeBracket.length; i++) {
    sideOfBracket =
      sideOfBracketXtra === "0"
        ? 0
        : sideOfBracketXtra === "0+"
        ? 0
        : sideOfBracketXtra === "1"
        ? 1
        : sideOfBracketXtra === "1+"
        ? 1
              : 69420;
    console.log(wholeBracket[i].poolWins, wholeBracket[i].poolLosses, wholeBracket[i].poolPointDifferential, sideOfBracket);
    twoSidesOfBracket[sideOfBracket].push(wholeBracket[i]);
    sideOfBracketXtra =
      sideOfBracketXtra === "0"
        ? "1"
        : sideOfBracketXtra === "1"
        ? "1+"
        : sideOfBracketXtra === "1+"
        ? "0+"
        : sideOfBracketXtra === "0+"
        ? "0"
        : "69420";
  }
  console.log("--------------------");
  if ("length" in twoSidesOfBracket[0] && twoSidesOfBracket[0].length > 2) {
    twoSidesOfBracket[0] = createGameArray(twoSidesOfBracket[0]);
  }
  if ("length" in twoSidesOfBracket[1] && twoSidesOfBracket[1].length > 2) {
    twoSidesOfBracket[1] =createGameArray(twoSidesOfBracket[1]);
  }
  if ( "length" in twoSidesOfBracket[0] &&twoSidesOfBracket[0].length === 1) {
    twoSidesOfBracket[0] = twoSidesOfBracket[0][0];
  }
  if ( "length" in twoSidesOfBracket[1] &&twoSidesOfBracket[1].length === 1) {
    twoSidesOfBracket[0] = twoSidesOfBracket[1][0];
  }
  return twoSidesOfBracket;
};

const createGames = async (
  team1: any[] | TeamInBracketT,
  team2: any[] | TeamInBracketT,
  prismaContext: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  bracketId: number,
  nextGameId?: number,
): Promise<void> => {
  const team1Id = "teamId" in team1 ? team1.teamId : null;
  const team2Id = "teamId" in team2 ? team2.teamId : null;
  if (team1Id && team2Id) {
    console.log(team1Id, team2Id);
    // These are first round games
    if (nextGameId) {
      const gameCreated = await prismaContext.game.create({
        data: {
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          gameThreeScoreCap: 15,
          bracketId: bracketId,
          numSets: 3,
          nextGame: nextGameId,
          teams: {
            create: [
              {
                Team: {
                  connect: {
                    teamId: team1Id,
                  },
                },
              },
              {
                Team: {
                  connect: {
                    teamId: team2Id,
                  },
                },
              },
            ],
          },
        },
      });
    } else {
      const gameCreated = await prismaContext.game.create({
        data: {
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          gameThreeScoreCap: 15,
          bracketId: bracketId,
          numSets: 3,
          teams: {
            create: [
              {
                Team: {
                  connect: {
                    teamId: team1Id,
                  },
                },
              },
              {
                Team: {
                  connect: {
                    teamId: team2Id
                  },
                },
              },
            ],
          },
        },
      });
    }
  } else if (team1Id && "length" in team2) {
    console.log(team1Id);
    // These are games where one team got a bye
    let createdGameId: number = 42069;
    if (nextGameId) {
      const gameCreated = await prismaContext.game.create({
        data: {
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          gameThreeScoreCap: 15,
          bracketId: bracketId,
          numSets: 3,
          nextGame: nextGameId,
          teams: {
            create: [
              {
                Team: {
                  connect: {
                    teamId: team1Id,
                  },
                },
              },
            ],
          },
        },
      });
      if (gameCreated) {
        createdGameId = gameCreated.gameId;
      }
    } else {
      const gameCreated = await prismaContext.game.create({
        data: {
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          gameThreeScoreCap: 15,
          bracketId: bracketId,
          numSets: 3,
          teams: {
            create: [
              {
                Team: {
                  connect: {
                    teamId: team1Id,
                  },
                },
              }
            ],
          },
        },
      });
      if (gameCreated) {
        createdGameId = gameCreated.gameId;
      }
    }
    createGames(team2[0], team2[1], prismaContext, bracketId, createdGameId);
  } else if (team2Id && "length" in team1) {
    console.log(team2Id);
    // These are games where one team got a bye
    let createdGameId: number = 42069;
    if (nextGameId) {
      const gameCreated = await prismaContext.game.create({
        data: {
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          gameThreeScoreCap: 15,
          bracketId: bracketId,
          numSets: 3,
          nextGame: nextGameId,
          teams: {
            create: [
              {
                Team: {
                  connect: {
                    teamId: team2Id,
                  },
                },
              },
            ],
          },
        },
      });
      if (gameCreated) {
        createdGameId = gameCreated.gameId;
      }
    } else {
      const gameCreated = await prismaContext.game.create({
        data: {
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          gameThreeScoreCap: 15,
          bracketId: bracketId,
          numSets: 3,
          teams: {
            create: [
              {
                Team: {
                  connect: {
                    teamId: team2Id,
                  },
                },
              },
            ],
          },
        },
      });
      if (gameCreated) {
        createdGameId = gameCreated.gameId;
      }
    } 
    createGames(team1[0], team1[1], prismaContext, bracketId, createdGameId);
  } else if ("length" in team1 && "length" in team2) {
    console.log("no teams");
    // These are later round games 
        let createdGameId: number = 42069;
        if (nextGameId) {
          const gameCreated = await prismaContext.game.create({
            data: {
              gameOneScoreCap: 21,
              gameTwoScoreCap: 21,
              gameThreeScoreCap: 15,
              bracketId: bracketId,
              numSets: 3,
              nextGame: nextGameId,
            },
          });
          if (gameCreated) {
            createdGameId = gameCreated.gameId;
          }
        } else {
          const gameCreated = await prismaContext.game.create({
            data: {
              gameOneScoreCap: 21,
              gameTwoScoreCap: 21,
              gameThreeScoreCap: 15,
              bracketId: bracketId,
              numSets: 3,
            },
          });
          if (gameCreated) {
            createdGameId = gameCreated.gameId;
          }
        }
    createGames(team1[0], team1[1], prismaContext, bracketId, createdGameId);
    createGames(team2[0], team2[1], prismaContext, bracketId, createdGameId);
  }
};

type FakeDivisions = {
  numBreakingPool: number;
  hasWildcards: boolean;
  numWildcards: number;
  pools: Array<FakePoolInDivision>;
};
type FakePoolInDivision = {
  teams: Array<FakeTeamInFakeDivision>;
};
type FakeTeamInFakeDivision = {
  teamId: number;
  poolWins: number;
  poolLosses: number;
  poolPointDifferential: number;
};

const fakeTwoPoolDivision: FakeDivisions = {
  numBreakingPool: 2,
  hasWildcards: false,
  numWildcards: 1,
  pools: [
    {
      teams: [
        {
          teamId: 1,
          poolWins: 3,
          poolLosses: 3,
          poolPointDifferential: 4,
        },
        {
          teamId: 2,
          poolWins: 6,
          poolLosses: 0,
          poolPointDifferential: 34,
        },
        {
          teamId: 3,
          poolWins: 3,
          poolLosses: 3,
          poolPointDifferential: 10,
        },
        {
          teamId: 4,
          poolWins: 0,
          poolLosses: 6,
          poolPointDifferential: -23,
        },
      ],
    },
    {
      teams: [
        {
          teamId: 5,
          poolWins: 2,
          poolLosses: 4,
          poolPointDifferential: -1,
        },
        {
          teamId: 6,
          poolWins: 4,
          poolLosses: 2,
          poolPointDifferential: 27,
        },
        {
          teamId: 7,
          poolWins: 1,
          poolLosses: 5,
          poolPointDifferential: -12,
        },
        {
          teamId: 8,
          poolWins: 5,
          poolLosses: 1,
          poolPointDifferential: 22,
        },
      ],
    },
  ],
};
const fakeThreePoolDivision: FakeDivisions = {
  numBreakingPool: 2,
  hasWildcards: true,
  numWildcards: 1,
  pools: [
    {
      teams: [
        {
          teamId: 1,
          poolWins: 3,
          poolLosses: 3,
          poolPointDifferential: 4,
        },
        {
          teamId: 2,
          poolWins: 6,
          poolLosses: 0,
          poolPointDifferential: 34,
        },
        {
          teamId: 3,
          poolWins: 3,
          poolLosses: 3,
          poolPointDifferential: 10,
        },
        {
          teamId: 4,
          poolWins: 0,
          poolLosses: 6,
          poolPointDifferential: -23,
        },
      ],
    },
    {
      teams: [
        {
          teamId: 5,
          poolWins: 2,
          poolLosses: 4,
          poolPointDifferential: -1,
        },
        {
          teamId: 6,
          poolWins: 4,
          poolLosses: 2,
          poolPointDifferential: 27,
        },
        {
          teamId: 7,
          poolWins: 1,
          poolLosses: 5,
          poolPointDifferential: -12,
        },
        {
          teamId: 8,
          poolWins: 5,
          poolLosses: 1,
          poolPointDifferential: 22,
        },
      ],
    },
    {
      teams: [
        {
          teamId: 9,
          poolWins: 2,
          poolLosses: 4,
          poolPointDifferential: -1,
        },
        {
          teamId: 10,
          poolWins: 4,
          poolLosses: 2,
          poolPointDifferential: 27,
        },
        {
          teamId: 11,
          poolWins: 1,
          poolLosses: 5,
          poolPointDifferential: -12,
        },
        {
          teamId: 12,
          poolWins: 5,
          poolLosses: 1,
          poolPointDifferential: 22,
        },
      ],
    },
  ],
};
const fakeFourPoolDivision: FakeDivisions = {
  numBreakingPool: 2,
  hasWildcards: true,
  numWildcards: 1,
  pools: [
    {
      teams: [
        {
          teamId: 1,
          poolWins: 3,
          poolLosses: 3,
          poolPointDifferential: 4,
        },
        {
          teamId: 2,
          poolWins: 6,
          poolLosses: 0,
          poolPointDifferential: 34,
        },
        {
          teamId: 3,
          poolWins: 3,
          poolLosses: 3,
          poolPointDifferential: 10,
        },
        {
          teamId: 4,
          poolWins: 0,
          poolLosses: 6,
          poolPointDifferential: -23,
        },
      ],
    },
    {
      teams: [
        {
          teamId: 5,
          poolWins: 2,
          poolLosses: 4,
          poolPointDifferential: -1,
        },
        {
          teamId: 6,
          poolWins: 4,
          poolLosses: 2,
          poolPointDifferential: 27,
        },
        {
          teamId: 7,
          poolWins: 1,
          poolLosses: 5,
          poolPointDifferential: -12,
        },
        {
          teamId: 8,
          poolWins: 5,
          poolLosses: 1,
          poolPointDifferential: 22,
        },
      ],
    },
    {
      teams: [
        {
          teamId: 9,
          poolWins: 2,
          poolLosses: 4,
          poolPointDifferential: -1,
        },
        {
          teamId: 10,
          poolWins: 4,
          poolLosses: 2,
          poolPointDifferential: 27,
        },
        {
          teamId: 11,
          poolWins: 1,
          poolLosses: 5,
          poolPointDifferential: -12,
        },
        {
          teamId: 12,
          poolWins: 5,
          poolLosses: 1,
          poolPointDifferential: 22,
        },
      ],
    },
    {
      teams: [
        {
          teamId: 13,
          poolWins: 3,
          poolLosses: 3,
          poolPointDifferential: 4,
        },
        {
          teamId: 14,
          poolWins: 6,
          poolLosses: 0,
          poolPointDifferential: 34,
        },
        {
          teamId: 15,
          poolWins: 3,
          poolLosses: 3,
          poolPointDifferential: 10,
        },
        {
          teamId: 16,
          poolWins: 0,
          poolLosses: 6,
          poolPointDifferential: -23,
        },
      ],
    },
  ],
};
