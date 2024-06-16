import DivisionAccordian from "@/app/_components/tournament/division/divisionAccordian";
import { api } from "@/trpc/server";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

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
        {/* <DivisionAccordian divisions={divisions} name={name} /> */}
    </main>
  );
}
