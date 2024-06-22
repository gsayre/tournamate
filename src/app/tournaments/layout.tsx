import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Lock } from "lucide-react";
import { getServerAuthSession } from "@/server/auth";

export default async function TournamentRoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tournamentId: string };
  }) {
  const session = await getServerAuthSession();
  return (
    <div className="p-8 pt-6">
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
      <div className="flex flex-row items-center gap-2 p-2">
        <h2 className="pb-4 text-3xl font-bold tracking-tight">Tournaments</h2>
        <div className="flex flex-row gap-2">
          <Link href={"/tournaments/upcoming"}> Upcoming</Link>
          <Separator className="bg-black" orientation="vertical" />
          <Link href={"/tournaments/past"}> Past</Link>
        </div>
      </div>

      {children}
    </div>
  );
}
