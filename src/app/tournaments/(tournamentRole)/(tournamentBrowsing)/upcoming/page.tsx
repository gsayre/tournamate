import Link from "next/link";
import { Lock } from "lucide-react";
import { getServerAuthSession } from "@/server/auth";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";

export default async function UpcomingTournaments() {
  const session = await getServerAuthSession();
  const upcomingTournaments = await api.tournamentBasic.getPastTournaments();
  return (
    <main className="flex flex-col px-4 pt-6">
      <div className="flex flex-row gap-2 p-2 tracking-widest text-blue-500">
        <Link href="/tournaments">Player</Link>
        <Separator orientation="vertical" className="h-8 bg-gray-300" />
        <Link href="/tournaments/director">
          {session?.user.isTournamentDirector ? (
            <span>Tournament Director</span>
          ) : (
            <div className="flex flex-row items-center justify-center gap-1">
              <Lock className="h-4 w-4" />
              <span>Tournament Director</span>
            </div>
          )}
        </Link>
      </div>
    </main>
  );
}
