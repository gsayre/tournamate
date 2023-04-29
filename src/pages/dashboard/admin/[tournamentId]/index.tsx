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

  useEffect(() => {
    const poolsFromEntries = createPoolsFromEntries(fakeEntriesToUse);
    const poolWithMe = poolsFromEntries.filter(function (element) {
      return amIInThePool(element, currentUserName as string);
    });
    const poolsWithoutMe = poolsFromEntries.filter(function (element) {
      return !amIInThePool(element, currentUserName as string);
    });
    console.log("Pool with me", poolWithMe);
    console.log("Pools without me", poolsWithoutMe);
    setMyPool(poolWithMe[0]);
    setPools(poolsWithoutMe);
  }, [fakeEntriesToUse]);

  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <Sidebar />
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className=" h-full w-full  p-4">
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
                        <p className="text-3xl">Pool:</p>
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
                            setMyPool={setMyPool}
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
                      <div className="flex flex-row">
                        <div className="flex flex-col">
                          <p>Pool</p>
                        </div>
                        <div className="flex flex-col">
                          <p>Pool Schedule</p>
                          <div>
                            {/* <PoolSchedule pool={myPool}  currentUserName={currentUserName as string}/> */}
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

type DivisionPannelProps = {
  format: string;
  id: number;
};

function DivisionPannel(props: DivisionPannelProps) {
  const divisions: Division[] = [];
  if (props.format.includes("SAME_SEX")) {
    const divMen = trpc.tournament.getDivisionsByType.useQuery({
      tournamentId: props.id,
      type: "MENS",
    });
    const divWom = trpc.tournament.getDivisionsByType.useQuery({
      tournamentId: props.id,
      type: "WOMENS",
    });
    if (divMen.data && divWom.data) {
      for (let i = 0; i < divMen.data.length; i++) {
        divisions.push(divMen.data[i]);
      }
      for (let i = 0; i < divWom.data.length; i++) {
        divisions.push(divWom.data[i]);
      }
    }
  } else {
    const divCoed = trpc.tournament.getDivisionsByType.useQuery({
      tournamentId: props.id,
      type: "COED",
    });
    if (divCoed.data) {
      for (let i = 0; i < divCoed.data.length; i++) {
        divisions.push(divCoed.data[i]);
      }
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="flex flex-col space-x-4 p-2">
          <p className="pb-4 text-2xl">Divisions</p>
          {props?.format?.includes("SAME_SEX") ? (
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <p className="pb-2 text-lg">Mens</p>
                <div className="flex flex-row space-x-4">
                  {divisions.filter(isCorrectDivision("MENS")).map((div) => (
                    <DivisionCard division={div} key={div.name} />
                  ))}
                  <NewDivisionForm type={props.format} sex={"MENS"} />
                </div>
              </div>
              <div>
                <p className="pb-2 text-lg">Womens</p>
                <div className="flex flex-row space-x-4">
                  {divisions.filter(isCorrectDivision("WOMENS")).map((div) => (
                    <DivisionCard division={div} key={div.name} />
                  ))}
                  <NewDivisionForm type={props.format} sex={"WOMENS"} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="pb-2 text-lg">Not Same Sex</p>
              <div className="flex flex-row space-x-4">
                {divisions.filter(isCorrectDivision("COED")).map((div) => (
                  <DivisionCard division={div} key={div.name} />
                ))}
                <NewDivisionForm type={props.format} sex={"COED"} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function isCorrectDivision(divisionToCompare: string) {
  return function (element: Division) {
    return element.type === divisionToCompare;
  };
}

type DivisionCardProps = {
  key: string;
  division: Division;
};

function DivisionCard(props: DivisionCardProps) {
  return (
    <Link
      href={`./${props.division.tournamentId}/${props.division.divisionId}`}
    >
      <div className="flex h-80 w-64 flex-col items-center justify-center rounded-md bg-white p-4 drop-shadow-lg hover:bg-slate-100">
        <div className="flex h-5/6 w-full flex-col items-center justify-center">
          <p className="pb-2 text-5xl font-bold">{props.division.name}</p>
          <p className="text-xl font-semibold">69 Entries</p>
        </div>
        <div className="flex h-1/6 w-full items-end justify-center italic">
          Click for more information
        </div>
      </div>
    </Link>
  );
}

type divisionFormProps = {
  type: string;
  sex: string;
};

function NewDivisionForm(props: divisionFormProps) {
  const createDivision = trpc.tournament.createDivision.useMutation();
  const router = useRouter();
  const tournamentId = router.query.tournamentId;
  const [divisionType, setDivisionType] = useState<string>(props.sex);
  const [divisionName, setDivisionName] = useState<string>("");
  return (
    <div className="flex h-80 w-64 flex-col items-center rounded-md border-2 border-dashed border-black/20 bg-black/5 p-4 drop-shadow-lg">
      <p className="text-xl">Division Creation Card</p>
      <p>pt1: {divisionType}</p>
      <p>pt2: {divisionName}</p>
      <div className="flex h-full flex-col">
        <div className="flex h-full flex-col items-center justify-center pb-4">
          <p className="pb-4 text-2xl">Division Name</p>
          <input
            type="text"
            onChange={(e) => {
              setDivisionName(e.target.value);
            }}
            className="w-3/4 border-b-2 border-gray-600 bg-transparent text-center text-xl focus:border-gray-400 focus:pb-2 focus:outline-none"
          />
        </div>
        <div className="flex w-full items-end justify-end">
          <button
            className="h-8 w-20 rounded-lg bg-blue-400 text-xl hover:bg-blue-500"
            onClick={() => {
              createDivision.mutate(
                {
                  divisionName: divisionName.toString(),
                  tournamentId: Number(tournamentId),
                  type: divisionType,
                },
                {
                  onSuccess: () => {
                    router.reload();
                  },
                  onError: (err: any) => {
                    console.log(
                      "Create Division Error... Prob already exists dumbass"
                    );
                    console.log(err);
                  },
                }
              );
            }}
          >
            {" "}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

type gameScheduleOptions = {
  numNets: number;
};
