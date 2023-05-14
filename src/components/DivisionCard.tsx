import { Division } from "@prisma/client";
import Link from "next/link";

export type DivisionCardProps = {
    key: string;
    division: Division;
  };
  
  export function DivisionCard(props: DivisionCardProps) {
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