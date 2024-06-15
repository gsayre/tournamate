"use client";
import { Button } from "@/components/ui/button";

export default function PartnerInvite({ partnerId, divisionId }: { partnerId: string, divisionId: number }) {
  return (
    <Button className="w-full">
      Invite {partnerId} to {divisionId}
    </Button>
  );
}
