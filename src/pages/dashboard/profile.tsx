/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

const Profile: NextPage = () => {
  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <Sidebar />
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className="overflow-y-scroll p-2">
            <div className="flex flex-col space-x-4 space-y-6 overflow-y-auto overflow-x-hidden p-8">
              <ProfileBanner />
              <TournamentPlacement />
              <div className="flex w-full flex-row space-x-4">
                <TournamentHistory />
                <BasicStatisticsGrid />
              </div>
              <div className="flex w-full flex-row space-x-4">
                <div className="flex w-1/2 flex-row justify-around space-x-12">
                  <H2HCard nemesisName="Jane Shmoe" value={-9.4} />
                  <TopTournamentCard
                    tournamentName="Chaos Volleyball"
                    averagePlacement={1.2}
                  />
                </div>
                <div className="w-1/2">
                  <PartnerHistory />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ProfileBanner() {
  const { data: session } = useSession();
  return (
    <div className="mb-4 flex flex-col px-4">
      <div className="h-44 w-full rounded-xl bg-[url('/images/nature.webp')] bg-cover bg-center bg-origin-border" />
      <div className="flex flex-row justify-between px-16">
        <div className="flex">
          <div className="-mt-24 h-48 w-48 rounded-full bg-black bg-[url('/images/person1.avif')] bg-cover bg-center" />
          <div className="pl-6">
            <p className="text-3xl font-bold">{session?.user?.name}</p>
            <p className="text-xl">Player Location</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row space-x-2 ">
            <span className="text- text-lg font-semibold">Social Media</span>
            <img src="/icons/twitter.png" alt="" className="h-8 w-8" />
            <img src="/icons/instagram.webp" alt="" className="h-8 w-8" />
            <img src="/icons/facebook.webp" alt="" className="h-8 w-8" />
          </div>
          <button className="mt-2 h-8 w-36 rounded-lg bg-[#2196F3]">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

const dummyPlacementData = [
  {
    division: "Open",
    format: "Reverse Coed",
    averagePlacement: "3.8",
  },
  {
    division: "Open",
    format: "Coed",
    averagePlacement: "P3",
  },
  {
    division: "Open",
    format: "Same Sex",
    averagePlacement: "2.6",
  },
  {
    division: "AA",
    format: "Same Sex",
    averagePlacement: "1.9",
  },
];

function TournamentPlacement() {
  const { data: session } = useSession();

  return (
    <div className="flex h-64 w-full flex-col rounded-xl bg-white p-4 drop-shadow-lg">
      <p className="text-3xl font-semibold">Average Tournament Placement</p>
      <div className="flex flex-row p-4">
        {dummyPlacementData.map((placementData, i) => {
          return (
            <div className="flex flex-row items-center justify-center" key={i}>
              {i !== 0 ? (
                <div className="mx-4 h-40 w-0.5 border border-black" />
              ) : null}
              <div className="flex flex-col">
                <p className="text-3xl font-semibold">
                  {placementData.division}
                </p>
                <p className="text-xl">{placementData.format}</p>
              </div>
              <p className="mx-8 text-5xl font-bold">
                {placementData.averagePlacement}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface THIProps {
  placement: string;
  tournamentDate: string;
  tournamentName: string;
}
const dummyTournaments = [
  {
    placement: "1",
    tournamentDate: "12/16",
    tournamentName: "G-Vegas Volleyball",
  },
  {
    placement: "P3",
    tournamentDate: "12/16",
    tournamentName: "Chaos Volleyball",
  },
  {
    placement: "3",
    tournamentDate: "12/16",
    tournamentName: "The Crown",
  },
  {
    placement: "2",
    tournamentDate: "12/16",
    tournamentName: "Chucktown Volleyball",
  },
  {
    placement: "5",
    tournamentDate: "12/16",
    tournamentName: "Chaos Volleyball",
  },
];

function TournamentHistory() {
  return (
    <div className="flex h-96 w-3/6 flex-col rounded-lg bg-white p-4 drop-shadow-lg">
      <h1 className="pb-3 text-3xl font-bold">Tournament History</h1>
      {dummyTournaments.map((tournament) => {
        return (
          <TournamentHistoryItem
            placement={tournament.placement}
            tournamentDate={tournament.tournamentDate}
            tournamentName={tournament.tournamentName}
            key={tournament.tournamentName}
          />
        );
      })}
    </div>
  );
}

function TournamentHistoryItem(props: THIProps) {
  return (
    <div className="ml-6 flex flex-row items-center space-x-2 py-3 px-4 text-2xl font-semibold tracking-wider">
      {props.placement == "1" ? (
        <div className=" text-amber-400">1</div>
      ) : props.placement == "2" ? (
        <div className=" text-neutral-500">2</div>
      ) : props.placement == "3" ? (
        <div className=" text-amber-800">3</div>
      ) : (
        <div className="">{props.placement}</div>
      )}
      <p className="px-4">{props.tournamentDate}</p>
      <p className="">{props.tournamentName}</p>
    </div>
  );
}

const dummyStatsData = [
  {
    name: "Average Points Scored",
    value: 9.6,
  },
  {
    name: "Average Point Differential",
    value: -7.1,
  },
  {
    name: "Average Pool Play Win/Loss",
    value: 1.8,
  },
  {
    name: "Average Service Errors per Set",
    value: 2.3,
  },
  {
    name: "Average Doubles per Set",
    value: 0.4,
  },
  {
    name: "Average Attacking Errors",
    value: 3.8,
  },
];

function BasicStatisticsGrid() {
  return (
    <div className=" grid h-64 w-1/2 grid-cols-3 place-items-center gap-y-8">
      {dummyStatsData.map((statsData) => {
        return (
          <BasicStatisticsCard
            name={statsData.name}
            value={statsData.value}
            key={statsData.name}
          />
        );
      })}
    </div>
  );
}

interface BSCProps {
  name: string;
  value: number;
}

function BasicStatisticsCard(props: BSCProps) {
  return (
    <div className="flex h-44 w-44 flex-col items-center rounded-xl bg-white p-2 text-center drop-shadow-lg">
      <p className="text-xl font-semibold">{props.name}</p>
      <p className="mt-4 text-5xl font-bold">{props.value}</p>
    </div>
  );
}

interface H2HCProps {
  nemesisName: string;
  value: number;
}

function H2HCard(props: H2HCProps) {
  return (
    <div className="flex h-72 w-72 flex-col items-center rounded-xl bg-white p-4 text-center drop-shadow-lg">
      <div className="mt-2 h-36 w-36 rounded-full bg-[url('/images/person2.avif')] bg-cover bg-center bg-origin-border" />
      <p className="mt-4 text-3xl font-bold">{props.nemesisName}</p>
      <p className="mt-2 text-2xl font-semibold">{props.value}</p>
    </div>
  );
}

interface TTCProps {
  tournamentName: string;
  averagePlacement: number;
}

function TopTournamentCard(props: TTCProps) {
  return (
    <div className="flex h-72 w-72 flex-col items-center rounded-xl bg-white p-4 text-center drop-shadow-lg">
      <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#2196F3] bg-cover bg-center bg-origin-border">
        <img
          src="https://www.svgrepo.com/show/12756/cup.svg"
          alt="Cup SVG Vector"
          title="Cup SVG Vector"
          className="mt-2 h-24 w-24"
        />
      </div>
      <p className="mt-4 text-3xl font-bold">{props.tournamentName}</p>
      <p className="mt-2 text-2xl font-semibold">{props.averagePlacement}</p>
    </div>
  );
}

const dummyPartners = [
  {
    name: "Norville Rogers",
    playerRatingDelta: 2.2,
    divisionAveragePlacement: ["A: 5", "B: 2.3"],
  },
  {
    name: "Velma Dinkley",
    playerRatingDelta: 2.2,
    divisionAveragePlacement: ["A: 5", "B: 2.3"],
  },
  {
    name: "Fred Jones",
    playerRatingDelta: 2.2,
    divisionAveragePlacement: ["A: 5", "B: 2.3"],
  },
  {
    name: "Daphne Blake",
    playerRatingDelta: 2.2,
    divisionAveragePlacement: ["A: 5", "B: 2.3"],
  },
];

function PartnerHistory() {
  return (
    <div className="flex h-72 w-full flex-col overflow-y-auto rounded-lg bg-white p-4 drop-shadow-lg">
      <h1 className="pb-3 text-3xl font-bold">Partner History</h1>
      {dummyPartners.map((partner) => {
        return (
          <PartnerHistoryItem
            name={partner.name}
            playerRatingDelta={partner.playerRatingDelta}
            divisionAveragePlacement={partner.divisionAveragePlacement}
            key={partner.name}
          />
        );
      })}
    </div>
  );
}

interface PHIProps {
  name: string;
  playerRatingDelta: number;
  divisionAveragePlacement: string[];
}

function PartnerHistoryItem(props: PHIProps) {
  return (
    <div className="ml-6 flex flex-row items-center space-x-2 py-3 px-4 text-2xl font-semibold tracking-wider">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2196F3]">
        {props.name.split(" ")[0].charAt(0) +
          props.name.split(" ")[1].charAt(0)}
      </div>
      <p className="px-4">{props.name + " |"}</p>
      <p className="pr-2">{props.playerRatingDelta + " |"}</p>
      <p className="flex space-x-2">
        {props.divisionAveragePlacement.map((divisionAverage, i) => {
          return <span key={i}>{divisionAverage}</span>;
        })}
      </p>
    </div>
  );
}

export default Profile;
