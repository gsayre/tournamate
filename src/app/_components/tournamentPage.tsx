"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PastTournaments from "./pastTournaments";
import UpcomingTournaments from "./upcomingTournaments";
import { Lock } from "lucide-react";

export default function TournamentPage({
  isTournamentDirector,
}: {
  isTournamentDirector: boolean | undefined;
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
          <TabsContent value="player">
            <div className="flex flex-col p-4">
              <h3 className="text-xl font-semibold tracking-tight">
                Tournaments
              </h3>
              <Tabs defaultValue="upcoming" className="space-y-4">
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
            <div>Tournament Director</div>
          </TabsContent>
        </TabsList>
      </Tabs>
    </div>
  );
}
