import { amIInTeam } from "utils/lib/am-i-in-utils";
import { getMyPoolReturnType } from "./Admin/DivisionAccordian";
import { Pool, Team, User, UsersInTeam } from "@prisma/client";

type MyPoolT = Pool & {
  teams: Pick<Team, "poolWins" | "poolLosses" | "teamRating"> &
    {
      players: UsersInTeam &
        {
          user: User;
        }[];
      seed: number;
    }[];
};

type OtherPoolTableProps = {
  pool: MyPoolT;
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
          pool[0]?.teams.sort(compareFunction).map((team, i) => {
            console.log(team);
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
                          <span key={player.userId}>
                            {player.user.fullName}
                          </span>
                        ) : (
                          <span key={player.userId}>
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

function compareFunction(a: any, b: any) {
  return b.poolWins - a.poolWins;
}
