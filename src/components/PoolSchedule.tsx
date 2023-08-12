import { FakeEntriesTeamArr } from "../utils/types/team";
import { useState, useEffect } from "react";
import {
  isCurrentGameFinished,
  finishCurrentGame,
  isCurrentGame,
} from "utils/lib/schedule-utils";
import { amIInTeam, amIReffing } from "utils/lib/am-i-in-utils";
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

  return (
    <div>
      <div>
        <div>Test</div>
        {/* {mySchedule?.map((game, i) => {
          return (
            <div
              className={`${game.gameFinished ? "bg-green-500/30" : ""} ${
                currentGameIndex == i ? "bg-gray-500/30" : ""
                } flex flex-col px-2 pt-2`}
              key = {i}
            >
              <div key={i} className={`flex w-full flex-row justify-between`}>
                <div className="flex flex-col">
                  <div className="flex flex-row space-x-4">
                    <span
                      className={`${
                        amIInTeam(game.teamOne, currentUserName) ||
                        amIInTeam(game.teamTwo, currentUserName)
                          ? "font-bold"
                          : ""
                      }`}
                    >
                      {game.teamOne.players[0].user.fullName} -{" "}
                      {game.teamOne.players[1].user.fullName} vs.{" "}
                      {game.teamTwo?.players[0].user.fullName} -{" "}
                      {game.teamTwo?.players[1].user.fullName}
                    </span>
                    <span>
                      {game.gameOneTeamOneScore} - {game.gameOneTeamTwoScore}
                    </span>
                    <span>
                      {game.gameTwoTeamOneScore !== undefined &&
                      game.gameTwoTeamTwoScore !== undefined
                        ? game.gameTwoTeamOneScore +
                          " - " +
                          game.gameTwoTeamTwoScore
                        : ""}
                    </span>
                    <span>
                      {game.gameThreeTeamOneScore !== undefined &&
                      game.gameThreeTeamTwoScore !== undefined
                        ? game.gameThreeTeamOneScore +
                          " - " +
                          game.gameThreeTeamTwoScore
                        : ""}
                    </span>
                  </div>
                  <p
                    className={`${
                      amIInTeam(game.refs, currentUserName) ? "font-bold" : ""
                    }`}
                  >
                    Reffing : {game.refs.players[0].user.fullName} -{" "}
                    {game.refs.players[1].user.fullName}
                  </p>
                </div>
                {amIReffing(game, currentUserName) && currentGameIndex == i ? (
                  <div className="flex">
                    <Link className="rounded-xl bg-green-500 p-2" href={`./${tournamentId}/${i}`}>
                      Ref Game
                    </Link>
                  </div>
                ) : currentGameIndex == i ? (
                  <div className="flex">
                    <button
                      className="rounded-xl bg-orange-500 p-2"
                      onClick={() =>
                        finishCurrentGame({
                          mySchedule,
                          setMySchedule,
                          currentGame: game,
                          gameIndex: i,
                          pool,
                        })
                      }
                    >
                      Finish Game
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="mt-2 flex h-0.5 w-5/6 rounded-xl bg-gray-500"></div>
            </div>
          );
        })} */}
      </div>
    </div>
  );
};
