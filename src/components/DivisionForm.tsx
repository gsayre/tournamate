/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [divisionName, setDivisionName] = useState<string>("");
  return (
    <div className="flex h-fit w-5/6 flex-row items-center bg-black/5 p-2 drop-shadow-lg">
      <p className="flex w-1/6 text-xl">
        New {props.sex.toLowerCase()} division:{" "}
      </p>
      <input
        type="text"
        onChange={(e) => {
          setDivisionName(e.target.value);
        }}
        className="w-2/6 border-b-2 border-gray-600 bg-transparent text-xl focus:border-gray-400 focus:pb-2 focus:outline-none"
      />
      <div className="flex w-full justify-end">
        <button
          className="flex h-8 w-20 items-center justify-center rounded-lg bg-green-400 text-xl hover:bg-green-500 "
          onClick={() => {
            createDivision.mutate(
              {
                divisionName: divisionName.toString(),
                tournamentId: Number(tournamentId),
                type: props.sex,
              },
              {
                onSuccess: () => {
                  router.reload();
                },
                onError: (err: any) => {
                  console.log(
                    "Create Division Error... Prob already exists dumbass",
                  );
                  console.log(err);
                },
              },
            );
          }}
        >
          {" "}
          Add
        </button>
      </div>
    </div>
  );
}
