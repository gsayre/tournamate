import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import { ClassRegistry } from "superjson/dist/class-registry";
import { Division } from "@prisma/client";
import { useState } from "react";

export default function AdminTuornamentView() {
  const router = useRouter();
  const { tournamentId } = router.query;
  const tournamentData = trpc.tournament.getTournament.useQuery({
    id: Number(tournamentId),
  }).data;
  console.log(tournamentData);
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
                  id={Number(tournamentId)}
                />
              </div>
            )}
            {tournamentData?.tournament.dayTwoDate && (
              <div className="p-4">
                <p>Day Two</p>
                <DivisionPannel
                  format={tournamentData.tournament.dayTwoFormat}
                  id={Number(tournamentId)}
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
  format: string ;
  id: number;
};

function DivisionPannel(props: DivisionPannelProps) {
  let divisions:Array<Division> = []
  if (props.format.includes("SAME_SEX")) { 
    const divMen = trpc.tournament.getDivisions.useQuery({ tournamentId: props.id, type: "MENS" })
    const divWom = trpc.tournament.getDivisions.useQuery({ tournamentId: props.id, type: "WOMENS" })
    console.log(divMen.data)
  } else {
    const divCoed = trpc.tournament.getDivisions.useQuery({ tournamentId: props.id, type: "COED" })
   console.log(divCoed.data)
};
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
                <div className="flex flex-row">
                  {division.map((div) => (<div>{div.name}</div>)}
                <NewDivisionForm type={props.format} sex={"COED"} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function division() {
  return (
    <div>
      <p>Division</p>
    </div>
  );
}

type divisionFormProps = {
  type: string;
  sex: GenderType;
};

function NewDivisionForm(props: divisionFormProps) {
  const createDivision = trpc.tournament.createDivision.useMutation();
  const router = useRouter();
  const { tournamentId } = router.query;
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
              createDivision.mutate({
                divisionName: divisionName,
                tournamentId: Number(tournamentId),
                type: divisionType,
              }, { onSuccess: () => { router.reload()} });
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
