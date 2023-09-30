import { PoolTable } from "@components/PoolTable";
import { Division, Team, UsersInTeam, User, Format } from "@prisma/client";
import { FakeEntriesTeamArr } from "../../utils/types/team";
import { useEffect, useState } from "react";
import {
  createFakeEntriesAnyTeams,
  createPoolsFromEntries,
} from "utils/lib/team-utils";
import { trpc } from "utils/trpc";
import { z } from "zod";
import { MyPoolTable } from "@components/MyPoolTable";
import { PoolSchedule } from "@components/PoolSchedule";

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
                      utils.tournament.getMyPool.invalidate()
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
};

const PoolSection = ({ poolsForDivision }: PoolSectionProps) => {
  return (
    <div className="flex flex-col pt-2">
      <p className="pb-2 text-2xl">Pools</p>
      <div className="flex grow flex-row flex-wrap gap-4">
        {poolsForDivision &&
          poolsForDivision.poolsForDivision &&
          poolsForDivision.poolsForDivision.map((pool, i, arr) => {
            return (
              <div key={i}>
                <PoolTable pool={pool} poolNumber={i + 1} pools={arr} />
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
  const poolWithSeeds = myPool?.myPool
  if (poolWithSeeds) {
    poolWithSeeds[0].teams = poolWithSeeds[0].teams.map((team, i) => ({...team, seed: i+1}));
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
  divisionId: number
};

const BracketSection = ({ divisionId}: BracketSectionProps) => {
  const createBracket = trpc.tournament.createBracketSchedule.useMutation()
  return (
    <div>
      <p className="pb-2 text-xl">BRACKETSECTION</p>
      <button className="p-2 bg-purple-400 rounded-lg font-semibold text-lg" onClick={() => { createBracket.mutate({divisionId: divisionId})}}>Create Bracket Schedule</button>
    </div>
  );
};

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
