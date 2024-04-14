/* eslint-disable @next/next/no-img-element */
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { InvitationCard } from "@components/InvitationCard";
import { SignupModal } from "@components/SignupModal";
import {
  Division,
  Team,
  User,
  UsersInTeam
} from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import TopBar from "../../../../components/TopBar";
import { trpc } from "../../../../utils/trpc";

export async function getServerSideProps(context: GetServerSidePropsContext) {
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
  const inviteData = trpc.tournament.getTeamInvitations.useQuery().data;
  let firstDayDivisions;
  let secondDayDivisions;
  if (
    divisionData &&
    tournamentData &&
    tournamentData.tournament.dayOneFormat
  ) {
    firstDayDivisions = filterDivisions(
      divisionData,
      tournamentData.tournament.dayOneFormat,
    );
    if (tournamentData.tournament.dayTwoFormat) {
      secondDayDivisions = filterDivisions(
        divisionData,
        tournamentData.tournament.dayTwoFormat,
      );
    }
  }

  return (
    <>
        <div className="flex h-screen w-screen">
          <div className="flex h-full w-full flex-row">
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
                  <div className="flex w-1/2 flex-col">
                    <div className="flex w-1/2 flex-row justify-end p-2">
                      {firstDayDivisions && secondDayDivisions ? (
                        <SignupModal
                          divisionsPerDay={[
                            firstDayDivisions,
                            secondDayDivisions,
                          ]}
                          tournamentData={tournamentData}
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-row space-x-4 p-4">
                      {inviteData?.map((invite) => {
                        return (
                          <InvitationCard
                            key={invite.inviterId}
                            inviterId={invite.inviterId}
                            inviteDetails={invite}
                            tournamentId={tId}
                          />
                        );
                      })}
                    </div>
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
    </>
  );
}

function filterDivisions(divisions: Division[], dayFormat: string) {
  return divisions.filter((div) => {
    if (div.type == "MENS" || div.type == "WOMENS") {
      if (
        dayFormat == "SAME_SEX_DOUBLES" ||
        dayFormat == "SAME_SEX_SIXES" ||
        dayFormat == "SAME_SEX_TRIPLES"
      ) {
        return true;
      }
    }
    if (div.type == "COED") {
      if (
        dayFormat == "COED_DOUBLES" ||
        dayFormat == "COED_SIXES" ||
        dayFormat == "REVERSE_COED_DOUBLES" ||
        dayFormat == "REVERSE_COED_QUADS"
      ) {
        return true;
      }
    }
  });
}



type divAccordianProps = {
  division: Division & {
    entries: (Team & {
      players: (UsersInTeam & {
        user: User;
      })[];
    })[];
  };
};

const DivisionAccordian = ({ division }: divAccordianProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDayOf, setIsDayOf] = useState(true);
  console.log(division);

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
          {division.type + " - " + division.name}
        </p>
        <button
          className="rounded-lg bg-white p-2 font-semibold text-black"
          onClick={() => {
            setIsDayOf(!isDayOf);
          }}
        >
          Toggle Day Of
        </button>
      </div>

      {isOpen && (
        <>
          {isDayOf ? (
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
          ) : (
            <div className="flex w-full flex-col bg-white p-4 text-black">
              <div className="flex flex-col">
                <p className="pb-2 text-2xl">Entries</p>
                <div className="flex flex-row space-x-4">
                  {division.entries &&
                    division.entries.map((entry) => {
                      return (
                        <div key={entry.teamId}>
                          {entry.players.map((player) => {
                            return (
                              <div key={player.userId}>
                                {player.user.fullName}{" "}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                </div>
                <div className="flex flex-col pt-2">
                  <p className="pb-2 text-2xl">Pools</p>
                  <div className="flex flex-row space-x-4">
                    <PoolTable />
                    <PoolTable />
                    <PoolTable />
                    <PoolTable />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const PoolTable = () => {
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


