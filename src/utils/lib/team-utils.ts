import { FakeEntriesTeamArr, FakeEntriesTeam } from "../types/team";

export const createPoolsFromEntries = (
    teams: FakeEntriesTeamArr
  ): Array<FakeEntriesTeamArr> => {
    const returnArr: Array<FakeEntriesTeamArr> = [];
    let zigzag = 0;
    let zig = false;
    let zag = false;
    let pausezigzag = false;
    teams.sort(function (a, b) {
      return b.teamRating - a.teamRating;
    });
    if (teams.length > 5) {
      const numPools = Math.ceil(teams.length / 4);
      for (let i = 0; i < numPools; i++) {
        returnArr.push([]);
      }
      for (const team of teams) {
        if (zigzag == 0 && zag == false && zig == false) {
          zig = true;
          zag = false;
          returnArr[zigzag].push(team);
          zigzag++;
        } else if (zigzag == 0) {
          zig = true;
          zag = false;
          returnArr[zigzag].push(team);
          if (pausezigzag) {
            pausezigzag = false;
            zigzag++;
          } else {
            pausezigzag = true;
          }
        } else if (zigzag == numPools - 1) {
          zig = false;
          zag = true;
          returnArr[zigzag].push(team);
          if (pausezigzag) {
            pausezigzag = false;
            zigzag--;
          } else {
            pausezigzag = true;
          }
        } else if (zig) {
          returnArr[zigzag].push(team);
          zigzag++;
        } else if (zag) {
          returnArr[zigzag].push(team);
          zigzag--;
        }
      }
      return returnArr;
    } else {
      returnArr.push(teams);
      return returnArr;
    }
    return returnArr;
  };
  
export const createFakeEntriesAnyTeams = (numTeams: number): FakeEntriesTeamArr => {
  const fakeEntries: FakeEntriesTeamArr = [];
  for (let i = 0; i < numTeams; i++) {
    fakeEntries.push(
      createFakeTeam({
        teamId: i + 1,
        divisionId: 1,
        teamRating: Math.floor(Math.random() * 1500),
        tournamentId: 1,
        poolId: "1",
        userOneId: Math.floor(Math.random() * 1000).toString(),
        userTwoId: Math.floor(Math.random() * 1000).toString(),
        userOneName: `Boy ${i}`,
        userTwoName:  `Girl ${i}`,
      })
    );
  }
  return fakeEntries;
};

type FakeTeamCriteria = {
  teamId: number;
  divisionId: number;
  teamRating: number;
  tournamentId: number;
  poolId: string;
  userOneId: string;
  userTwoId: string;
  userOneName: string;
  userTwoName: string;
};

export function createFakeTeam({
  teamId,
  teamRating,
  divisionId,
  tournamentId,
  poolId,
  userOneId,
  userTwoId,
  userOneName,
  userTwoName,
}: FakeTeamCriteria): FakeEntriesTeam {
  const fakeTeam = {
    teamId,
    divisionId,
    tournamentId,
    teamRating,
    poolId,
    poolWins: 0,
    poolLosses: 0,
    players: [
      {
        userId: userOneId,
        teamId,
        user: {
          id: userOneId,
          fullName: userOneName,
          isAdmin: false,
          isTournamentDirector: false,
          playerRating: Math.floor(Math.random() * 1500),
        },
      },
      {
        userId: userTwoId,
        teamId,
        user: {
          id: userTwoId,
          fullName: userTwoName,
          isAdmin: false,
          isTournamentDirector: false,
          playerRating: Math.floor(Math.random() * 1500),
        },
      },
    ],
  };
  return fakeTeam;
}
  
  