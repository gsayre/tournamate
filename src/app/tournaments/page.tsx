import Link from "next/link";
import TournamentPage from "../_components/tournament/tournamentPage";
import { Lock } from "lucide-react";
import { getServerAuthSession } from "@/server/auth";
import { Separator } from "@/components/ui/separator";

export default async function Tournaments() {
  const session = await getServerAuthSession();
  return (
    <main className="flex flex-col pt-6 px-4">
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
      <TournamentPage />
    </main>
  );
}
