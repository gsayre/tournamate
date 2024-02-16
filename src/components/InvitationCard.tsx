import { TeamInvitation } from "@prisma/client";
import { trpc } from "utils/trpc";

type invitationCardProps = {
  inviterId: string;
  inviteDetails: TeamInvitation;
  tournamentId: number;
};

export const InvitationCard = ({
  inviterId,
  inviteDetails,
  tournamentId,
}: invitationCardProps) => {
  const inviterData = trpc.user.getUser.useQuery({ inviterId: inviterId }).data;
  const divisionData = trpc.tournament.getDivision.useQuery({
    divisionId: inviteDetails.divisionId,
  }).data;
  const acceptInvitation = trpc.tournament.acceptTeamInvitation.useMutation();
  const declineInvitation = trpc.tournament.declineTeamInvitation.useMutation();
  return (
    <div className="flex h-32 w-72 flex-col justify-between rounded-xl bg-white p-4">
      <div className="flex flex-col ">
        <p className="pb-2 text-center text-lg font-semibold">
          {inviterData?.fullName}
        </p>
        <p className="text-xs text-[#515151]">
          Invited you to play{" "}
          <span className="font-bold capitalize">
            {divisionData?.type.toLocaleLowerCase() + " " + divisionData?.name}
          </span>{" "}
          in this tournament
        </p>
      </div>
      <div className="flex flex-row space-x-4">
        <button
          className="h-8 w-32 items-center justify-center rounded-xl bg-white px-4 py-2 text-sm hover:bg-green-700"
          onClick={() =>
            acceptInvitation.mutate({
              teamInvitationId: inviteDetails.inviteId,
              inviterId: inviterId,
              tournamentId: tournamentId,
            })
          }
        >
          {" "}
          Accept
        </button>
        <button
          className="h-8 w-32 items-center justify-center rounded-xl bg-white px-4 py-2 text-sm hover:bg-red-700"
          onClick={() =>
            declineInvitation.mutate({
              teamInvitationId: inviteDetails.inviteId,
            })
          }
        >
          {" "}
          Decline
        </button>
      </div>
    </div>
  );
};
