import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getServerAuthSession } from "@/server/auth";
import TDApplication from "./_components/tdApplication";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col p-2">
      <div className="flex flex-col p-8 pt-6">
        <div className="flex h-64 flex-row gap-4 pb-8">
          <Skeleton className="h-64 w-64 rounded-full" />
          <Separator orientation="vertical" />
          <div className="flex flex-col gap-2">
            {session && (
              <h2 className=" text-3xl">
                Welcome{" "}
                <span className="font-bold tracking-tight">
                  {session.user?.name ? session.user.name : session.user.email}
                </span>
                !
              </h2>
            )}
            {session?.user.id && !session.user.isTournamentDirector && <TDApplication userId={session?.user.id} />}
          </div>
        </div>
        <div className="w-fit pb-8">
          <h2 className="pb-6 text-2xl">Upcoming Tournaments</h2>
          <div className="flex flex-row gap-8 pb-4">
            <Skeleton className="h-32 w-64 rounded-xl" />
            <Skeleton className="h-32 w-64 rounded-xl" />
            <Skeleton className="h-32 w-64 rounded-xl" />
          </div>
          <Separator />
        </div>
        <div className="w-fit">
          <h2 className="pb-6 text-2xl">Reccommended Tournaments</h2>
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
    </main>
  );
}
