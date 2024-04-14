import type { InferredSingleTeamType } from "server/trpc/exportedTypes";
import { FakeEntriesTeamArr } from "../types/team";
import { Game, Team, User, UsersInTeam } from "@prisma/client";

type gameCreationProps = Game & {
  refeeres: Team & {
    players: UsersInTeam & {
      user: User
    }[]
  }
}



export function amIReffing(
  game: gameCreationProps,
  currentUserName: string,
): boolean {
  for (const player of game.refeeres.players) {
    if (currentUserName === player.user.fullName) {
      return true;
    }
  }
  return false;
}

export function amIInTeam(
  team: InferredSingleTeamType,
  currentUserName: string,
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
  currentUserName: string,
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
