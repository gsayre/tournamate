import { FakeGame } from "../types/game";
import { FakeEntriesTeam, FakeEntriesTeamArr } from "../types/team";
import type { Dispatch, SetStateAction } from "react";

export function isCurrentGame(schedule: FakeGame[]): number {
  for (let i = 0; i < schedule.length; i++) {
    if (!schedule[i].gameFinished) {
      return i;
    }
  }
  return -1;
}

export function isCurrentGameFinished(game: FakeGame): boolean {
  if (game.currentSet > game.numSets) {
    return true;
  }
  return false;
}

type finishCurrentGameArgs = {
  mySchedule: FakeGame[];
  setMySchedule: Dispatch<SetStateAction<FakeGame[] | undefined>>;
  currentGame: FakeGame;
  gameIndex: number;
  pool: FakeEntriesTeamArr;
  setMyPool: Dispatch<SetStateAction<FakeEntriesTeamArr>>;
};

export function finishCurrentGame({
  mySchedule,
  setMySchedule,
  gameIndex,
  pool,
}: finishCurrentGameArgs): void {
  for (
    mySchedule[gameIndex].currentSet;
    mySchedule[gameIndex].currentSet < mySchedule[gameIndex].numSets + 1;
    mySchedule[gameIndex].currentSet++
  ) {
    if (mySchedule[gameIndex].currentSet === 1) {
      while (
        mySchedule[gameIndex].gameOneScoreCap >
          mySchedule[gameIndex].gameOneTeamOneScore &&
        mySchedule[gameIndex].gameOneScoreCap >
          mySchedule[gameIndex].gameOneTeamTwoScore
      ) {
        if (Math.random() > 0.5) {
          mySchedule[gameIndex].gameOneTeamOneScore++;
        } else {
          mySchedule[gameIndex].gameOneTeamTwoScore++;
        }
      }
      // if (mySchedule[gameIndex].gameOneTeamOneScore > mySchedule[gameIndex].gameOneTeamTwoScore) {
      //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamOne)].poolWins++;
      //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamTwo)].poolLosses++;
      // } else {
      //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamOne)].poolLosses++;
      //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamTwo)].poolWins++;
      // }
    }
    if (mySchedule[gameIndex].currentSet === 2 ) {
      while (
        mySchedule[gameIndex].gameTwoScoreCap >
          mySchedule[gameIndex].gameTwoTeamOneScore &&
        mySchedule[gameIndex].gameTwoScoreCap >
          mySchedule[gameIndex].gameTwoTeamTwoScore
      ) {
        if (Math.random() > 0.5) {
          mySchedule[gameIndex].gameTwoTeamOneScore++;
        } else {
          mySchedule[gameIndex].gameTwoTeamTwoScore++;
        }
      }
      // if (mySchedule[gameIndex].gameTwoTeamOneScore > mySchedule[gameIndex].gameTwoTeamTwoScore) {
      //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamOne)].poolWins++;
      //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamTwo)].poolLosses++;
      // }else {
      //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamOne)].poolLosses++;
      //   pool[indexOfTeamInPool(pool, mySchedule[gameIndex].teamTwo)].poolWins++;
      // }
    }
    if (mySchedule[gameIndex].currentSet === 3) {
    }
  }
  mySchedule[gameIndex].gameFinished = true;
  // setMyPool([...pool])
  setMySchedule([...mySchedule]);
}

function indexOfTeamInPool(
  pool: FakeEntriesTeamArr,
  team: FakeEntriesTeam
): number {
  for (let i = 0; i < pool.length; i++) {
    if (pool[i].teamId === team.teamId) {
      return i;
    }
  }
  return -1;
}
