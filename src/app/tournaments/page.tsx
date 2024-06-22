import Link from "next/link";
import TournamentPage from "../_components/tournament/tournamentPage";
import { Lock } from "lucide-react";
import { getServerAuthSession } from "@/server/auth";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";

export default async function Tournaments() {
  const session = await getServerAuthSession();
  const upcomingTournaments = await api.tournamentBasic.getUpcomingTournaments();
  return (
    <main className="flex flex-col pt-6 px-4">
      <TournamentPage />
    </main>
  );
}
