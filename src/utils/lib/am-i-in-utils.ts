import { FakeEntriesTeam, FakeEntriesTeamArr } from "../types/team";
import { gameCreationProps } from "./schedule-utils";

export function amIReffing(
  game: gameCreationProps,
  currentUserName: string
): boolean {
  for (const player of game.refs.players) {
    if (currentUserName === player.user.fullName) {
      return true;
    }
  }
  return false;
}

export function amIInTeam(
  team: FakeEntriesTeam,
  currentUserName: string
): boolean {
  for (const player of team.players) {
    if (currentUserName === player.user.fullName) {
      return true;
    }
  }
  return false;
}

export function amIInThePool(
  element: FakeEntriesTeamArr,
  currentUserName: string
) {
  for (let i = 0; i < element.length; i++) {
    for (const player of element[i].players) {
      if (currentUserName === player.user.fullName) {
        // console.log(currentUserName, player.user.fullName);
        return true;
      }
    }
  }
  return false;
}
