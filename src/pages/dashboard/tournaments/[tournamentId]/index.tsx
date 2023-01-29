/* eslint-disable @next/next/no-img-element */
import { Division } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Sidebar from "../../../../components/Sidebar";
import TopBar from "../../../../components/TopBar";
import { requireAuth } from "../../../../utils/requireAuth";
import { trpc } from "../../../../utils/trpc";

export async function getServerSideProps(context: any) {
  return requireAuth(context);
}

export default function TournamentView() {
  const router = useRouter();
  const { tournamentId } = router.query;
  const tId: number = parseInt(tournamentId as string);
  const tournamentData = trpc.tournament.getTournament.useQuery({
    id: tId,
  }).data;
  const divisionData = trpc.tournament.getDivisions.useQuery({
    tournamentId: tId,
  }).data;

  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <Sidebar />
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className=" h-full w-full p-4">
            <p className="text-2xl text-gray-500">
              {tournamentData?.tournament.name}
            </p>
            <button className="rounded bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700">
              Sign Up
            </button>
            {divisionData &&
              divisionData.map((division) => {
                return (
                  <DivisionAccordian division={division} key={division.name} />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

type divAccordianProps = {
  division: Division;
};

const DivisionAccordian = (props: divAccordianProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div
      className="flex h-12 w-5/6 flex-col bg-slate-200"
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      <div className="flex flex-row items-center space-x-4 p-2">
        {isOpen ? (
          <img
            src="/icons/icons8-triangle-arrow-24.png"
            alt="arrow"
            className="h-4 w-4"
          />
        ) : (
          <img
            src="/icons/icons8-triangle-arrow-24.png"
            alt="arrow"
            className="h-4 w-4 -rotate-90"
          />
        )}
        <p className="text-2xl font-semibold">{props.division.name}</p>
      </div>

      {isOpen && (
        <div className="flex h-12 w-full flex-col p-4">
          <div className="flex flex-col">
            <p className="text-2xl pb-2">Pools</p>
            <div className="flex flex-row space-x-4">
              <PoolTable />
              <PoolTable />
              <PoolTable />
              <PoolTable />
            </div>
          </div>
          <div className="flex flex-col pt-4">
            <p className="text-2xl pb-2">Bracket</p>
          </div>
        </div>
      )}
    </div>
  );
};

const PoolTable = (props: any) => {
  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-slate-200">
      <div className="w-full text-center bg-green-500 rounded-t-xl">Header</div>
      <div>Team 1</div>
      <div>Team 2</div>
      <div>Team 3</div>
      <div>Team 4</div>
    </div>
  );
}


