import { TRPCError } from "@trpc/server";
import { z } from "zod";



import { BuildQueryResult, DBQueryConfig, dbType, eq, ExtractTablesWithRelations, schema } from "@acme/db";



import { createTRPCRouter, protectedProcedure } from "../../trpc";


type TSchema = ExtractTablesWithRelations<typeof schema>;
type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>;

export type InferQueryModel<
  TableName extends keyof TSchema,
  QBConfig extends QueryConfig<TableName> = {},
    > = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;

type TeamWithPlayersAndUserTArr = InferQueryModel<
        "team",
        { with: { players: { with: { user: true } } } }
      >[];;

export const bracketRouter = createTRPCRouter({
  createBracketSchedule: protectedProcedure
    .input(z.object({ divisionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const divisionToAddToBracket = await ctx.db.query.division.findFirst({
        where: eq(schema.division.divisionId, input.divisionId),
        with: {
          pools: {
            with: { teams: { with: { players: { with: { user: true } } } } },
          },
        },
      });
      if (!divisionToAddToBracket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Division not found",
        });
      }
      const teamsThatBrokePool = [];
      const potentialWildcardArray = [];
      let wildcardArray: TeamWithPlayersAndUserTArr = [];
      const howManyBreak = divisionToAddToBracket.numBreakingPool;
      const hasWildCard = divisionToAddToBracket.hasWildcards;
      const numWildCard = divisionToAddToBracket.numWildcards;

      //Add teams that broke pool to array
      for (let i = 0; i < divisionToAddToBracket.pools.length; i++) {
        const pool = divisionToAddToBracket.pools[i];
        if (!pool) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Pool not found",
          });
        }
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
      // Sorts the wildcard array and then takes the top numWildCard teams
      if (hasWildCard && numWildCard) {
        const flattentedWildcardArray = potentialWildcardArray.flat();
        const orderedWildcardCandidates = flattentedWildcardArray.sort(
          (a, b) => {
            return (
              b.poolWins / b.poolLosses - a.poolWins / a.poolLosses ||
              b.poolPointDifferential - a.poolPointDifferential
            );
          },
        );
        wildcardArray = orderedWildcardCandidates
          .slice(0, numWildCard)
          .sort((a, b) => {
            return (
              b.poolWins / b.poolLosses - a.poolWins / a.poolLosses ||
              b.poolPointDifferential - a.poolPointDifferential
            );
          });
      }
      BracketMakerHelper({
        teamsThatCleanBroke: teamsThatBrokePool.flat(),
        teamsThatGotWildCard: wildcardArray,
        numPools: divisionToAddToBracket.pools.length,
        dbContext: ctx.db,
        divisionId: input.divisionId,
      });
    }),
  getBracketByDivision: protectedProcedure
    .input(z.object({ divisionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.bracket.findFirst({
        where: eq(schema.bracket.divisionId, input.divisionId),
        with: {
          games: {
            with: {
              teams: {
                with: { team: { with: { players: { with: { user: true } } } } },
              },
            },
          },
        },
      });
    }),
  getBracketWinnerByDivision: protectedProcedure
    .input(z.object({ divisionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const divisionBracket = await ctx.db.query.bracket.findFirst({
        where: eq(schema.bracket.divisionId, input.divisionId),
        with: {
          games: {
            with: {
              teams: {
                with: { team: { with: { players: { with: { user: true } } } } },
              },
            },
            orderBy: (games, { asc }) => [asc(games.gameId)],
          },
        },
      });
      const bracketFinalStandings = [];
      if (!divisionBracket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bracket not found",
        });
      }

      for (let i = 0; i < divisionBracket.games.length; i++) {
        const game = divisionBracket.games[i];
        let winningTeam: number;
        let winningPlayers;
        let losingTeam: number;
        let losingPlayers;
        let teamOneWins = 0;
        const teamOneId = game?.teams[0]?.team?.id;
        let teamTwoWins = 0;
        const teamTwoId = game?.teams[1]?.team?.id;
        if (!game) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Game not found",
          });
        }
        if (
          game.gameOneTeamOneScore &&
          game.gameOneTeamTwoScore &&
          game.gameOneTeamOneScore !== 0 &&
          game.gameOneTeamTwoScore !== 0
        ) {
          if (game.gameOneTeamOneScore > game.gameOneTeamTwoScore) {
            teamOneWins++;
          } else {
            teamTwoWins++;
          }
        }
        if (
          game.gameTwoTeamOneScore &&
          game.gameTwoTeamTwoScore &&
          game.gameTwoTeamOneScore !== 0 &&
          game.gameTwoTeamTwoScore !== 0
        ) {
          if (game.gameTwoTeamOneScore > game.gameTwoTeamTwoScore) {
            teamOneWins++;
          } else {
            teamTwoWins++;
          }
        }
        if (
          game.gameThreeTeamOneScore &&
          game.gameThreeTeamTwoScore &&
          game.gameThreeTeamOneScore !== 0 &&
          game.gameThreeTeamTwoScore !== 0
        ) {
          if (game.gameThreeTeamOneScore > game.gameThreeTeamTwoScore) {
            teamOneWins++;
          } else {
            teamTwoWins++;
          }
        }
        if (!teamOneId || !teamTwoId) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Team ids not found",
          });
        }
        if (teamOneWins > teamTwoWins) {
          winningTeam = teamOneId;
          winningPlayers = game?.teams[0]?.team.players;
          losingTeam = teamTwoId;
          losingPlayers = game?.teams[1]?.team.players;
        } else {
          winningTeam = teamTwoId;
          winningPlayers = game?.teams[1]?.team.players;
          losingTeam = teamOneId;
          losingPlayers = game?.teams[0]?.team.players;
        }
        if (bracketFinalStandings.length === 0) {
          bracketFinalStandings.push({
            teamId: winningTeam,
            players: winningPlayers,
          });
          bracketFinalStandings.push({
            teamId: losingTeam,
            players: losingPlayers,
          });
        }
        if (
          bracketFinalStandings.filter((el) => el.teamId === winningTeam)
            .length === 0
        ) {
          bracketFinalStandings.push({
            teamId: winningTeam,
            players: winningPlayers,
          });
        }
        if (
          bracketFinalStandings.filter((el) => el.teamId === losingTeam)
            .length === 0
        ) {
          bracketFinalStandings.push({
            teamId: losingTeam,
            players: losingPlayers,
          });
        }
      }
      return { finalStandings: bracketFinalStandings };
    }),
});

type BracketMakerHelperProps = {
  teamsThatCleanBroke: TeamWithPlayersAndUserTArr
  teamsThatGotWildCard: TeamWithPlayersAndUserTArr
  numPools: number;
  dbContext: dbType;
  divisionId: number;
};

const BracketMakerHelper = async ({
  teamsThatCleanBroke,
  teamsThatGotWildCard,
  numPools,
  dbContext,
  divisionId,
}: BracketMakerHelperProps): Promise<void> => {
  let fullBracketTeams;
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

  const numByes = Math.min(
    Math.abs(fullBracketTeams.length - lowerPower),
    Math.abs(fullBracketTeams.length - higherPower),
  );

  const upperEschelonPogchamps: TeamWithPlayersAndUserTArr = [];
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
    .sort((a: TeamInBracketT, b: TeamInBracketT) => {
      return (
        b.poolWins / b.poolLosses - a.poolWins / a.poolLosses ||
        b.poolPointDifferential - a.poolPointDifferential
      );
    });
  console.log(teamsThatAreUpper);
  const gameArray = createGameArray(
    fullBracketTeams.sort((a: TeamInBracketT, b: TeamInBracketT) => {
      return (
        b.poolWins / b.poolLosses - a.poolWins / a.poolLosses ||
        b.poolPointDifferential - a.poolPointDifferential
      );
    }),
  );
  const previousBracket = await dbContext.bracket.findFirst({
    where: {
      divisionId: divisionId,
    },
  });

  console.log("previous bracket", previousBracket);
  if (previousBracket) {
    const bracketDeleted = await dbContext.bracket.delete({
      where: {
        bracketId: previousBracket.bracketId,
      },
    });
    console.log("bracket deleted", bracketDeleted);
  }
  const bracketCreated = await dbContext.bracket.create({
    data: {
      divisionId: divisionId,
    },
  });

  console.log("bracket created", bracketCreated);
  createGames(gameArray[0], gameArray[1], dbContext, bracketCreated.bracketId);

  // if the number of teams that get a bye are greater than the length of the first array in the upper eschelon array move to the next array and so on
  // you'll then be able to make the bracket by sorting and flattening the upper eschelon array and concatting it with the wildcard array and matching the top and bottom
  // teams up until you have no more teams, then you have to create the next round of the bracket by taking the winners of those rounds and matching them up against each other
  // or the teams that got a bye. You'll have to take into account that you don't want to put teams early in playoffs against each other if they played in pool play
};