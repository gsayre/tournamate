import TournamentCreationDialog from "@/app/_components/tournamentCreationDialog";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function Director() {
  const session = await getServerAuthSession();
  const myTournaments = await api.director.getMyTournaments({
    userId: session!.user.id,
  });
  return (
    <div className="p-2">
      <div className="flex flex-row justify-between">
        <h1 className="pb-4 text-3xl font-semibold">TD Page</h1>
        <TournamentCreationDialog userId={session!.user.id} />
      </div>
      <div className="w-fit pb-8">
        <h2 className="pb-6 text-2xl">Your Upcoming Tournaments</h2>
        <div className="flex flex-row gap-8 pb-4">
          {myTournaments.map((tournament) => (
            <Card key={tournament.tournamentId}>
              <CardHeader>
                <CardTitle>{tournament.name}</CardTitle>
                <CardDescription>
                  <Link href={`/tournaments/director/${tournament.tournamentId}`}>
                    {" "}
                    Go To
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <span>{tournament.dayOneDate.toLocaleDateString()}</span>
                {tournament.dayTwoDate && (
                  <span>
                    {" - " + tournament.dayTwoDate.toLocaleDateString()}
                  </span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        <Separator />
      </div>
      <div className="w-fit">
        <h2 className="pb-6 text-2xl">Your Past Tournaments</h2>
        <div className="flex flex-row gap-8 pb-4">
          <Skeleton className="h-32 w-64 rounded-xl" />
          <Skeleton className="h-32 w-64 rounded-xl" />
          <Skeleton className="h-32 w-64 rounded-xl" />
          <Skeleton className="h-32 w-64 rounded-xl" />
          <Skeleton className="h-32 w-64 rounded-xl" />
          <Skeleton className="h-32 w-64 rounded-xl" />
        </div>
        <Separator />
      </div>
    </div>
  );
}
