import { useAuth } from "@clerk/nextjs";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { DivisionPannel } from "@components/DivisionPannel";
import { MyPoolTable } from "@components/MyPoolTable";
import { PoolSchedule } from "@components/PoolSchedule";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TopBar from "@components/TopBar";
import { trpc } from "@utils/trpc";
import { FakeEntriesTeamArr } from "@utils/types/team";

export async function getServerSideProps(context: GetServerSidePropsContext) {
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
  const getMyPoolOutput = trpc.tournament.getMyPool.useQuery({ }).data
  const startTournamentForDay =
    trpc.tournament.startTournamentDay.useMutation();
  const [pools, setPools] = useState<Array<FakeEntriesTeamArr>>([]);

  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className=" h-full w-full overflow-auto p-4">
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
                {tournamentData?.tournament.dayOneStarted && getMyPoolOutput?.myPool ? (
                  <div className="flex w-full flex-col">
                    <div className="flex w-full flex-row space-x-4 pb-8 pt-4">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-3xl">My Pool:</p>
                        <div className="flex justify-center py-2">
                          {/* <MyPoolTable
                            poolNumber={1}
                            pool={getMyPoolOutput}
                            isMyPool={true}
                            currentUserName={currentUserName as string}
                            hasWildcards={getMyPoolOutput.myPool.}
                          /> */}
                        </div>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-3xl">Pool Schedule:</p>
                        <div>
                          {/* <PoolSchedule
                            pool={getMyPoolOutput}
                            currentUserName={currentUserName as string}
                            tournamentId={tId}
                          /> */}
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
                              {/* <MyPoolTable
                                pool={pool}
                                poolNumber={index + 1}
                                pools={arr}
                                setPools={setPools}
                                isMyPool={false}
                                currentUserName={currentUserName as string}
                              /> */}
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
                        {/* {myPool !== undefined && (
                          <div>
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
                                <PoolSchedule
                                  pool={myPool}
                                  currentUserName={currentUserName as string}
                                  tournamentId={tId}
                                />
                              </div>
                            </div>
                          </div>
                        )} */}
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
