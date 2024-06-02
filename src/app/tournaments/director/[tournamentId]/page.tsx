import AddDivisionForm from "@/app/_components/director/AddDivisionForm";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { Separator } from "@/components/ui/separator";
import DirectorDivisionPannel from "@/app/_components/director/directorDivisionPannel";

export default async function Page({
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
    <div className="flex flex-col px-4 py-2">
      {
        tournament && (
          <h1 className="text-3xl font-semibold pb-4">{tournament.name}</h1>)
      }
      <Separator className=""/>
      <div className="pt-4">
        <QuickActionsBar tournamentId={params.tournamentId} />
      </div>
      <div>
        <h3 className="pb-2 text-xl font-semibold">Divisions</h3>
        <DirectorDivisionPannel divisions={divisions} />
      </div>
    </div>
  );
}

function QuickActionsBar({ tournamentId }: { tournamentId: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="pb-2 text-xl font-semibold">Quick Actions</h3>
      <div className="flex flex-row items-center gap-2">
        <div className="flex items-center gap-4">
          <AddDivisionForm tournamentId={tournamentId} />
          <Separator orientation="vertical" className="h-28" />
        </div>
      </div>
    </div>
  );
}
