import PartnerList from "@/app/_components/tournament/division/partnerList";
import PartnerSearch from "@/app/_components/tournament/division/partnerSearch";
import { api } from "@/trpc/server";
import { getServerAuthSession } from "@/server/auth";

export default async function TournamentDivision({
  params,
  searchParams,
}: {
  params: { tournamentId: string; divisionId: string };
  searchParams: { name?: string; page?: string };
}) {
  const name = searchParams.name ?? "";
  const division = await api.division.getDivision({
    divisionId: parseInt(params.divisionId),
  });
  const session = await getServerAuthSession();
  return (
    <div className="px-4 pt-8">
      <div className="text-3xl pb-4">{division?.type + " - " + division?.name}</div>
      {session && (
        <PartnerSearch>
          <PartnerList
            name={name}
            divisionId={division!.divisionId}
            inviterId={session.user.id}
          />
        </PartnerSearch>
      )}
    </div>
  );
}
