import { FakeGame } from "../types/game";
import { FakeEntriesTeam, FakeEntriesTeamArr } from "../types/team";
import type { Dispatch, SetStateAction } from "react";

export function createGameSchedule(pool: FakeEntriesTeamArr): FakeGame[] {
  let gamesToInsert: gameCreationProps[] = [];
  let gamesToReturn: FakeGame[] = [];
  console.log(pool?.length);
  switch (pool?.length) {
    case 3: {
      const [firstTeam, secondTeam, thirdTeam] = [pool[0], pool[1], pool[2]];
      gamesToInsert = [
        {
          teamOne: firstTeam,
          teamTwo: thirdTeam,
          refs: secondTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: secondTeam,
          teamTwo: thirdTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: secondTeam,
          refs: thirdTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: thirdTeam,
          refs: secondTeam,
          gameOneScoreCap: 21,
          isScoreCapped: false,
          numSets: 1,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: secondTeam,
          teamTwo: thirdTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          isScoreCapped: false,
          numSets: 1,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: secondTeam,
          refs: thirdTeam,
          gameOneScoreCap: 21,
          isScoreCapped: false,
          numSets: 1,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
      ];
      for (let i = 0; i < gamesToInsert.length; i++) {
        gamesToReturn.push(createGame(gamesToInsert[i]));
      }
      return gamesToReturn;
    }
    case 4: {
      const [firstTeam, secondTeam, thirdTeam, fourthTeam] = [
        pool[0],
        pool[1],
        pool[2],
        pool[3],
      ];
      gamesToInsert = [
        {
          teamOne: firstTeam,
          teamTwo: fourthTeam,
          refs: secondTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: secondTeam,
          teamTwo: thirdTeam,
          refs: fourthTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: secondTeam,
          teamTwo: fourthTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: thirdTeam,
          refs: secondTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: thirdTeam,
          teamTwo: fourthTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: secondTeam,
          refs: thirdTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
      ];
      for (let i = 0; i < gamesToInsert.length; i++) {
        gamesToReturn.push(createGame(gamesToInsert[i]));
      }
      return gamesToReturn;
    }
    case 5: {
      const [firstTeam, secondTeam, thirdTeam, fourthTeam, fifthTeam] = [
        pool[0],
        pool[1],
        pool[2],
        pool[3],
        pool[4],
      ];
      gamesToInsert = [
        {
          teamOne: firstTeam,
          teamTwo: fifthTeam,
          refs: secondTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: secondTeam,
          teamTwo: fourthTeam,
          refs: fifthTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: secondTeam,
          teamTwo: fifthTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: thirdTeam,
          refs: secondTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: thirdTeam,
          teamTwo: fifthTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: fourthTeam,
          refs: thirdTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: thirdTeam,
          teamTwo: fourthTeam,
          refs: firstTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
        {
          teamOne: firstTeam,
          teamTwo: secondTeam,
          refs: fourthTeam,
          gameOneScoreCap: 21,
          gameTwoScoreCap: 21,
          isScoreCapped: false,
          numSets: 2,
          currentSet: 1,
          poolId: "123",
          gameFinished: false,
        },
      ];
      gamesToInsert.map((game) => {
        return gamesToReturn.push(createGame(game));
      });
      // console.log("Games Returned", gamesToReturn);
      return gamesToReturn;
    }
    case 6: {
    }
    case 7: {
    }
    case 8: {
    }
  }
  return [];
}

export type gameCreationProps = {
  gameOneScoreCap: number;
  gameTwoScoreCap?: number;
  gameThreeScoreCap?: number;
  isScoreCapped: boolean;
  numSets: number;
  currentSet: number;
  teamOne: FakeEntriesTeam;
  teamTwo: FakeEntriesTeam;
  refs: FakeEntriesTeam;
  poolId: string;
  isBracket?: boolean;
  bracketId?: boolean;
  gameFinished: boolean;
};

export function createGame({
  numSets,
  isBracket,
  gameOneScoreCap,
  gameTwoScoreCap,
  gameThreeScoreCap,
  isScoreCapped,
  currentSet,
  teamOne,
  teamTwo,
  refs,
  poolId,
  gameFinished,
  bracketId,
}: gameCreationProps): FakeGame {
  if (isBracket) {
  }
  switch (numSets) {
    case 1: {
      return {
        poolId,
        gameOneScoreCap,
        currentSet,
        numSets,
        teamOne,
        teamTwo,
        refs,
        gameOneTeamOneScore: 0,
        gameOneTeamTwoScore: 0,
        isScoreCapped,
        gameFinished,
      };
    }
    case 2: {
      return {
        poolId,
        gameOneScoreCap,
        gameTwoScoreCap,
        currentSet,
        numSets,
        teamOne,
        teamTwo,
        refs,
        gameOneTeamOneScore: 0,
        gameOneTeamTwoScore: 0,
        gameTwoTeamOneScore: 0,
        gameTwoTeamTwoScore: 0,
        isScoreCapped,
        gameFinished,
      };
    }
    case 3: {
      return {
        poolId,
        gameOneScoreCap,
        gameTwoScoreCap,
        gameThreeScoreCap,
        currentSet,
        numSets,
        teamOne,
        teamTwo,
        refs,
        gameOneTeamOneScore: 0,
        gameOneTeamTwoScore: 0,
        gameTwoTeamOneScore: 0,
        gameTwoTeamTwoScore: 0,
        gameThreeTeamOneScore: 0,
        gameThreeTeamTwoScore: 0,
        isScoreCapped,
        gameFinished,
      };
    }
  }
  return {} as FakeGame;
}

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
