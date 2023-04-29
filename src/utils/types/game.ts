import { FakeEntriesTeam } from "./team";

export type FakeGame = {
    poolId: string,
    gameOneScoreCap: number,
    gameTwoScoreCap?: number,
    gameThreeScoreCap?: number,
    currentSet: number,
    numSets: number,
    teamOne: FakeEntriesTeam,
    teamTwo: FakeEntriesTeam,
    refs: FakeEntriesTeam,
    gameOneTeamOneScore: number,
    gameOneTeamTwoScore: number,
    gameTwoTeamOneScore?: number,
    gameTwoTeamTwoScore?: number,
    gameThreeTeamOneScore?: number,
    gameThreeTeamTwoScore?: number,
    isScoreCapped: boolean,
    gameFinished: boolean
}