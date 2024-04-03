import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { trpc } from "utils/trpc";

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
  const { user } = useUser();

  const utils = trpc.useUtils();
  const addPointMock = trpc.tournament.addPointToGameMock.useMutation();
  const finishGameMock = trpc.tournament.finishGameMock.useMutation();

  return (
    <div>
      <div>
        {poolSchedule &&
          poolSchedule[0].games.map((game, i: number, arr) => {
            const teamOneId = game.teams[0].teamId;
            const teamTwoId = game.teams[1].teamId;
            const player1: string | undefined =
              game.teams[0].Team.players[0].user.fullName;
            const player2: string | undefined =
              game.teams[0].Team.players[1].user.fullName;
            const player3: string | undefined =
              game.teams[1].Team.players[0].user.fullName;
            const player4: string | undefined =
              game.teams[1].Team.players[1]?.user.fullName;
            const ref1: string | undefined =
              game.referees.players[0]?.user.fullName;
            const ref2: string | undefined =
              game.referees.players[1]?.user.fullName;
            const isLastGame = isCurrentGame(arr) === arr.length - 1;
            console.log(isLastGame);

            return (
              <div
                className={`${game.gameFinished ? "bg-green-500/30" : ""} ${
                  isCurrentGame(arr) === i ? "bg-gray-500/30" : ""
                } flex flex-col px-2 pt-2`}
                key={i}
              >
                <div key={i} className={`flex w-full flex-row justify-between`}>
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center justify-center gap-4">
                      <div className="flex flex-col text-lg">
                        <div className="flex flex-row space-x-4">
                          <div
                            className={`flex flex-col ${
                              user?.fullName === player1 ||
                              user?.fullName === player2
                                ? "font-bold"
                                : ""
                            }`}
                          >
                            <span>{player1 ? <>{player1} -</> : <></>}</span>
                            <span>{player2 ? <>{player2}</> : <></>}</span>
                          </div>
                          <span>vs</span>
                          <div
                            className={`flex flex-col ${
                              user?.fullName === player3 ||
                              user?.fullName === player4
                                ? "font-bold"
                                : ""
                            }`}
                          >
                            <span>{player3 ? <>{player3}</> : <></>}</span>
                            <span>{player4 ? <>{player4}</> : <></>}</span>
                          </div>
                        </div>
                        <div
                          className={`${
                            user?.fullName === ref1 || user?.fullName === ref2
                              ? "font-bold"
                              : ""
                          }`}
                        >
                          <span>Reffing : </span>
                          <span>{ref1 ? <>{ref1} - </> : <></>}</span>
                          <span>{ref2 ? <>{ref2}</> : <></>}</span>
                        </div>
                      </div>

                      <span className="text-xl font-semibold">
                        {game.gameOneTeamOneScore} - {game.gameOneTeamTwoScore}
                      </span>
                      <span className="text-xl font-semibold">
                        {game.gameTwoScoreCap !== null
                          ? game.gameTwoTeamOneScore +
                            " - " +
                            game.gameTwoTeamTwoScore
                          : ""}
                      </span>
                      <span className="text-xl font-semibold">
                        {game.gameThreeScoreCap !== null
                          ? game.gameThreeTeamOneScore +
                            " - " +
                            game.gameThreeTeamTwoScore
                          : ""}
                      </span>
                    </div>
                  </div>
                  {(user?.fullName === ref1 || user?.fullName === ref2) &&
                  isCurrentGame(arr) === i ? (
                    <div className="flex flex-row gap-4">
                      <Link
                        className="flex items-center rounded-xl bg-green-500 p-2 text-lg"
                        href={`./${tournamentId}/${game.gameId}`}
                      >
                        Ref Game
                      </Link>
                      <button
                        className="flex items-center rounded-xl bg-orange-500 p-2 text-lg"
                        onClick={() => {
                          finishGameMock.mutate(
                            {
                              gameId: game.gameId,
                              numSets: game.numSets,
                              gameOneTeamOneScore: game.gameOneTeamOneScore,
                              gameOneTeamTwoScore: game.gameOneTeamTwoScore,
                              scoreCapGame1: game.gameOneScoreCap,
                              gameTwoTeamOneScore: game.gameTwoTeamOneScore,
                              gameTwoTeamTwoScore: game.gameTwoTeamTwoScore,
                              scoreCapGame2: game.gameTwoScoreCap,
                              gameThreeTeamOneScore: game.gameThreeTeamOneScore,
                              gameThreeTeamTwoScore: game.gameThreeTeamTwoScore,
                              scoreCapGame3: game.gameThreeScoreCap,
                              teamOneId: teamOneId,
                              teamOneRating: game.teams[0].teamRating,
                              teamTwoId: teamTwoId,
                              teamTwoRating: game.teams[1].teamRating,
                              isLastGame: isLastGame,
                              poolId: game.poolId,
                            },
                            {
                              onSuccess: () => {
                                console.log(finishGameMock.data);
                                utils.tournament.getMyScheudule.invalidate();
                                utils.tournament.getMyPool.invalidate();
                              },
                            },
                          );
                        }}
                      >
                        Finish Game
                      </button>
                    </div>
                  ) : isCurrentGame(arr) === i ? (
                    <div className="flex flex-row gap-4">
                      <button
                        className="flex items-center rounded-xl bg-teal-500 p-2 text-lg"
                        onClick={() => {
                          addPointMock.mutate(
                            {
                              gameId: game.gameId,
                              gameNumber: game.currentSet,
                            },
                            {
                              onSuccess: () => {
                                utils.tournament.getMyScheudule.invalidate();
                              },
                            },
                          );
                        }}
                      >
                        Add Point
                      </button>
                      <button
                        className="flex items-center rounded-xl bg-orange-500 p-2 text-lg"
                        onClick={() => {
                          finishGameMock.mutate(
                            {
                              gameId: game.gameId,
                              numSets: game.numSets,
                              gameOneTeamOneScore: game.gameOneTeamOneScore,
                              gameOneTeamTwoScore: game.gameOneTeamTwoScore,
                              scoreCapGame1: game.gameOneScoreCap,
                              gameTwoTeamOneScore: game.gameTwoTeamOneScore,
                              gameTwoTeamTwoScore: game.gameTwoTeamTwoScore,
                              scoreCapGame2: game.gameTwoScoreCap,
                              gameThreeTeamOneScore: game.gameThreeTeamOneScore,
                              gameThreeTeamTwoScore: game.gameThreeTeamTwoScore,
                              scoreCapGame3: game.gameThreeScoreCap,
                              teamOneId: teamOneId,
                              teamTwoId: teamTwoId,
                              isLastGame: isLastGame,
                              poolId: game.poolId,
                              teamOneRating: game.teams[0].teamRating,
                              teamTwoRating: game.teams[1].teamRating,
                            },
                            {
                              onSuccess: () => {
                                console.log(finishGameMock.data);
                                utils.tournament.getMyScheudule.invalidate();
                                utils.tournament.getMyPool.invalidate();
                              },
                            },
                          );
                        }}
                      >
                        Finish Game
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="mt-2 flex h-0.5 w-full rounded-xl bg-gray-500"></div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export function isCurrentGame(gameArray: any): number | undefined {
  for (let i = 0; i < gameArray.length; i++) {
    if (!gameArray[i].gameFinished) {
      return i;
    }
  }
}
