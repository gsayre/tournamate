import { FakeEntriesTeamArr } from "../utils/types/team";
import { useState, useEffect } from "react";
import {
  isCurrentGameFinished,
  finishCurrentGame,
  isCurrentGame,
} from "utils/lib/schedule-utils";
import { amIReffing } from "utils/lib/am-i-in-utils";
import { FakeGame } from "../utils/types/game";
import Link from "next/link";

type GameSchedule = {
  poolId: string;
};

type PoolScheduleProps = {
  poolSchedule: any;
  currentUserName: string;
  // setMyPool: React.Dispatch<React.SetStateAction<FakeEntriesTeamArr>>;
  tournamentId: number;
};

export const PoolSchedule = ({
  poolSchedule,
  currentUserName,
  tournamentId,
}: PoolScheduleProps) => {
  console.log("Sched maybe", poolSchedule);

  return (
    <div>
      <div>
        {poolSchedule &&
          poolSchedule[0].games.map((game, i) => {
            let player1: string | undefined =
              game.teams[0].Team.players[0].user.fullName;
            let player2: string | undefined =
              game.teams[0].Team.players[1].user.fullName;
            let player3: string | undefined =
              game.teams[1].Team.players[0].user.fullName;
            let player4: string | undefined =
              game.teams[1].Team.players[1]?.user.fullName;
            return (
              <div
                className={`${game.gameFinished ? "bg-green-500/30" : ""} ${
                  999 == i ? "bg-gray-500/30" : ""
                } flex flex-col px-2 pt-2`}
                key={i}
              >
                <div key={i} className={`flex w-full flex-row justify-between`}>
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center justify-center gap-4">
                      <div className="flex flex-row space-x-4">
                        <div className="flex flex-col">
                          <span>{player1 ? <>{player1}</> : <></>}</span>
                          <span>{player2 ? <>{player2}</> : <></>}</span>
                        </div>
                        <span>vs</span>
                        <div className="flex flex-col">
                          <span>{player3 ? <>{player3}</> : <></>}</span>
                          <span>{player4 ? <>{player4}</> : <></>}</span>
                        </div>
                      </div>
                      <span>
                        {game.gameOneTeamOneScore} - {game.gameOneTeamTwoScore}
                      </span>
                      <span>
                        {game.gameTwoScoreCap !== null
                          ? game.gameTwoTeamOneScore +
                            " - " +
                            game.gameTwoTeamTwoScore
                          : ""}
                      </span>
                      <span>
                        {game.gameThreeScoreCap !== null
                          ? game.gameThreeTeamOneScore +
                            " - " +
                            game.gameThreeTeamTwoScore
                          : ""}
                      </span>
                    </div>
                    <p>
                      {/* Reffing : {game.refs.players[0].user.fullName} -{" "}
                      {game.refs.players[1].user.fullName} */}
                    </p>
                  </div>
                  {/* {amIReffing(game, currentUserName) && 999 == i ? (
                    <div className="flex">
                      <Link
                        className="rounded-xl bg-green-500 p-2"
                        href={`./${tournamentId}/${i}`}
                      >
                        Ref Game
                      </Link>
                    </div>
                  ) : 999 == i ? (
                    <div className="flex">
                      <button
                        className="rounded-xl bg-orange-500 p-2"
                        onClick={() => {}}
                      >
                        Finish Game
                      </button>
                    </div>
                  ) : (
                    <></>
                  )} */}
                </div>
                <div className="mt-2 flex h-0.5 w-5/6 rounded-xl bg-gray-500"></div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
