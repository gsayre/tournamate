import { PoolTable } from "@components/PoolTable";
import { Division, Team, UsersInTeam, User, Format } from "@prisma/client";
import { FakeEntriesTeamArr } from "../../utils/types/team";
import { useEffect, useState } from "react";
import {
  createFakeEntriesAnyTeams,
  createPoolsFromEntries,
} from "utils/lib/team-utils";
import { trpc } from "utils/trpc";
import { z } from "zod";

export type divAccordianProps = {
  division: Division & {
    entries: (Team & {
      players: (UsersInTeam & {
        user: User;
      })[];
    })[];
  };
  tournamentId: number;
  divisionType: Format;
  divisionSex?: Gender; //yes please
};

type Gender = "MENS" | "WOMENS" | undefined;

export const DivisionAccordian = ({
  division,
  tournamentId,
  divisionType,
  divisionSex,
}: divAccordianProps) => {
  const addUserToDivision = trpc.tournament.mockTournamentEntries.useMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [isDayOf, setIsDayOf] = useState(true);
  const [fakeEntriesToUse, setFakeEntriesToUse] = useState<FakeEntriesTeamArr>(
    []
  );

  const [pools, setPools] = useState<Array<FakeEntriesTeamArr>>([]);

  useEffect(() => {
    setFakeEntriesToUse(createFakeEntriesAnyTeams(8));
  }, []);

  useEffect(() => {
    setPools(createPoolsFromEntries(fakeEntriesToUse));
  }, [fakeEntriesToUse]);
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
        {divisionSex ? (
          <button
            className="rounded-lg bg-white p-2 font-semibold text-black"
            onClick={() => {
              addUserToDivision.mutate({
                tournamentId: 1,
                divisionId: division.divisionId,
                typeOfEntry: divisionType,
                sexOfEntry: divisionSex,
              });
            }}
          >
            Add Same Sex Entry
          </button>
        ) : (
          <button
            className="rounded-lg bg-white p-2 font-semibold text-black"
            onClick={() => {
              addUserToDivision.mutate({
                tournamentId: 1,
                divisionId: division.divisionId,
                typeOfEntry: divisionType,
              });
            }}
          >
            Add Coed Entry
          </button>
        )}
      </div>

      {isOpen && (
        <>
          {isDayOf ? (
            <div className="flex w-full flex-col bg-white p-4 text-black">
              <div className="flex flex-col">
                <p className="pb-2 text-2xl">Pools</p>
                <div className="flex flex-row space-x-4">
                  <p>Here</p>
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
                <div className="flex flex-col">
                  {division.entries &&
                    division.entries.map((entry, i) => {
                      return (
                        <div key={entry.teamId}>
                          <span className="pr-2">{i+1}</span>
                          {entry.players.map((player, i, arr) => {
                            return (
                              <>
                                {i == arr.length - 1 ? (
                                  <span key={player.userId}>
                                    {player.user.fullName}
                                  </span>
                                ) : (
                                  <span key={player.userId}>
                                    {player.user.fullName} {" - "}
                                  </span>
                                )}
                              </>
                            );
                          })}
                        </div>
                      );
                    })}
                  <ol className="list-inside list-decimal text-lg"></ol>
                </div>
                <div className="flex flex-col pt-2">
                  <p className="pb-2 text-2xl">Pools</p>
                  <div className="flex flex-row space-x-4">
                    <div className="flex-rows flex space-x-4">
                      <div className="flex flex-row space-x-4">
                        {pools.map((pool, i, arr) => {
                          return (
                            <div key={i}>
                              <PoolTable
                                pool={pool}
                                poolNumber={i + 1}
                                pools={arr}
                                setPools={setPools}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
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
