import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getServerAuthSession } from "@/server/auth";
import TDApplication from "./_components/tdApplication";
import { api } from "@/trpc/server";
import { Meteors } from "./_components/meteors";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  HandCoins,
  LineChart,
  Mail,
  TriangleAlert,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function Home() {
  const session = await getServerAuthSession();
  
  if (!session) {
    return (
      <div className="h-full w-full">
        <div className="h-screen w-screen">
          <div className="absolute inset-0 h-full w-full transform" />
          <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-4 py-8">
            <h1 className="relative z-50 mb-4 text-7xl font-bold">
              TournaMate
            </h1>

            <p className="relative z-50 mb-4 text-xl font-normal text-slate-500">
              Tournament management and participation made easy
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="flex flex-row "
            >
              <div className="rounded-lg border border-gray-500 px-4  py-1 text-gray-300 hover:bg-gray-500 hover:text-white">
                <span className="text-md tracking-wider">Explore</span>
              </div>
            </Link>

            <Meteors number={80} />
          </div>
        </div>
        <div className="w-screen px-96 pb-48">
          <h2 className="pb-4 text-5xl font-semibold">All In One Platform</h2>
          <p className="pb-4 text-lg text-slate-500">
            Tournament management tool which simplifies what it takes to run a
            smooth tournament. Create your tournament with the click of a button{" "}
            <br /> and build the best experience for your athletes
          </p>
          <div className="grid grid-cols-3 justify-items-center gap-4">
            <h3 className="col-span-3 text-xl font-semibold">Director</h3>
            <Card className="w-96 p-4">
              <Users className="my-2 h-10 w-10" />
              <CardTitle>Pool/Bracket Generation</CardTitle>
              <CardDescription>
                No need to manually create pools or brackets, our system will do
                it for you
              </CardDescription>
            </Card>
            <Card className="w-96 p-4">
              <DollarSign className="my-2 h-10 w-10" />
              <CardTitle>Built-in Payments</CardTitle>
              <CardDescription>
                Secure payments so you don&apos;t have to worry about handling
                money
              </CardDescription>
            </Card>
            <Card className="w-96 p-4">
              <Wrench className="my-2 h-10 w-10" />
              <CardTitle>Complete Control</CardTitle>
              <CardDescription>
                If you don&apos;t like how our system built your tournament you
                have the freedom to fix it yourself
              </CardDescription>
            </Card>
            <h3 className="col-span-3 pt-4 text-xl font-semibold">Athlete</h3>
            <Card className="w-96 p-4">
              <HandCoins className="my-2 h-10 w-10" />
              <CardTitle>Zero-Boundary Entry Cost</CardTitle>
              <CardDescription>
                We don&apos;t believe you should have to member fees to be able
                to participate
              </CardDescription>
            </Card>
            <Card className="w-96 p-4">
              <Mail className="my-2 h-10 w-10" />
              <CardTitle>Reminder System</CardTitle>
              <CardDescription>
                Receive notifications about your upcoming tournaments and
                matches so you don&apos;t miss your responsibilities
              </CardDescription>
            </Card>
            <Card className="w-96 p-4">
              <LineChart className="my-2 h-10 w-10" />
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>
                Track your performance and see how you could improve your game
              </CardDescription>
            </Card>
          </div>
        </div>
        <div className="flex h-48 w-full items-center justify-center">
          <Button className="h-36 w-96 rounded-2xl text-5xl shadow-lg shadow-slate-400">
            Start for free
          </Button>
        </div>
      </div>
    );
  }

  const hasName = await api.user.hasName({ userId: session.user.id });
  const hasActiveTDApplications =
    await api.role.getActiveTournamentDirectorApplications({
      userId: session.user.id,
    });

  return (
    <main className="flex min-h-screen flex-col p-2">
      <div className="flex flex-col p-8 pt-6">
        <div className="flex h-64 flex-row gap-4 pb-8">
          <Skeleton className="h-64 w-64 rounded-full" />
          <Separator orientation="vertical" />
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col gap-2">
              {session && (
                <h2 className=" text-3xl">
                  Welcome{" "}
                  <span className="font-bold tracking-tight">
                    {session.user?.name
                      ? session.user.name
                      : session.user.email}
                  </span>
                  !
                </h2>
              )}
              {session?.user.id &&
                !session.user.isTournamentDirector &&
                !hasActiveTDApplications && (
                  <TDApplication userId={session?.user.id} />
                )}
            </div>
            <div className="flex flex-col pr-16">
              {!hasName && (
                <Alert className="text-orange-500 border-orange-500">
                  <TriangleAlert className="h-4 w-4 stroke-orange-500" />
                  <AlertTitle>We&apos;re missing your name</AlertTitle>
                  <AlertDescription>
                    You can add your name to make it easier for other to search and find you
                  </AlertDescription>
                </Alert>
              )}
            </div>
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
