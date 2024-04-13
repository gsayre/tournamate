import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "server/trpc/router/_app";
import { amIInTeam } from "utils/lib/am-i-in-utils";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type InferredGetMyPoolType = RouterOutputs["tournament"]["getMyPool"];
type InferredSingleTeamType = InferredGetMyPoolType["myPool"]["teams"][0];

type OtherPoolTableProps = {
  pool: InferredGetMyPoolType;
  poolNumber: number;
  isMyPool: boolean;
  currentUserName: string;
  numBreaking: number;
  hasWildcards: boolean;
};

export const MyPoolTable = ({
  pool,
  poolNumber,
  isMyPool,
  currentUserName,
  numBreaking,
  hasWildcards,
}: OtherPoolTableProps) => {
  const myPool = pool?.myPool;
  return (
    <>
      <table className="border-seperate border-none">
        <thead
          className={`justify-center ${
            isMyPool ? "bg-green-500" : "bg-[#575757]"
          } py-2 text-2xl font-bold text-white`}
        >
          <tr>
            <th colSpan={5} className="rounded-t-lg">
              Pool {poolNumber}
            </th>
          </tr>
        </thead>
        <tr>
          <td colSpan={1} className="p-1 text-center font-semibold">
            Place
          </td>
          <td colSpan={1} className="p-1 text-center font-semibold">
            Seed
          </td>
          <td colSpan={2} className="p-1 text-center font-semibold">
            Team
          </td>
          <td colSpan={1} className="p-1 text-center font-semibold">
            Record
          </td>
        </tr>
        {pool &&
          myPool?.teams.sort(compareFunction).map((team, i) => {
            return (
              <tr
                key={i}
                className={`${
                  amIInTeam(team, currentUserName) ? "font-bold" : ""
                } ${
                  i + 1 === numBreaking
                    ? "border-b-2 border-solid border-amber-500"
                    : ""
                } ${
                  hasWildcards && i + 1 === numBreaking + 1
                    ? "border-b-2 border-dashed border-red-500"
                    : ""
                }`}
              >
                <td colSpan={1} className="border-r-2 p-1">
                  {i + 1}
                </td>
                <td colSpan={1} className="border-r-2 p-1">
                  {team.seed}
                </td>
                <td colSpan={2} className="px-4">
                  {team.players.map((player, j, arr) => {
                    return (
                      <>
                        {j == arr.length - 1 ? (
                          <span key={player.user.id}>
                            {player.user.fullName}
                          </span>
                        ) : (
                          <span key={player.user.id}>
                            {player.user.fullName} {" - "}
                          </span>
                        )}
                      </>
                    );
                  })}
                </td>
                <td colSpan={1} className="border-l-2 px-4 py-1">
                  {team.poolWins + " - " + team.poolLosses}
                </td>
              </tr>
            );
          })}
      </table>
    </>
  );
};

function compareFunction(a: InferredSingleTeamType, b: InferredSingleTeamType) {
  return b.poolWins - a.poolWins;
}
