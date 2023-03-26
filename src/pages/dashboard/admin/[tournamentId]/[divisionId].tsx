import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { Team, User, UsersInTeam } from "@prisma/client";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import Sidebar from "../../../../components/Sidebar";
import TopBar from "../../../../components/TopBar";
import { trpc } from "../../../../utils/trpc";
import { faker } from "@faker-js/faker";

export async function getServerSideProps(context: any) {
  const { userId } = getAuth(context.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }
  return { props: { ...buildClerkProps(context.req) } };
}

export default function Admin() {
  let divisionData;
  const router = useRouter();
  const { tournamentId, divisionId } = router.query;
  const tId: number = parseInt(tournamentId as string);
  if (divisionId) {
    divisionData = trpc.tournament.getDivision.useQuery({
      divisionId: +divisionId,
    }).data;
  }
  const [fakeEntriesToUse, setFakeEntriesToUse] = useState<FakeEntriesTeamArr>(
    []
  );
  const [pools, setPools] = useState<Array<FakeEntriesTeamArr>>([]);
  const [isSwapping, setIsSwapping] = useState(false);
  useEffect(() => {
    setFakeEntriesToUse(createFakeEntriesAnyTeams(8));
  }, []);
  useEffect(() => {
    setPools(createPoolsFromEntries(fakeEntriesToUse));
  }, [fakeEntriesToUse]);
  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <Sidebar />
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className=" h-full w-full  p-4">
            <p className="flex w-full justify-center pt-4 text-5xl">
              {divisionData?.name} division
            </p>
            <div className="flex h-full w-full flex-row space-x-8 overflow-x-scroll overflow-y-scroll p-4">
              <div className="flex h-5/6 w-96 flex-col bg-white p-2 drop-shadow-xl">
                <p className="pb-2 text-3xl font-semibold">Entries</p>
                <ol className="list-inside list-decimal text-lg">
                  {/* {divisionData &&
                    divisionData.entries &&
                    divisionData.entries.map((entry) => {
                      return (
                        <li key={entry.teamId}>
                          {entry.players.map((player) => {
                            return (
                              <span key={player.userId}>
                                {player.user.fullName}{" "}
                              </span>
                            );
                          })}
                        </li>
                      );
                    })} */}
                  {fakeEntriesToUse.map((entry) => {
                    return (
                      <li key={entry.teamId}>
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
                        <span>{" " + entry.teamRating}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div className="flex w-full flex-col space-y-8">
                <div className="flex h-2/6 w-full flex-col bg-white p-2 drop-shadow-xl">
                  <p>Pools</p>
                  <div className="flex-rows flex space-x-4">
                    {pools.map((pool, i) => {
                      return (
                        <>
                          <div className="flex flex-col w-auto rounded-xl bg-slate-200">
                            <div className="flex justify-center rounded-t-lg bg-[#0ACF83] py-2 text-2xl font-bold text-white">
                              Pool {i}
                            </div>

                            <div className="flex flex-row space-x-2 p-2">
                              <div className="flex w-1/6 flex-col">
                                <div className="flex">Place</div>
                                {pool.map((team, i) => {
                                  return (
                                    <>
                                      <div>{i + 1}</div>
                                    </>
                                  );
                                })}
                              </div>

                              <div className="grid grid-cols-6">
                                <div className="col-span-6">Team</div>
                                {pool.map((team, i) => {
                                  return (
                                    <>
                                      <div className="col-span-6">
                                        <div className="col-span-6 whitespace-nowrap">
                                          {team.players.map(
                                            (player, j, arr) => {
                                              return (
                                                <>
                                                  {j == arr.length - 1 ? (
                                                    <span key={player.userId}>
                                                      {player.user.fullName}
                                                    </span>
                                                  ) : (
                                                    <span key={player.userId}>
                                                      {player.user.fullName}{" "}
                                                      {" - "}
                                                    </span>
                                                  )}
                                                </>
                                              );
                                            }
                                          )}
                                        </div>
                                        <div>{team.teamRating}</div>
                                        <div className="flex justify-items-end">
                                          {isSwapping ? (
                                            <>
                                              {pools.map((nothing, t) => {
                                                return (
                                                  <>
                                                    <button
                                                      onClick={() => {
                                                        setIsSwapping(
                                                          !isSwapping
                                                        );
                                                      }}
                                                    >
                                                      {t + 1}
                                                    </button>
                                                  </>
                                                );
                                              })}
                                            </>
                                          ) : (
                                            <>
                                              <button
                                                onClick={() => {
                                                  setIsSwapping(!isSwapping);
                                                }}
                                              >
                                                Swap
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
                <div className="flex h-2/6 bg-white p-2 drop-shadow-xl">
                  Bracket
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const createPoolsFromEntries = (
  teams: FakeEntriesTeamArr
): Array<FakeEntriesTeamArr> => {
  const returnArr: Array<FakeEntriesTeamArr> = [];
  let zigzag = 0;
  let zig = false;
  let zag = false;
  let pausezigzag = false;
  teams.sort(function (a, b) {
    return b.teamRating - a.teamRating;
  });
  if (teams.length > 5) {
    const numPools = Math.ceil(teams.length / 4);
    for (let i = 0; i < numPools; i++) {
      returnArr.push([]);
    }
    for (const team of teams) {
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
    returnArr.push(teams);
    return returnArr;
  }
  return returnArr;
};

type FakeEntriesTeamArr = (Team & {
  players: (UsersInTeam & {
    user: User;
  })[];
})[];

const createFakeEntriesAnyTeams = (numTeams: number): FakeEntriesTeamArr => {
  const fakeEntries: FakeEntriesTeamArr = [];
  for (let i = 0; i < numTeams; i++) {
    fakeEntries.push(
      createFakeTeam({
        teamId: i + 1,
        divisionId: 1,
        teamRating: faker.datatype.number({ min: 500, max: 1500 }),
        tournamentId: 1,
        poolId: "1",
        userOneId: faker.random.numeric(3),
        userTwoId: faker.random.numeric(3),
        userOneName: faker.name.fullName(),
        userTwoName: faker.name.fullName(),
      })
    );
  }
  return fakeEntries;
};

type FakeEntriesTeam = Team & {
  players: (UsersInTeam & {
    user: User;
  })[];
};
type FakeTeamCriteria = {
  teamId: number;
  divisionId: number;
  teamRating: number;
  tournamentId: number;
  poolId: string;
  userOneId: string;
  userTwoId: string;
  userOneName: string;
  userTwoName: string;
};
function createFakeTeam({
  teamId,
  teamRating,
  divisionId,
  tournamentId,
  poolId,
  userOneId,
  userTwoId,
  userOneName,
  userTwoName,
}: FakeTeamCriteria): FakeEntriesTeam {
  const fakeTeam = {
    teamId,
    divisionId,
    tournamentId,
    teamRating,
    poolId,
    players: [
      {
        userId: userOneId,
        teamId,
        user: {
          id: userOneId,
          fullName: userOneName,
          isAdmin: false,
          isTournamentDirector: false,
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
        },
      },
    ],
  };
  return fakeTeam;
}
