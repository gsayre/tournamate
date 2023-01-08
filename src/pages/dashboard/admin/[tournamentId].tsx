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
            <DivisionPannel />
          </div>
        </div>
      </div>
    </div>
  );
}

interface DivisionsProps {
  divisions: Array<Division>;
}

function DivisionPannel() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-center space-x-4 p-2">
          <p className="text-xl">Divisions</p>
        </div>
        <NewDivisionForm />
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

function NewDivisionForm() {
  const createDivision = trpc.tournament.createDivision.useMutation();
  const router = useRouter();
  const { tournamentId } = router.query;
  const [divisionName, setDivisionName] = useState<string>("");
  return (
    <div className="flex h-80 w-64 flex-col rounded-md border-2 border-dashed border-black/20 bg-black/5 p-4 drop-shadow-lg hover:bg-black/10">
      <div className="flex flex-col">
        <p>Division Name</p>
        <input
          type="text"
          className="rounded-md "
          onChange={(e) => setDivisionName(e.target.value)}
        />
      </div>
      <div className="flex flex-row items-end justify-end h-full">
        <button
          className="flex items-end justify-end rounded-full bg-green-500 text-xl hover:font-semibold"
          onClick={() => {
            createDivision.mutate({
              name: divisionName,
              tournamentId: Number(tournamentId),
            });
          }}
        >
          Create Division
        </button>
      </div>
    </div>
  );
}
