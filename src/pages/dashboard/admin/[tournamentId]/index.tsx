import Sidebar from "../../../../components/Sidebar";
import TopBar from "../../../../components/TopBar";
import { trpc } from "../../../../utils/trpc";
import { useRouter } from "next/router";
import { Division } from "@prisma/client";
import { useState } from "react";
import Link from "next/link";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";

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
  const tournamentData = trpc.tournament.getTournament.useQuery({
    id: tId,
  }).data;
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
                <DivisionPannel
                  format={tournamentData.tournament.dayOneFormat}
                  id={tId}
                />
              </div>
            )}
            {tournamentData?.tournament.dayTwoDate &&
              tournamentData.tournament.dayTwoFormat && (
                <div className="p-4">
                  <p>Day Two</p>
                  <DivisionPannel
                    format={tournamentData.tournament.dayTwoFormat}
                    id={tId}
                  />
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
    console.log(divMen.data);
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
    console.log(divisions);
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
                <div className="flex flex-row">
                  {divisions.map((div) => (
                    <div key={div.divisionId} className="text-3xl">
                      {div.name}
                    </div>
                  ))}
                  <NewDivisionForm type={props.format} sex={"MENS"} />
                </div>
              </div>
              <div>
                <p className="pb-2 text-lg">Womens</p>
                <div className="flex flex-row">
                  <NewDivisionForm type={props.format} sex={"WOMENS"} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="pb-2 text-lg">Not Same Sex</p>
              <div className="flex flex-row space-x-4">
                {divisions.map((div) => (
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
        <div className="flex flex-col h-5/6 justify-center items-center w-full">
          <p className="pb-2 text-5xl font-bold">{props.division.name}</p>
          <p className="text-xl font-semibold">69 Entries</p>
        </div>
              <div className="flex items-end h-1/6 w-full justify-center italic">
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
                  divisionName: divisionName,
                  tournamentId: Number(tournamentId),
                  type: divisionType,
                },
                {
                  onSuccess: () => {
                    router.reload();
                  },
                  onError: (err:any) => {
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
