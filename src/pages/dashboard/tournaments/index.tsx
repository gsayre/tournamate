import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { Tournament } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import type { NextPage } from "next/types";
import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import { trpc } from "../../../utils/trpc";

export async function getServerSideProps(context: any) {
  const { userId } = getAuth(context.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return { props: { ...buildClerkProps(context.req) } };
}

const Tournaments: NextPage = () => {
  const tournamentData = trpc.tournament.getTournaments.useQuery().data;
  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <Sidebar />
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className=" h-full w-full p-4">
            <div className="h-full w-full rounded-md bg-white p-4">
              <h1 className="pb-8 text-4xl font-semibold">Tournaments</h1>
              <div className="flex flex-col space-y-4">
                {tournamentData &&
                  tournamentData.map((tournament) => {
                    return (
                      <TournamentCard
                        key={tournament.tournamentId}
                        tournament={tournament}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type TournamentCardProps = {
  tournament: Tournament;
};

function TournamentCard(props: TournamentCardProps) {
  return (
    <div className="flex h-28 w-full flex-row items-center space-x-8 rounded-xl bg-[#F3F4F6]/50 p-4 hover:h-32 hover:bg-[#F3F4F6]/95">
      <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-[#2196F3] p-2">
        <p className="text-2xl">
          {
            moment(props.tournament.dayOneDate)
              .format("MMM Do YY")
              .split(" ")[1]
          }
        </p>
        <p className="text-xl">
          {
            moment(props.tournament.dayOneDate)
              .format("MMM Do YY")
              .split(" ")[0]
          }
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-2xl font-semibold tracking-widest">
          {props.tournament.name}
        </p>
        <p className="text-lg font-light tracking-wider">
          {props.tournament.location}
        </p>
      </div>
      <div className="flex h-12 w-48 items-center justify-center rounded-xl bg-[#F24E1E]/[.35] hover:bg-[#F24E1E]">
        <Link
          href={`tournaments/${props.tournament.tournamentId}`}
          className="text-lg font-semibold text-black opacity-100"
        >
          Go To Tournament
        </Link>
      </div>
      <p>
        {props.tournament.dayOneFormat} {props.tournament.dayTwoFormat}
      </p>
    </div>
  );
}

export default Tournaments;
