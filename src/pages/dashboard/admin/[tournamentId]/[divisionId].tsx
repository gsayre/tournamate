import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Sidebar from "../../../../components/Sidebar";
import TopBar from "../../../../components/TopBar";
import { trpc } from "../../../../utils/trpc";
import { FakeEntriesTeamArr } from "../../../../utils/types/team";
import { PoolTable } from "@components/PoolTable";
import { createFakeEntriesAnyTeams, createPoolsFromEntries } from "utils/lib/team-utils";

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
                  <p className="font-semibold text-3xl pb-2">Pools</p>
                  <div className="flex-rows flex space-x-4">
                    <div className="flex flex-row space-x-4">
                      {pools.map((pool, i, arr) => {
                        return (
                          <div key={i}>
                            <PoolTable pool={pool} poolNumber={i + 1} pools={arr} setPools={setPools} />
                          </div>
                        );
                      })}
                    </div>
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
