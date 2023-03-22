/* eslint-disable @next/next/no-img-element */
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { Division, Team, TeamInvitation, User, UsersInTeam } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
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
  const inviteData = trpc.tournament.getTeamInvitations.useQuery().data;
  const [modalOpen, setModalOpen] = useState(false);
  let firstDayDivisions;
  let secondDayDivisions;
  if (
    divisionData &&
    tournamentData &&
    tournamentData.tournament.dayOneFormat
  ) {
    firstDayDivisions = filterDivisions(
      divisionData,
      tournamentData.tournament.dayOneFormat
    );
    if (tournamentData.tournament.dayTwoFormat) {
      secondDayDivisions = filterDivisions(
        divisionData,
        tournamentData.tournament.dayTwoFormat
      );
    }
  }

  return (
    <>
      {modalOpen && firstDayDivisions && secondDayDivisions ? (
        <SignupModal
          setModalOpen={setModalOpen}
          divisionsPerDay={[firstDayDivisions, secondDayDivisions]}
        />
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
                  <div className="flex w-1/2 flex-col">
                    <div className="flex w-1/2 flex-row justify-end p-2">
                      <button
                        className="h-8 w-32 items-center justify-center rounded-xl bg-white py-2 px-4 text-sm hover:bg-green-700"
                        onClick={() => setModalOpen(true)}
                      >
                        Register
                      </button>
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
      )}
    </>
  );
}

function filterDivisions(divisions: Division[], dayFormat: string) {
  return divisions.filter((div) => {
    if (div.type == "MENS" || div.type == "WOMENS") {
      if (dayFormat == "SAME_SEX_DOUBLES" || dayFormat == "SAME_SEX_SIXES" || dayFormat == "SAME_SEX_TRIPLES") {
        return true;
      }
    }
    if (div.type == "COED") {
      if (dayFormat == "COED_DOUBLES" || dayFormat == "COED_SIXES" || dayFormat == "REVERSE_COED_DOUBLES" || dayFormat == "REVERSE_COED_QUADS") {
        return true;
      }
    }
  });
}

type invitationCardProps = {
  inviterId: string;
  inviteDetails: TeamInvitation;
  tournamentId: number
};

const InvitationCard = ({ inviterId, inviteDetails, tournamentId }: invitationCardProps) => {
  const inviterData = trpc.user.getUser.useQuery({ inviterId: inviterId }).data;
  const divisionData = trpc.tournament.getDivision.useQuery({ divisionId: inviteDetails.divisionId }).data;
  const acceptInvitation = trpc.tournament.acceptTeamInvitation.useMutation()
  const declineInvitation = trpc.tournament.declineTeamInvitation.useMutation()
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
          className="h-8 w-32 items-center justify-center rounded-xl bg-white py-2 px-4 text-sm hover:bg-green-700"
          onClick={() => acceptInvitation.mutate({ teamInvitationId: inviteDetails.inviteId, inviterId: inviterId, tournamentId: tournamentId})}
        >
          {" "}
          Accept
        </button>
        <button
          className="h-8 w-32 items-center justify-center rounded-xl bg-white py-2 px-4 text-sm hover:bg-red-700"
          onClick={() => declineInvitation.mutate({teamInvitationId: inviteDetails.inviteId})}
        >
          {" "}
          Decline
        </button>
      </div>
    </div>
  );
};

type divAccordianProps = {
  division: (Division & {
    entries: (Team & {
      players: (UsersInTeam & {
        user: User;
      })[];
    })[];
  });
};

const DivisionAccordian = ({division} : divAccordianProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDayOf, setIsDayOf] = useState(true);
  console.log(division)

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
  divisionsPerDay: Array<Division[]>;
};

function SignupModal({ setModalOpen, divisionsPerDay }: SignupModalProps) {
  const router = useRouter();
  const { tournamentId } = router.query;
  const tId: number = parseInt(tournamentId as string);
  const [daysToPlay, setDaysToPlay] = useState("1");
  const [playerOneName, setPlayerOneName] = useState("");
  const [playerTwoName, setPlayerTwoName] = useState("");
  const [partnerOneSelection, setPartnerOneSelection] = useState("");
  const [partnerTwoSelection, setPartnerTwoSelection] = useState("");
  const [partnerOneDivisionSelection, setPartnerOneDivisionSelection] =
    useState(0);
  const [partnerTwoDivisionSelection, setPartnerTwoDivisionSelection] =
    useState(0);
  const { data } = trpc.tournament.getTopFiveParnterResults.useQuery(
    { partner: playerOneName },
    { enabled: !!playerOneName }
  );
  const { data: data2 } = trpc.tournament.getTopFiveParnterResults.useQuery(
    { partner: playerTwoName },
    { enabled: !!playerTwoName }
  );
  const submitTeamInvitation =
    trpc.tournament.createTeamInvitation.useMutation();

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/75">
      <div className="flex w-fit flex-col space-y-4 rounded-lg bg-white p-8">
        <p className="text-2xl font-semibold">Sign Up</p>
        <div className="flex w-full flex-col space-y-2">
          <label>Which day would you like to play?</label>
          <select
            name="type"
            id="type"
            className="border-2"
            onChange={(e) => {
              setDaysToPlay(e.target.value);
              setPlayerOneName("");
              setPlayerTwoName("");
              setPartnerOneSelection("");
              setPartnerTwoSelection("");
              setPartnerOneDivisionSelection(0);
              setPartnerTwoDivisionSelection(0);
            }}
          >
            <option value={"1"}>Day One</option>
            <option value={"2"}>Day Two</option>
            <option value={"B"}>Both</option>
          </select>
          {daysToPlay === "B" ? (
            <div className="flex flex-row space-x-8">
              <div className="flex w-1/2 flex-col">
                <label>Who is your partner for day one?</label>
                <input
                  type="text"
                  className="border-b-2 border-black focus:outline-none"
                  value={playerOneName}
                  onChange={(e) => setPlayerOneName(e.target.value)}
                ></input>
                <div>
                  <p>Partner Results</p>
                  {data && (
                    <div>
                      {data.map((partner) => {
                        return (
                          <PartnerCard
                            key={partner.id}
                            partner={partner}
                            setPartnerSelection={setPartnerOneSelection}
                            partnerSelection={partnerOneSelection}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
                <DivisionSelector
                  divisionSelections={divisionsPerDay[0]}
                  divisionSelected={partnerOneDivisionSelection}
                  setPartnerDivision={setPartnerOneDivisionSelection}
                />
              </div>
              <div className="flex w-1/2 flex-col">
                <label>Who is your partner for day two?</label>
                <input
                  type="text"
                  className="border-b-2 border-black focus:outline-none"
                  value={playerTwoName}
                  onChange={(e) => setPlayerTwoName(e.target.value)}
                ></input>
                <div>
                  <p>Partner Results</p>
                  {data2 && (
                    <div>
                      {data2.map((partner) => {
                        return (
                          <PartnerCard
                            key={partner.id}
                            partner={partner}
                            setPartnerSelection={setPartnerTwoSelection}
                            partnerSelection={partnerTwoSelection}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
                <DivisionSelector
                  divisionSelections={divisionsPerDay[1]}
                  divisionSelected={partnerTwoDivisionSelection}
                  setPartnerDivision={setPartnerTwoDivisionSelection}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <label>Who is your partner for this day?</label>
              <div className="flex flex-row space-x-2">
                <input
                  type="text"
                  className="border-b-2 border-black focus:outline-none"
                  value={playerOneName}
                  onChange={(e) => setPlayerOneName(e.target.value)}
                ></input>
              </div>
              <div>
                <p>Partner Results</p>
                {data && (
                  <div className="flex flex-col space-y-2">
                    {data.map((partner) => {
                      return (
                        <PartnerCard
                          key={partner.id}
                          partner={partner}
                          setPartnerSelection={setPartnerOneSelection}
                          partnerSelection={partnerOneSelection}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <DivisionSelector
                divisionSelections={divisionsPerDay[0]}
                divisionSelected={partnerOneDivisionSelection}
                setPartnerDivision={setPartnerOneDivisionSelection}
              />
            </div>
          )}
        </div>
        <div className="flex w-full justify-end space-x-2">
          <button
            onClick={() => {
              partnerOneSelection !== ""
                ? submitTeamInvitation.mutate({
                    teammateId: partnerOneSelection,
                    tournamentId: tId,
                    divisionId: partnerOneDivisionSelection,
                  })
                : null;
              partnerTwoSelection !== ""
                ? submitTeamInvitation.mutate({
                    teammateId: partnerTwoSelection,
                    tournamentId: tId,
                    divisionId: partnerTwoDivisionSelection,
                  })
                : null;
              setModalOpen(false);
            }}
            className="h-10 w-28 rounded-3xl bg-green-500 p-2 text-xl font-semibold text-white hover:bg-green-600"
          >
            Submit
          </button>
          <button
            onClick={() => setModalOpen(false)}
            className="h-10 w-28 rounded-3xl bg-red-500 p-2 text-xl font-semibold text-white hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

type PartnerCardProps = {
  partner: User;
  partnerSelection: string;
  setPartnerSelection: React.Dispatch<React.SetStateAction<string>>;
};

const PartnerCard = (props: PartnerCardProps) => {
  return (
    <div className="flex flex-row space-x-2 rounded-lg bg-white p-4 drop-shadow-lg">
      <p className="text-xl font-semibold">{props.partner.fullName}</p>
      <button
        onClick={() => {
          if (props.partnerSelection === props.partner.id) {
            props.setPartnerSelection("");
          } else {
            props.setPartnerSelection(props.partner.id);
          }
        }}
      >
        {props.partnerSelection === props.partner.id ? (
          <div>
            <img
              src={"/icons/icons8-checked-checkbox-48.png"}
              alt=""
              className="h-14 w-14"
            />
          </div>
        ) : (
          <img
            src={"/icons/icons8-unchecked-checkbox-50.png"}
            alt=""
            className="h-10 w-10"
          />
        )}
      </button>
    </div>
  );
};

type DivisionSelectorProps = {
  divisionSelections: Division[];
  divisionSelected: number;
  setPartnerDivision: React.Dispatch<React.SetStateAction<number>>;
};

const DivisionSelector = ({
  divisionSelections,
  divisionSelected,
  setPartnerDivision,
}: DivisionSelectorProps) => {
  return (
    <div className="flex flex-col ">
      <label className="pb-2">What division are you playing in?</label>
      <div className="flex flex-row flex-wrap gap-2">
        {divisionSelections.map((divisionSelection) => {
          return (
            <div
              key={divisionSelection.divisionId}
              onClick={() => setPartnerDivision(divisionSelection.divisionId)}
              className={"flex h-28 w-28 rounded-lg bg-white p-4 drop-shadow-lg text-xl text-center font-semibold items-center" + (divisionSelection.divisionId === divisionSelected ? " bg-green-500 text-white" : "")}
            >
              {divisionSelection.type + " - " + divisionSelection.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};
