import { api } from "@/trpc/server"

export default async function Page({ params }: { params: { tournamentId: string } }) {
    const tournament = (await api.tournamentBasic.getTournament({ tournamentId: parseInt(params.tournamentId) }))[0];
    return (
      <div>
        <h1 className="text-3xl font-semibold">
          TD Page {params.tournamentId}
        </h1>
        {tournament && (
          <h2 className="text-2xl">Tournament Name: {tournament.name}</h2>
        )}
      </div>
    );
}