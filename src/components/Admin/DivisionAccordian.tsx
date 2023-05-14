import { PoolTable } from "@components/PoolTable";
import { Division, Team, UsersInTeam, User } from "@prisma/client";
import { useState } from "react";

export type divAccordianProps = {
    division: (Division & {
      entries: (Team & {
        players: (UsersInTeam & {
          user: User;
        })[];
      })[];
    });
  };
  
 export const DivisionAccordian = ({division} : divAccordianProps) => {
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
                    <p>Here</p>
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