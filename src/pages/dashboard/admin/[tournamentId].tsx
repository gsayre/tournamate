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
                <p className="text-3xl pb-4">Day One</p>
                <DivisionPannel format={tournamentData.tournament.dayOneFormat } />
              </div>
            )}
            {tournamentData?.tournament.dayTwoDate && (
              <div className="p-4">
                <p>Day Two</p>
                <DivisionPannel format={tournamentData.tournament.dayTwoFormat } />
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
}

function DivisionPannel(props: DivisionPannelProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="flex flex-col space-x-4 p-2">
          <p className="text-2xl pb-4">Divisions</p>
          {props.format.includes("SAME_SEX") ? (
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <p className="pb-2 text-lg">Men's</p>
                <div className="flex flex-row">
                  <NewDivisionForm type={props.format } />
                </div>
              </div>
              <div>
                <p className="pb-2 text-lg">Women's</p>
                <div className="flex flex-row">
                  <NewDivisionForm type={props.format} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="pb-2 text-lg">Not Same Sex</p>
              <div className="flex flex-row">
                <NewDivisionForm type={props.format} />
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
  type: string
}

function NewDivisionForm(props: divisionFormProps) {
  const createDivision = trpc.tournament.createDivision.useMutation();
  const router = useRouter();
  const { tournamentId } = router.query;
  const [divisionType, setDivisionType] = useState<string>("");
  const [divisionName, setDivisionName] = useState<string>("");
  return (
    <div className="flex h-80 w-64 flex-col items-center rounded-md border-2 border-dashed border-black/20 bg-black/5 p-4 drop-shadow-lg">
      <p className="text-xl">Division Creation Card</p>
      {divisionType === "" && props.type.includes("SAME_SEX") ? (<FormPartOne partOneInfo={setDivisionType} />) : (<FormPartTwo partTwoInfo={setDivisionName} />)}
    </div>
  );
}
type FormP1Props = {
  setDivisionType: React.Dispatch<React.SetStateAction<string>>;
};

function FormPartOne(props: FormP1Props) {
  return (
    <div className="flex h-full w-full flex-col space-y-2 p-4">
      <button
        className="h-3/6 w-full rounded-lg bg-blue-400 text-xl hover:bg-blue-500"
        onClick={() => {
          props.setDivisionType("mens");
        }}
      >
        Men's
      </button>
      <button
        className="h-3/6 rounded-lg bg-red-400 text-xl hover:bg-red-500"
        onClick={() => {
          props.setDivisionType("womens");
        }}
      >
        Women's
      </button>
    </div>
  );
}

type FormP2Props = {
  partTwoInfo: React.Dispatch<React.SetStateAction<string>>;
};

function FormPartTwo(props: FormP2Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col items-center justify-center h-full pb-4">
        <p className="text-2xl pb-4">Division Name</p>
        <input
          type="text"
          className="border-b-2 border-gray-600 bg-transparent focus:outline-none focus:border-gray-300"
        />
      </div>
      <div className="flex w-full items-end justify-end">
        <button className="bg-blue-400 text-xl hover:bg-blue-500 rounded-lg h-8 w-20"> Submit</button>
      </div>
    </div>
  );
}
