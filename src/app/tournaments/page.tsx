import { getServerAuthSession } from "@/server/auth";
import TournamentPage from "../_components/tournamentPage";

export default async function Tournaments() {
  const session = await getServerAuthSession();
  return (
    <main className="flex flex-col p-8 pt-6">
      <TournamentPage
        isTournamentDirector={session?.user.isTournamentDirector}
        userId={session!.user.id}
      />
    </main>
  );
}
