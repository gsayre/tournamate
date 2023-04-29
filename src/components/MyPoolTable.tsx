import { FakeEntriesTeam, FakeEntriesTeamArr } from "../utils/types/team";
import { Dispatch, SetStateAction, useState } from "react";
import { amIInTeam } from "utils/lib/am-i-in-utils";

type OtherPoolTableProps = {
  pool: FakeEntriesTeamArr;
  poolNumber: number;
  pools: FakeEntriesTeamArr[];
  setPools: Dispatch<SetStateAction<FakeEntriesTeamArr[]>>;
  isMyPool: boolean;
  currentUserName: string;
};

export const MyPoolTable = ({
  pool,
  poolNumber,
  pools,
  setPools,
  isMyPool,
  currentUserName,
}: OtherPoolTableProps) => {
  const swapArray = pools.map((pool) => {
    return false;
  });
  const [isSwapping, setIsSwapping] = useState(swapArray);

  const updateSwap = (index: number) => {
    const newArr = [...isSwapping];
    newArr[index] = !newArr[index];
    setIsSwapping(newArr);
  };

  const updatePoolLogic = (
    poolDelIndex: number,
    poolInsIndex: number,
    teamIndex: number,
    pools: FakeEntriesTeamArr[]
  ) => {
    const newArr = [...pools];
    const poolToDelFrom = newArr[poolDelIndex];
    const temp = poolToDelFrom.splice(teamIndex, 1)[0];
    newArr[poolInsIndex].push(temp);
    newArr[poolInsIndex].sort(function (a, b) {
      return b.teamRating - a.teamRating;
    });
    setPools(newArr);
  };

  return (
    <>
      <table className="border-seperate border-none">
        <thead
          className={`justify-center ${
            isMyPool ? "bg-green-500" : "bg-[#575757]"
          } py-2 text-2xl font-bold text-white`}
        >
          <tr>
            <th colSpan={4} className="rounded-t-lg">
              Pool {poolNumber}
            </th>
          </tr>
        </thead>
        <tr>
          <td colSpan={1} className="p-1 text-center font-semibold">
            Place
          </td>
          <td colSpan={2} className="p-1 text-center font-semibold">
            Team
          </td>
          <td colSpan={1} className="p-1 text-center font-semibold">
            Record
          </td>
        </tr>
        {pool?.map((team, i) => {
          return (
            <tr
              key={i}
              className={`${
                amIInTeam(team, currentUserName) ? "font-bold" : ""
              }`}
            >
              <td colSpan={1} className="border-r-2 p-1">
                {i + 1}
              </td>
              <td colSpan={2} className="px-4">
                {team.players.map((player, j, arr) => {
                  return (
                    <>
                      {j == arr.length - 1 ? (
                        <span key={player.userId}>{player.user.fullName}</span>
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
