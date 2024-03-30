import { FakeGame } from "../types/game";

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