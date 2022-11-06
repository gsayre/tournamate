import moment from "moment";
import Link from "next/link";
import type { NextPage } from "next/types";
import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";

type Tournament = {
  name: string;
  location: string;
  date: string;
  formats: string[];
};

const dummyTournamentData: Tournament[] = [
  {
    name: "Chaos Volleyball",
    location: "Raleigh, NC",
    date: "12/17/2022",
    formats: ["Same Sex", "Reverse Coed"],
  },
  {
    name: "Chucktown Volleyball",
    location: "Summerville, SC",
    date: "1/8/2022",
    formats: ["Same Sex", "Coed"],
  },
];

const Tournaments: NextPage = () => {
  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <Sidebar />
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className=" h-full w-full p-4">
            <div className="h-full w-full rounded-md bg-white p-4">
              <h1 className="pb-8 text-4xl font-semibold">Tournaments</h1>
              <div className="mb-8 flex h-12 w-96 items-center rounded-md bg-[#F3F4F6] p-2 pl-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                  width="30px"
                  height="30px"
                  className="h-6 fill-black"
                >
                  <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
                </svg>
                <p className="pl-4 text-xl font-bold">Search...</p>
              </div>
              <div className="flex flex-col space-y-4">
                {dummyTournamentData.map((tournament, i) => {
                  return (
                    <TournamentCard
                      name={tournament.name}
                      date={tournament.date}
                      location={tournament.location}
                      formats={tournament.formats}
                      key={i}
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

interface TCProps {
  name: string;
  location: string;
  date: string;
  formats: string[];
}

function TournamentCard(props: TCProps) {
  return (
    <div className="flex h-28 w-full flex-row items-center space-x-8 rounded-xl bg-[#F3F4F6]/50 p-4 hover:h-32 hover:bg-[#F3F4F6]/95">
      <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-[#2196F3] p-2">
        <p className="text-2xl">
          {moment(props.date).format("MMM Do YY").split(" ")[1]}
        </p>
        <p className="text-xl">
          {moment(props.date).format("MMM Do YY").split(" ")[0]}
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-2xl font-semibold tracking-widest">{props.name}</p>
        <p className="text-lg font-light tracking-wider">{props.location}</p>
      </div>
      <div className="flex h-12 w-48 items-center justify-center rounded-xl bg-[#F24E1E]/[.35] hover:bg-[#F24E1E]">
        <Link
          href={`./${props.name}/register`}
          className="text-lg font-semibold text-black opacity-100"
        >
          <a href={`./${props.name}/register`}>Enter Tournament!</a>
        </Link>
      </div>
      <p>
        {props.formats.map((format, i) => {
          return <span key={i}>{format + " "}</span>;
        })}
      </p>
    </div>
  );
}

export default Tournaments;
