"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PastTournaments from "./pastTournaments";
import UpcomingTournaments from "./upcomingTournaments";
import { Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import TournamentCreationDialog from "./tournamentCreationDialog";

export default function TournamentPage({
  isTournamentDirector,
  userId,
}: {
  isTournamentDirector: boolean | undefined;
  userId: string;
}) {
  return (
    <div>
      <h2 className="pb-4 text-3xl font-bold tracking-tight">Tournaments</h2>
      <Tabs defaultValue="player">
        <TabsList>
          <TabsTrigger value="player">Player</TabsTrigger>
          <TabsTrigger
            value="tournament director"
            disabled={!isTournamentDirector}
          >
            {isTournamentDirector ? (
              <span>Tournament Director</span>
            ) : (
              <div className="flex flex-row items-center justify-center gap-1">
                <Lock className="h-4 w-4" />
                <span>Tournament Director</span>
              </div>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="player">
          <div className="flex flex-col p-4">
            <Tabs
              defaultValue="upcoming"
              className="space-y-4"
              orientation="horizontal"
            >
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                <UpcomingTournaments />
              </TabsContent>
              <TabsContent value="past">
                <PastTournaments />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent value="tournament director">
          <div className="p-2">
            <div className="flex flex-row justify-between">
              <h1 className="pb-4 text-3xl font-semibold">TD Page</h1>
              <TournamentCreationDialog userId={userId} />
            </div>
            <div className="w-fit pb-8">
              <h2 className="pb-6 text-2xl">Your Upcoming Tournaments</h2>
              <div className="flex flex-row gap-8 pb-4">
                <Skeleton className="h-32 w-64 rounded-xl" />
                <Skeleton className="h-32 w-64 rounded-xl" />
                <Skeleton className="h-32 w-64 rounded-xl" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
