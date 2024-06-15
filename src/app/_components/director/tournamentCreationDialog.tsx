"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TournamentForm } from "./tournamentForm";

export default function TournamentCreationDialog({
  userId,
}: {
  userId: string;
}) {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button>Create Tournament</Button>
        </DialogTrigger>
        <DialogContent>
          <TournamentForm userId={userId} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
