import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "utils/trpc";

export type divisionFormProps = {
    type: string;
    sex: string;
  };
  
 export function NewDivisionForm(props: divisionFormProps) {
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