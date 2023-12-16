import { PoolTable } from "@components/PoolTable";
import {
  Division,
  Team,
  UsersInTeam,
  User,
  Format,
  Game,
} from "@prisma/client";
import { FakeEntriesTeamArr } from "../../utils/types/team";
import { useEffect, useState } from "react";
import {
  createFakeEntriesAnyTeams,
  createPoolsFromEntries,
} from "utils/lib/team-utils";
import { trpc } from "utils/trpc";
import { z } from "zod";
import { MyPoolTable } from "@components/MyPoolTable";
import { PoolSchedule, isCurrentGame } from "@components/PoolSchedule";

export type divAccordianProps = {
  division: Division & {
    entries: (Team & {
      players: (UsersInTeam & {
        user: User;
      })[];
    })[];
  };
  tournamentId: number;
  divisionType: Format;
  divisionSex?: Gender; //yes please
};

type Gender = "MENS" | "WOMENS" | undefined;

export const DivisionAccordian = ({
  division,
  tournamentId,
  divisionType,
  divisionSex,
}: divAccordianProps) => {
  const utils = trpc.useContext();
  const addUserToDivision = trpc.tournament.mockTournamentEntries.useMutation();
  const updatePools = trpc.tournament.updatePool.useMutation();
  const createPoolSchedule = trpc.tournament.createPoolSchedule.useMutation();
  const toggleDayOf = trpc.tournament.toggleDayOfDivision.useMutation();
  const poolsForDivision = trpc.tournament.getPoolsByDivision.useQuery({
    divisionId: division.divisionId,
  }).data;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-fit w-5/6 flex-col text-white odd:bg-[#5BA6A1] even:bg-[#374C64]">
      <div className="flex h-fit flex-row items-center space-x-4 p-2">
        {isOpen ? (
          <img
            src="/icons/icons8-triangle-arrow-24.png"
            alt="arrow"
            className="h-4 w-4 fill-white"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
        ) : (
          <img
            src="/icons/icons8-triangle-arrow-24.png"
            alt="arrow"
            className="h-4 w-4 -rotate-90"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
        )}
        <p className="text-2xl font-semibold">
          {division.type + " - " + division.name}
        </p>
        <button
          className="rounded-lg bg-white p-2 font-semibold text-black"
          onClick={() => {
            toggleDayOf.mutate({ divisionId: division.divisionId });
          }}
        >
          Toggle Day Of
        </button>
        {divisionSex ? (
          <>
            <button
              className="rounded-lg bg-white p-2 font-semibold text-black"
              onClick={() => {
                addUserToDivision.mutate({
                  tournamentId: tournamentId,
                  divisionId: division.divisionId,
                  typeOfEntry: divisionType,
                  sexOfEntry: divisionSex,
                });
              }}
            >
              Add Same Sex Entry
            </button>
            <button
              className="rounded-lg bg-white p-2 font-semibold text-black"
              onClick={() => {
                updatePools.mutate({
                  divisionId: division.divisionId,
                  poolId: null,
                  isDayOf: null,
                  division: division,
                });
              }}
            >
              Update Pools
            </button>
            <button
              className="rounded-lg bg-white p-2 font-semibold text-black"
              onClick={() => {
                createPoolSchedule.mutate(
                  {
                    divisionId: division.divisionId,
                  },
                  {
                    onSuccess: () => {
                      utils.tournament.getMyScheudule.invalidate();
                      utils.tournament.getMyPool.invalidate();
                    },
                  },
                );
              }}
            >
              Create Schedule
            </button>
          </>
        ) : (
          <>
            <button
              className="rounded-lg bg-white p-2 font-semibold text-black"
              onClick={() => {
                addUserToDivision.mutate({
                  tournamentId: 1,
                  divisionId: division.divisionId,
                  typeOfEntry: divisionType,
                });
              }}
            >
              Add Coed Entry
            </button>
            <button
              className="rounded-lg bg-white p-2 font-semibold text-black"
              onClick={() => {
                updatePools.mutate({
                  divisionId: division.divisionId,
                  poolId: null,
                  isDayOf: null,
                  division: division,
                });
              }}
            >
              Update Pools
            </button>
            <button
              className="rounded-lg bg-white p-2 font-semibold text-black"
              onClick={() => {
                createPoolSchedule.mutate({
                  divisionId: division.divisionId,
                });
              }}
            >
              Create Schedule
            </button>
          </>
        )}
      </div>

      {isOpen && (
        <>
          {division.isDayOf ? (
            <div className="flex w-full flex-col bg-white p-4 text-black">
              <div className="flex flex-col">
                <p className="pb-2 text-2xl">Pools</p>
                <div className="flex flex-row space-x-4">
                  <p>Here</p>
                </div>
              </div>
              <div className="flex flex-col pt-4">
                <p className="pb-2 text-2xl">Bracket</p>
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col bg-white p-4 text-black">
              <div className="flex flex-col gap-4">
                <DivisionControls
                  divisionId={division.divisionId}
                  numBreaking={division.numBreakingPool}
                />
                {amIInDivision(division, poolsForDivision?.fullName) ? (
                  <div className="flex flex-row space-x-12">
                    <EntrySection division={division} />
                    <MyPoolSection
                      divisionId={division.divisionId}
                      numBreaking={division.numBreakingPool}
                      hasWildcards={division.hasWildcards}
                    />
                    <MyScheduleSection tournamentId={tournamentId} />
                  </div>
                ) : null}
                <div className="flex flex-row">
                  <PoolSection
                    poolsForDivision={poolsForDivision?.poolsForDivision}
                    fullName={poolsForDivision?.fullName}
                  />
                </div>
                <div>
                  {isDivisionFinished(poolsForDivision?.poolsForDivision) ? (
                    <BracketSection divisionId={division.divisionId} />
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

type EntrySectionProps = {
  division: any;
};

const EntrySection = ({ division }: EntrySectionProps) => {
  return (
    <>
      <div className="flex flex-col">
        <p className="pb-2 text-2xl">Entries</p>
        <div className="flex flex-col">
          {division.entries &&
            division.entries.map((entry, i) => {
              return (
                <div key={entry.teamId}>
                  <span className="pr-2">{i + 1}</span>
                  {entry.players.map((player, i, arr) => {
                    return (
                      <>
                        {i == arr.length - 1 ? (
                          <span key={player.userId}>
                            {player.user.fullName}
                          </span>
                        ) : (
                          <span key={player.userId}>
                            {player.user.fullName} {" - "}
                          </span>
                        )}
                      </>
                    );
                  })}
                </div>
              );
            })}
          <ol className="list-inside list-decimal text-lg"></ol>
        </div>
      </div>
    </>
  );
};

type PoolSectionProps = {
  poolsForDivision: any;
  fullName: string | undefined;
};

type CurrentGameT = Game & {
  referees: Team;
  players: Team[];
};

const PoolSection = ({ poolsForDivision, fullName }: PoolSectionProps) => {
  const finishGameMock = trpc.tournament.finishGameMock.useMutation();
  const utils = trpc.useContext();

  const poolsWithSeeds = poolsForDivision;
  if (poolsWithSeeds) {
    for (let i = 0; i < poolsWithSeeds.length; i++) {
      poolsWithSeeds[i].teams = poolsWithSeeds[i].teams.map((team, i) => ({
        ...team,
        seed: i + 1,
      }));
    }
  }
  return (
    <div className="flex flex-col pt-2">
      <p className="pb-2 text-2xl">Pools</p>
      <div className="flex grow flex-row flex-wrap gap-4">
        {poolsWithSeeds &&
          fullName &&
          poolsWithSeeds.map((pool, i, arr) => {
            let currentGame: CurrentGameT;
            if (pool.games) {
              currentGame = pool.games[isCurrentGame(pool.games)];
            }
            const isLastGame =
              isCurrentGame(pool.games) === pool.games.length - 1;
            console.log(isCurrentGame(pool.games), pool.games.length - 1);
            return (
              <div key={i}>
                <div className="flex flex-row items-center gap-4">
                  {pool.isFinished.toString() ? (
                    <div className="text-md">
                      isFinished: {pool.isFinished.toString()}{" "}
                    </div>
                  ) : null}
                  <div className="text-md">
                    isLastGame: {isLastGame.toString()}{" "}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        finishGameMock.mutate(
                          {
                            gameId: currentGame.gameId,
                            numSets: currentGame.numSets,
                            gameOneTeamOneScore:
                              currentGame.gameOneTeamOneScore,
                            gameOneTeamTwoScore:
                              currentGame.gameOneTeamTwoScore,
                            scoreCapGame1: currentGame.gameOneScoreCap,
                            gameTwoTeamOneScore:
                              currentGame.gameTwoTeamOneScore,
                            gameTwoTeamTwoScore:
                              currentGame.gameTwoTeamTwoScore,
                            scoreCapGame2: currentGame.gameTwoScoreCap,
                            gameThreeTeamOneScore:
                              currentGame.gameThreeTeamOneScore,
                            gameThreeTeamTwoScore:
                              currentGame.gameThreeTeamTwoScore,
                            scoreCapGame3: currentGame.gameThreeScoreCap,
                            teamOneId: currentGame.teams[0].teamId,
                            teamOneRating: currentGame.teams[0].Team.teamRating,
                            teamTwoId: currentGame.teams[1].teamId,
                            teamTwoRating: currentGame.teams[1].Team.teamRating,
                            isLastGame: isLastGame,
                            poolId: currentGame.poolId,
                          },
                          {
                            onSuccess: () => {
                              utils.tournament.getPoolsByDivision.invalidate();
                            },
                          },
                        );
                      }}
                      className="text-md rounded-lg border bg-orange-500 p-2"
                    >
                      Finish Next Game
                    </button>
                  </div>
                </div>
                <PoolTable
                  pool={pool}
                  poolNumber={i + 1}
                  pools={arr}
                  numBreaking={pool.numBreaking}
                  hasWildcards={pool.hasWildcards}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

type MyPoolSectionProps = {
  divisionId: number;
  numBreaking: number;
  hasWildcards: boolean;
};

export type getMyPoolReturnType =
  | {
      myPool: ({
        teams: {
          players: {
            user: {
              id: string;
              fullName: string;
              isAdmin: boolean;
              isTournamentDirector: boolean;
              playerRating: number;
            };
          }[];
          poolWins: number;
          poolLosses: number;
        }[];
      } & {
        poolId: string;
        isFinished: boolean;
        divisionId: number;
      })[];
      firstName: string | null;
      lastName: string | null;
    }
  | undefined;

const MyPoolSection = ({
  divisionId,
  numBreaking,
  hasWildcards,
}: MyPoolSectionProps) => {
  const myPool: getMyPoolReturnType = trpc.tournament.getMyPool.useQuery(
    {},
  ).data;
  const poolWithSeeds = myPool?.myPool;
  if (poolWithSeeds) {
    poolWithSeeds[0].teams = poolWithSeeds[0].teams.map((team, i) => ({
      ...team,
      seed: i + 1,
    }));
  }
  return (
    <div>
      <p className="pb-2 text-2xl">My Pool</p>
      <p className=" text-lg">
        isFinished: {myPool?.myPool[0].isFinished ? "True" : "False"}
      </p>
      {myPool && myPool.myPool && myPool.firstName && myPool.lastName ? (
        <>
          <MyPoolTable
            pool={poolWithSeeds}
            poolNumber={1}
            isMyPool={true}
            currentUserName={myPool?.firstName + " " + myPool?.lastName}
            numBreaking={numBreaking}
            hasWildcards={hasWildcards}
          />
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

type MyScheduleSectionProps = {
  tournamentId: number;
};

const MyScheduleSection = ({ tournamentId }: MyScheduleSectionProps) => {
  const mySchedule = trpc.tournament.getMyScheudule.useQuery({}).data;
  return (
    <div>
      <p className="pb-2 text-2xl">My Schedule</p>
      <PoolSchedule
        poolSchedule={mySchedule?.mySchedule}
        currentUserName={mySchedule?.firstName + " " + mySchedule?.lastName}
        tournamentId={tournamentId}
      />
    </div>
  );
};

type BracketSectionProps = {
  divisionId: number;
};

const BracketSection = ({ divisionId }: BracketSectionProps) => {
  const createBracket = trpc.bracket.createBracketSchedule.useMutation();
  const finishBracketGameMock =
    trpc.bracket.finishBracketGameMock.useMutation();
  const utils = trpc.useContext();
  const divisionBraket = trpc.bracket.getBracketByDivision.useQuery({
    divisionId: divisionId,
  }).data;
  const numCols =
    divisionBraket && Math.ceil(Math.log2(divisionBraket.games.length));
  const numRows = numCols && Math.pow(2, numCols);
  let divBracketWithBlanks =
    divisionBraket?.games.length === numRows ? divisionBraket : null;
  if (numRows) {
    console.log(AddBlankGamesToBracket(divisionBraket, numRows));
  }
  console.log("Div with blanks", divBracketWithBlanks);
  return (
    <div className="flex h-fit flex-col">
      <p className="pb-2 text-2xl">Bracket</p>
      <button
        className="text-md w-48 rounded-lg bg-purple-400 p-2 font-semibold"
        onClick={() => {
          createBracket.mutate({ divisionId: divisionId });
        }}
      >
        Create Bracket Schedule
      </button>
      <div>
        isFinished: {divisionBraket?.isFinished.toString()}
      </div>
      <div className={`flex flex-row-reverse justify-end gap-8`}>
        {numCols &&
          [...Array(numCols)].map((x, i) => {
            return (
              <div className="flex flex-col items-center justify-around gap-4 ">
                {divisionBraket &&
                  divisionBraket.games.map((game, j) => {
                    console.log("game", game);
                    const colToBeIn = Math.floor(Math.log2(j + 1));
                    // const rowHeight = Math.pow(2, numCols - colToBeIn);
                    // const rowHeightStr = 'row-span-' + rowHeight;
                    return (
                      <>
                        {colToBeIn === i && game ? (
                          <div className="flex w-64 flex-col border border-gray-300">
                            <div className="flex justify-between border-b border-gray-300 bg-slate-300 px-2 py-1 font-semibold">
                              <div className="flex">Game {game.gameId}</div>
                              <div className="mr-2 flex gap-2">
                                <button
                                  onClick={() => {
                                    finishBracketGameMock.mutate(
                                      {
                                        gameId: game.gameId,
                                        numSets: game.numSets,
                                        gameOneTeamOneScore:
                                          game.gameOneTeamOneScore,
                                        gameOneTeamTwoScore:
                                          game.gameOneTeamTwoScore,
                                        scoreCapGame1: game.gameOneScoreCap,
                                        gameTwoTeamOneScore:
                                          game.gameTwoTeamOneScore,
                                        gameTwoTeamTwoScore:
                                          game.gameTwoTeamTwoScore,
                                        scoreCapGame2: game.gameTwoScoreCap,
                                        gameThreeTeamOneScore:
                                          game.gameThreeTeamOneScore,
                                        gameThreeTeamTwoScore:
                                          game.gameThreeTeamTwoScore,
                                        scoreCapGame3: game.gameThreeScoreCap,
                                        teamOneId: game.teams[0].teamId,
                                        teamOneRating:
                                          game.teams[0].Team.teamRating,
                                        teamTwoId: game.teams[1].teamId,
                                        teamTwoRating:
                                          game.teams[1].Team.teamRating,
                                        nextGame: game.nextGame,
                                        bracketId: game.bracketId,
                                      },
                                      {
                                        onSuccess: () => {
                                          utils.bracket.getBracketByDivision.invalidate();
                                        },
                                      },
                                    );
                                  }}
                                  className="text-md rounded-md bg-green-500 p-2 font-bold"
                                >
                                  F
                                </button>
                                <button className="font-bold bg-red-500 p-2 rounded-md text-md">R</button>
                              </div>
                            </div>

                            <div className="flex h-36 w-full flex-col p-2">
                              {game.teams.map((team, k) => {
                                return (
                                  <div className="flex h-full flex-col ">
                                    {k === game.teams.length - 1 &&
                                    game.teams.length !== 1 ? (
                                      <div className="flex w-full justify-center">
                                        {" "}
                                        VS.{" "}
                                      </div>
                                    ) : null}
                                    <div className="flex items-center gap-4">
                                      <div className="flex flex-col ">
                                        {team.Team.players.map((player) => {
                                          return (
                                            <div className="tracking-wider">
                                              {player.user.fullName}
                                            </div>
                                          );
                                        })}
                                      </div>
                                      {k === 0 && game.teams.length !== 1 ? (
                                        <>
                                          <div>{game.gameOneTeamOneScore}</div>
                                          <div>{game.gameTwoTeamOneScore}</div>
                                          <div>
                                            {game.gameThreeTeamOneScore}
                                          </div>
                                        </>
                                      ) : k === 1 && game.teams.length !== 1 ? (
                                        <>
                                          <div>{game.gameOneTeamTwoScore}</div>
                                          <div>{game.gameTwoTeamTwoScore}</div>
                                          <div>
                                            {game.gameThreeTeamTwoScore}
                                          </div>
                                        </>
                                      ) : null}
                                    </div>
                                    {game.teams.length === 1 ? (
                                      <div className="flex flex-col">
                                        <div className="flex w-full items-center justify-center">
                                          {" "}
                                          VS.{" "}
                                        </div>
                                        <div className="flex h-full w-full grow items-center justify-center font-bold">
                                          TBD
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })}
                              {game.teams.length === 0 ? (
                                <>
                                  <div className="flex h-full w-full grow items-center justify-center font-bold">
                                    TBD
                                  </div>
                                  <div className="flex items-center justify-center">
                                    {" "}
                                    VS.{" "}
                                  </div>
                                  <div className="flex h-full w-full grow items-center justify-center font-bold">
                                    TBD
                                  </div>
                                </>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                        {colToBeIn === i && game === null ? (
                          <div className="invisible h-48 w-48 border border-l-teal-600">
                            <p>null</p>
                          </div>
                        ) : null}
                      </>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

function AddBlankGamesToBracket(divisionBracket: any, numRows: number) {
  let positionToEnter: number = 0;
  let positionToEnterXtra = "High";
  let numGames: number = numRows / 2;
  let numGamesToEnter =
    numGames - divisionBracket.games.slice(numGames - 1).length;
  let divBracketGames = divisionBracket.games;
  const positionsToEnter = {
    "32": [0, 1, 2, 3, 4, 5, 6, 7],
    "16": [0, 1, 2, 3, 4, 5, 6, 7],
    "8": [7, 11, 13, 9, 10, 14, 12, 8],
    "4": [3, 5, 5],
    "2": [1],
  };
  if (numGames) {
    const positionsArray = positionsToEnter[numGames.toString()];
    for (let i = 0; i < positionsArray.length; i++) {
      if (numGamesToEnter > 0) {
        divBracketGames.splice(positionsArray[i], 0, null);
        numGamesToEnter--;
      }
    }
  }
  console.log(divBracketGames);
  return { numGames, numGamesToEnter };
}

type DivisionControlProps = {
  divisionId: number;
  numBreaking: number;
};

const DivisionControls = ({
  divisionId,
  numBreaking,
}: DivisionControlProps) => {
  const utils = trpc.useContext();
  const updateNumBreakingPool =
    trpc.division.updateNumBreakingPool.useMutation();
  const allowWildcards = trpc.division.allowWildCards.useMutation();
  const [numBreakingValue, setNumBreakingValue] = useState(numBreaking);
  return (
    <div className="flex flex-col gap-2">
      <p className="pb-2 text-3xl">Division Controls</p>
      <div className="flex flex-row gap-2">
        <label htmlFor="" className="text-md font-semibold">
          Number Breaking Pool:
        </label>
        <input
          className="rounded-md border border-black p-1"
          type="number"
          value={numBreakingValue}
          onChange={(e) => {
            const valAsNum = Number(e.target.value);
            setNumBreakingValue(valAsNum);
          }}
        />
        <button
          type="submit"
          onClick={() => {
            updateNumBreakingPool.mutate(
              {
                divisionId,
                numBreaking: numBreakingValue,
              },
              {
                onSuccess: () => {
                  utils.tournament.getMyPool.invalidate();
                },
              },
            );
          }}
          className="flex"
        >
          {" "}
          Update Num Breaking
        </button>
      </div>

      <button
        type="submit"
        onClick={() => {
          allowWildcards.mutate(
            {
              divisionId,
            },
            {
              onSuccess: () => {
                utils.tournament.getMyPool.invalidate();
              },
            },
          );
        }}
        className="flex"
      >
        {" "}
        Allow Wildcards
      </button>
    </div>
  );
};

const isDivisionFinished = (pools: any) => {
  for (let i = 0; i < pools.length; i++) {
    if (!pools[i].isFinished) {
      return false;
    }
  }
  return true;
};

const amIInDivision = (division: any, fullName: string | undefined) => {
  for (const entry of division.entries) {
    for (const player of entry.players) {
      if (player.user.fullName === fullName) {
        return true;
      }
    }
  }
  return false;
};
