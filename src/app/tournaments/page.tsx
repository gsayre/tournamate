"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import UpcomingTournaments from "../_components/upcomingTournaments";
import PastTournaments from "../_components/pastTournaments";

export default function Tournaments() {
  return (
    <main className="flex flex-col p-8 pt-6">
      <h2 className="pb-4 text-3xl font-bold tracking-tight">Tournaments</h2>
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
    </main>
  );
}
