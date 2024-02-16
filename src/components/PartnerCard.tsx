import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Division, User } from "@prisma/client";
import { Send } from "lucide-react";
import { trpc } from "utils/trpc";

type PartnerCardProps = {
  partner: User;
  tournamentId: number;
  divisionSelections: Division[];
  divisionSelected: number;
  setPartnerDivision: React.Dispatch<React.SetStateAction<number>>;
};

export const PartnerCard = ({
  partner,
  tournamentId,
  divisionSelected,
  divisionSelections,
  setPartnerDivision,
}: PartnerCardProps) => {
  const submitTeamInvitation =
    trpc.tournament.createTeamInvitation.useMutation();
  const { toast } = useToast();
  const handleFieldValue = (value: string) => {
    const parsedObj = JSON.parse(value);
    setPartnerDivision(parsedObj);
  }
  return (
    <div className=" group flex w-full flex-row  items-center space-x-4 p-4">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-400" />
      <p
        className={`text-md flex items-center justify-center font-semibold group-odd:text-emerald-500 group-even:text-indigo-500`}
      >
        {partner.fullName}
      </p>
      <Separator
        orientation="vertical"
        className="flex h-6 items-center justify-center bg-slate-400"
      />
      <p className={`flex items-center justify-center text-sm `}>
        {partner.playerRating}
      </p>
      <div className="flex grow justify-end">
        <Select onValueChange={handleFieldValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select Division" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Division</SelectLabel>
              {divisionSelections.map((division) => {
                return (
                  <SelectItem
                    key={division.name + division.type}
                    value={division.divisionId.toString()}
                  >
                    {division.type + " - " + division.name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <button
          onClick={() => {
            submitTeamInvitation.mutate(
              {
                teammateId: partner.id,
                tournamentId: tournamentId,
                divisionId: divisionSelected,
              },
              {
                onSuccess: () => {
                  toast({
                    title: "Invitation Sent",
                    description: `Invitation has been sent to ${partner.fullName}`,
                  });
                },
              },
            );
          }}
        >
          <Send className="hover:stroke-blue-400" />
        </button>
      </div>
    </div>
  );
};