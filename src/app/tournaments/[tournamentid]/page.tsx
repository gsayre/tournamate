import DivisionAccordian from "@/app/_components/divisionAccordain";
import { api } from "@/trpc/server";

export default async function Tournament({
  params,
}: {
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
    <main className="flex flex-col p-8 pt-6">
      <h2 className="pb-6 text-3xl font-bold tracking-tight">{tournament?.name}</h2>
      <div>
        <h3 className="pb-2 text-2xl font-semibold tracking-tight">
          Divisions
        </h3>
        <DivisionAccordian  divisions={divisions} />
      </div>
    </main>
  );
}
