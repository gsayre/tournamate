import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function TournamentLayout({
  children,
  params,
}: {
        children: React.ReactNode;
        params: { tournamentId: string };
    }) {
  const tournament = (
    await api.tournamentBasic.getTournament({
      tournamentId: parseInt(params.tournamentId),
    })
  )[0];

  const divisions = await api.division.getDivisions({
    tournamentId: parseInt(params.tournamentId),
  });
  return (
    <div className="p-8 pt-6">
      <div className="flex flex-col">
        <h2 className="pb-6 text-3xl font-bold tracking-tight">
          {tournament?.name}
        </h2>
      </div>
      <div className="">
        <h3 className="pb-2 text-2xl tracking-wide font-medium">
          Divisions
        </h3>
        <div className="flex flex-row gap-2">
          {divisions.map((division, index) => (
            <div key={division.divisionId} className="flex flex-row gap-2">
              <Link
                href={`/tournaments/${params.tournamentId}/${division.divisionId}`}
                className=" hover:text-blue-500 hover:underline"
              >
                {division.type + " - " + division.name}
              </Link>
              {index !== divisions.length - 1 && (
                <Separator className="bg-black" orientation="vertical" />
              )}
            </div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
