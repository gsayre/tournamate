"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PastTournaments from "./pastTournaments";
import UpcomingTournaments from "./upcomingTournaments";

export default function TournamentPage() {
  return (
    <div>
      
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
  );
}
