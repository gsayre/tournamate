import DivisionAccordian from "@/app/_components/tournament/division/divisionAccordian";
import PartnerList from "@/app/_components/tournament/division/partnerList";
import { api } from "@/trpc/server";

export default async function Tournament({
  params,
  searchParams,
}: {
  params: { tournamentId: string };
  searchParams: { name?: string; page?: string };
}) {
  const tournament = (
    await api.tournamentBasic.getTournament({
      tournamentId: parseInt(params.tournamentId),
    })
  )[0];

  const divisions = await api.division.getDivisions({
    tournamentId: parseInt(params.tournamentId),
  });
  const name = searchParams.name ?? "";
  return (
    <main className="flex flex-col p-8 pt-6">
      <div className="flex flex-col">
        <h2 className="pb-6 text-3xl font-bold tracking-tight">
          {tournament?.name}
        </h2>
      </div>
      <div>
        <h3 className="pb-2 text-2xl font-semibold tracking-tight">
          Divisions
        </h3>
        <DivisionAccordian divisions={divisions} name={name} />
      </div>
    </main>
  );
}
