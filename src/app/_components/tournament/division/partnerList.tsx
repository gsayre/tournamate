import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/server";
import { Separator } from "@/components/ui/separator";
import PartnerInvite from "./partnerInvite";

export default async function PartnerList({
  name,
  divisionId,
  inviterId,
}: {
  name: string;
  divisionId: number;
  inviterId: string;
}) {
  const potentialPartners = await api.tournamentBasic.findPartner({
    playerName: name,
  });
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Partners</h4>
        {potentialPartners.map((partner) => (
          <>
            <div
              key={partner.id}
              className={`${name.length > 0 ? "" : "hidden"} flex flex-row gap-2 items-center justify-around`}
            >
              <p>{partner.name}</p>
              <PartnerInvite
                partnerId={partner.id}
                divisionId={divisionId}
                inviterId={inviterId}
              />
            </div>
            <Separator className={`${name.length > 0 ? "" : "hidden"} my-2`} />
          </>
        ))}
      </div>
    </ScrollArea>
  );
}
