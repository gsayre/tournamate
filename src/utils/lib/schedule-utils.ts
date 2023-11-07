import { FakeGame } from "../types/game";
import { FakeEntriesTeam, FakeEntriesTeamArr } from "../types/team";
import type { Dispatch, SetStateAction } from "react";

// export function isCurrentGame(schedule: FakeGame[]): number {
//   for (let i = 0; i < schedule.length; i++) {
//     if (!schedule[i].gameFinished) {
//       return i;
//     }
//   }
//   return -1;
// }

export function isCurrentGameFinished(game: FakeGame): boolean {
  if (game.currentSet > game.numSets) {
    return true;
  }
  return false;
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
