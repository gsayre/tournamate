import { Team, UsersInTeam, User} from "@prisma/client";

export type FakeEntriesTeamArr = FakeEntriesTeam[];

  export type FakeEntriesTeam = Team & {
    players: (UsersInTeam & {
      user: User;
    })[],
    poolWins: number,
    poolLosses: number,
  };