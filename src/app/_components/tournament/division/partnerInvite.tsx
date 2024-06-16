"use client";
import { api } from "@/trpc/react";
import { Check, Mail } from "lucide-react";
import { useState } from "react";

export default function PartnerInvite({
  partnerId,
  divisionId,
  inviterId,
}: {
  partnerId: string;
  divisionId: number;
  inviterId: string;
  }) {
  const [submitted, setSubmitted] = useState(false);
  const inviteUser = api.tournamentBasic.createPartnerInvie.useMutation();
  return (
    <div>
      {submitted ? <Check className="h-4 w-4 text-green-500"/> : <Mail
      className="h-4 w-4 hover:text-blue-500"
      onClick={() =>
        inviteUser.mutate({ playerId: partnerId, divisionId, inviterId }, {onSuccess: () => setSubmitted(true)})
      }
    /> }
  </div>
  );
}
