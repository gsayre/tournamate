'use client';
import { api } from "@/trpc/react";
import { X } from "lucide-react";

export default function RequestDenial({ userId }: { userId: string }) {
    const denyTournamentDirectorApplication = api.admin.denyTournamentDirectorApplication.useMutation();
    return (
      <div
        className="flex flex-row items-center justify-center gap-2 text-red-500"
            onClick={() => {
                denyTournamentDirectorApplication.mutate({ userId: userId })
            }}
      >
        <X className="h-4 w-4" />
        <button>Reject</button>
      </div>
    );
}