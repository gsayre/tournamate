/* eslint-disable @next/next/no-img-element */
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { Division, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Dispatch, SetStateAction, useState } from "react";
import Sidebar from "../../../../components/Sidebar";
import TopBar from "../../../../components/TopBar";
import { trpc } from "../../../../utils/trpc";

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
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {modalOpen ? (
        <SignupModal setModalOpen={setModalOpen} />
      ) : (
        <div className="flex h-screen w-screen">
          <div className="flex h-full w-full flex-row">
            <Sidebar />
            <div className="flex h-full w-full flex-col ">
              <TopBar />
              <div className=" h-full w-full ">
                <div className="flex h-2/6 w-full flex-row justify-between bg-gradient-to-b from-[#5AA5A0] to-[#5AA5A0]/0 p-4">
                  <div className="flex w-1/2 flex-col p-2 text-right">
                    <p className="pb-2 text-4xl text-gray-500">
                      {tournamentData?.tournament.name}
                    </p>
                    <p className="text-[#515151] ">
                      {tournamentData?.tournament.location.split(",")[0]}
                    </p>
                    <p className="text-[#515151]">
                      {tournamentData?.tournament.location.split(",")[1] +
                        "," +
                        tournamentData?.tournament.location.split(",")[2] +
                        tournamentData?.tournament.location.split(",")[3]}
                    </p>
                  </div>
                  <div className="h-5/6 w-0.5 bg-black" />
                  <div className="flex w-1/2 flex-row justify-end p-2">
                    <button
                      className="h-8 w-32 items-center justify-center rounded-xl bg-white py-2 px-4 text-sm hover:bg-green-700"
                      onClick={() => setModalOpen(true)}
                    >
                      Register
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  {divisionData &&
                    divisionData.map((division) => {
                      return (
                        <DivisionAccordian
                          division={division}
                          key={division.name + division.type}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

type divAccordianProps = {
  division: Division;
};

const DivisionAccordian = (props: divAccordianProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="flex h-fit w-5/6 flex-col text-white odd:bg-[#5BA6A1] even:bg-[#374C64]"
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      <div className="flex h-fit flex-row items-center space-x-4 p-2">
        {isOpen ? (
          <img
            src="/icons/icons8-triangle-arrow-24.png"
            alt="arrow"
            className="h-4 w-4 fill-white"
          />
        ) : (
          <img
            src="/icons/icons8-triangle-arrow-24.png"
            alt="arrow"
            className="h-4 w-4 -rotate-90"
          />
        )}
        <p className="text-2xl font-semibold">
          {props.division.type + " - " + props.division.name}
        </p>
      </div>

      {isOpen && (
        <div className="flex w-full flex-col bg-white p-4 text-black">
          <div className="flex flex-col">
            <p className="pb-2 text-2xl">Pools</p>
            <div className="flex flex-row space-x-4">
              <PoolTable />
              <PoolTable />
              <PoolTable />
              <PoolTable />
            </div>
          </div>
          <div className="flex flex-col pt-4">
            <p className="pb-2 text-2xl">Bracket</p>
          </div>
        </div>
      )}
    </div>
  );
};

const PoolTable = (props: any) => {
  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-slate-200">
      <div className="w-full rounded-t-xl bg-green-500 text-center">Header</div>
      <div>Team 1</div>
      <div>Team 2</div>
      <div>Team 3</div>
      <div>Team 4</div>
    </div>
  );
};
type SignupModalProps = {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

function SignupModal({ setModalOpen }: SignupModalProps) {
  const [daysToPlay, setDaysToPlay] = useState("1");
  const [playerOneName, setPlayerOneName] = useState("");
  const [playerTwoName, setPlayerTwoName] = useState("");
  const [playerOneResults, setPlayerOneResults] = useState<Array<User>>();
  const playerOneQuery = trpc.tournament.getTopFiveParnterResults;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/75">
      <div className="flex w-10/12 flex-col space-y-4 bg-white p-4">
        <p className="text-2xl font-semibold">Sign Up</p>
        <p>{daysToPlay}</p>
        <p>{playerOneName}</p>
        <p>{playerTwoName}</p>
        <div className="flex w-1/2 flex-col space-y-2">
          <label>Which day would you like to play?</label>
          <select
            name="type"
            id="type"
            className="border-2"
            onChange={(e) => setDaysToPlay(e.target.value)}
          >
            <option value={"1"}>Day One</option>
            <option value={"2"}>Day Two</option>
            <option value={"B"}>Both</option>
          </select>
          {daysToPlay === "B" ? (
            <div className="flex flex-col">
              <label>Who is your partner for day one?</label>
              <input
                type="text"
                className="border-b-2 border-black focus:outline-none"
                onChange={(e) => setPlayerOneName(e.target.value)}
              ></input>
              <label className="mt-4">Who is your partner for day two?</label>
              <input
                type="text"
                className="border-b-2 border-black focus:outline-none"
                onChange={(e) => setPlayerTwoName(e.target.value)}
              ></input>
            </div>
          ) : (
            <div className="flex flex-col">
              <label>Who is your partner for this day?</label>
              <div className="flex flex-row space-x-2">
                <input
                  type="text"
                  className="border-b-2 border-black focus:outline-none"
                  onChange={(e) => setPlayerOneName(e.target.value)}
                ></input>
                <button
                  onClick={() =>
                    setPlayerOneResults(
                      playerOneQuery.useQuery({ partner: playerOneName }).data
                    )
                  }
                >
                  Search
                </button>
              </div>

              {playerOneResults?.map((result) => {
                <div>
                  <p>{result.name}</p>
                </div>;
              })}
            </div>
          )}
        </div>
        <button
          onClick={() => setModalOpen(false)}
          className="h-10 w-28 rounded-3xl bg-red-500 p-2 text-xl font-semibold text-white hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
