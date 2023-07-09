import Sidebar from "../../../../components/Sidebar";
import TopBar from "../../../../components/TopBar";
import { trpc } from "../../../../utils/trpc";
import { useRouter } from "next/router";
import { Division } from "@prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { useAuth } from "@clerk/nextjs";
import { MyPoolTable } from "@components/MyPoolTable";
import { PoolSchedule } from "@components/PoolSchedule";
import { FakeEntriesTeamArr } from "../../../../utils/types/team";
import { amIInThePool } from "utils/lib/am-i-in-utils";
import { createFakeEntriesAnyTeams, createPoolsFromEntries } from "utils/lib/team-utils";
import { NewDivisionForm } from "@components/DivisionForm";
import { DivisionPannel } from "@components/DivisionPannel";

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

export default function AdminTournamentView() {
  const router = useRouter();
  const { tournamentId } = router.query;
  const tId: number = parseInt(tournamentId as string);
  const { isSignedIn, userId } = useAuth();
  const currentUserName = trpc.user.findUsername.useQuery({
    id: userId as string,
  }).data;
  // const poolsForDivision = trpc.tournament.getPoolsByDivision.useQuery({
  //   divisionId: division.divisionId,
  // }).data;

  const tournamentData = trpc.tournament.getTournament.useQuery({
    id: tId,
  }).data;
  const startTournamentForDay =
    trpc.tournament.startTournamentDay.useMutation();
  const [fakeEntriesToUse, setFakeEntriesToUse] = useState<FakeEntriesTeamArr>(
    []
  );
  const [pools, setPools] = useState<Array<FakeEntriesTeamArr>>([]);
  const [myPool, setMyPool] = useState<FakeEntriesTeamArr>([]);

  useEffect(() => {
    if (currentUserName && userId) {
      const myEntry = {
        teamId: 69, //nice
        divisionId: 1,
        tournamentId: tId,
        teamRating: 420,
        poolId: "1",
        poolWins: 0,
        poolLosses: 0,
        players: [
          {
            userId: userId,
            teamId: 69,
            user: {
              id: userId,
              fullName: currentUserName,
              isAdmin: true,
              isTournamentDirector: true,
              playerRating: 420,
            },
          },
          {
            userId: "222",
            teamId: 69,
            user: {
              id: "222",
              fullName: "Joe Mama",
              isAdmin: false,
              isTournamentDirector: false,
              playerRating: 420,
            },
          },
        ],
      };
      const fakeEntriesToInsert = [...createFakeEntriesAnyTeams(11), myEntry];
      setFakeEntriesToUse(fakeEntriesToInsert);
    }
  }, [currentUserName, userId]);

  // useEffect(() => {
  //   const poolsFromEntries = createPoolsFromEntries(fakeEntriesToUse);
  //   const poolWithMe = poolsFromEntries.filter(function (element) {
  //     return amIInThePool(element, currentUserName as string);
  //   });
  //   const poolsWithoutMe = poolsFromEntries.filter(function (element) {
  //     return !amIInThePool(element, currentUserName as string);
  //   });
  //   console.log("Pool with me", poolWithMe);
  //   console.log("Pools without me", poolsWithoutMe);
  //   setMyPool(poolWithMe[0]);
  //   setPools(poolsWithoutMe);
  // }, [fakeEntriesToUse]);

  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <Sidebar />
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className=" h-full w-full p-4 overflow-auto">
            <p className="text-2xl text-gray-500">
              {tournamentData?.tournament.name}
            </p>
            <p className="text-xl text-gray-700">
              {tournamentData?.tournament.location}
            </p>
            <p>{tournamentData?.tournament.type}</p>
            <p>{tournamentData?.tournament?.dayOneDate.toDateString()}</p>
            <p>{tournamentData?.tournament?.dayOneFormat}</p>
            <p>{tournamentData?.tournament.dayTwoDate?.toString()}</p>
            {tournamentData?.tournament.dayOneDate && (
              <div className="p-4">
                <p className="pb-4 text-3xl">Day One</p>
                <button
                  className="rounded-lg bg-green-500 p-2 text-lg font-semibold text-white"
                  onClick={() => {
                    startTournamentForDay.mutate({
                      tournamentId: tId,
                      tournamentDay: 1,
                    });
                  }}
                >
                  Start Tournament Day
                </button>
                {tournamentData?.tournament.dayOneStarted ? (
                  <div className="flex w-full flex-col">
                    <div className="flex w-full flex-row space-x-4 pb-8 pt-4">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-3xl">My Pool:</p>
                        <div className="flex justify-center py-2">
                          <MyPoolTable
                            pool={myPool}
                            poolNumber={1}
                            pools={pools}
                            setPools={setPools}
                            isMyPool={true}
                            currentUserName={currentUserName as string}
                          />
                        </div>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-3xl">Pool Schedule:</p>
                        <div>
                          <PoolSchedule
                            pool={myPool}
                            currentUserName={currentUserName as string}
                            tournamentId={tId}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="pb-4 text-3xl">Other Pools:</p>
                      <div className="flex flex-row space-x-6">
                        {pools.map((pool, index, arr) => {
                          return (
                            <div className="flex w-80 flex-col" key={index}>
                              <p className="pb-2 text-xl">Pool {index + 1}</p>
                              <MyPoolTable
                                pool={pool}
                                poolNumber={index + 1}
                                pools={arr}
                                setPools={setPools}
                                isMyPool={false}
                                currentUserName={currentUserName as string}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <DivisionPannel
                    format={tournamentData.tournament.dayOneFormat}
                    id={tId}
                  />
                )}
              </div>
            )}
            {tournamentData?.tournament.dayTwoDate &&
              tournamentData.tournament.dayTwoFormat && (
                <div className="p-4">
                  <p className="pb-4 text-3xl">Day Two</p>
                  <button
                    className="rounded-lg bg-green-500 p-2 text-lg font-semibold text-white"
                    onClick={() => {
                      startTournamentForDay.mutate({
                        tournamentId: tId,
                        tournamentDay: 2,
                      });
                    }}
                  >
                    Start Tournament Day
                  </button>
                  {tournamentData.tournament.dayTwoStarted ? (
                    <div className="flex flex-col">
                      <div className="flex flex-row gap-4">
                        <div className="flex flex-col">
                          <p>My Pool</p>
                          <MyPoolTable
                            pool={myPool}
                            poolNumber={1}
                            pools={pools}
                            setPools={setPools}
                            isMyPool={true}
                            currentUserName={currentUserName as string}
                          />
                        </div>
                        <div className="flex flex-col">
                          <p>Pool Schedule</p>
                          <div>
                            <PoolSchedule pool={myPool}  currentUserName={currentUserName as string} tournamentId={tId}/>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p>Other Pools</p>
                        <div className="flex flex-row"></div>
                      </div>
                    </div>
                  ) : (
                    <DivisionPannel
                      format={tournamentData.tournament.dayTwoFormat}
                      id={tId}
                    />
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

type gameScheduleOptions = {
  numNets: number;
};
