"use client";
import { api } from "@/trpc/react";
import { Check } from "lucide-react";

export default function RequestApproval({ userId }: { userId: string }) {
  const approveTournamentDirectorApplication =
    api.admin.approveTournamentDirectorApplication.useMutation();
  return (
    <div
      className="flex flex-row items-center justify-center gap-2 text-green-500"
      onClick={() => {
        approveTournamentDirectorApplication.mutate({ userId: userId });
      }}
    >
      <Check className="h-4 w-4" />
      <button> Approve</button>
    </div>
  );
}
