import { Game, Pool, Team, User } from "@prisma/client";
import { FakeEntriesTeamArr } from "../utils/types/team";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { trpc } from "utils/trpc";

type PoolTableProps = {
  pool: any;
  poolNumber: number;
  pools: any;
  numBreaking: number;
  hasWildcards: boolean;
};

export const PoolTable = ({ pool, poolNumber, pools, numBreaking, hasWildcards }: PoolTableProps) => {
  // const updateSwap = (index: number) => {
  //   const newArr = [...isSwapping];
  //   newArr[index] = !newArr[index];
  //   setIsSwapping(newArr);
  // }

  // const updatePoolLogic = (poolDelIndex: number, poolInsIndex: number ,teamIndex: number, pools:FakeEntriesTeamArr[]) => {
  //   const newArr = [...pools];
  //   const poolToDelFrom = newArr[poolDelIndex];
  //   const temp = poolToDelFrom.splice(teamIndex, 1)[0];
  //   newArr[poolInsIndex].push(temp);
  //   newArr[poolInsIndex].sort(function (a, b) {
  //     return b.teamRating - a.teamRating;
  //   });
  // }
  const compareFunction = (a: any, b: any) => {
    return b.teamRating - a.teamRating;
  };
  const [poolRating, setPoolRating] = useState(0);
  const [sortedPools, setSortedPools] = useState([]);
  useEffect(() => {
    let accumualtedRating = 0;
    for (let i = 0; i < pool.teams.length; i++) {
      accumualtedRating += pool.teams[i].teamRating;
    }
    accumualtedRating = accumualtedRating / pool.teams.length;
    setPoolRating(accumualtedRating);
    // sortedPools = pool.teams.sort((a,b) => a.teamRating > b.teamRating ? -1 : a.teamRating > b.teamRating ? 1 : 0 )
    setSortedPools(pool.teams.sort(compareFunction));
  }, []);

  return (
    <>
      <table className="border-seperate border-none">
        <thead className="justify-center bg-[#0ACF83] py-2 text-2xl font-bold text-white">
          <tr>
            <th colSpan={6} className="rounded-t-lg">
              Pool {poolNumber} {"   "}
              {poolRating}
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
          <td colSpan={1} className="p-1 text-center font-semibold">
            Point Differential
          </td>
        </tr>
        {pool.teams.sort(compareFunctionPool).map((team, i) => {
          return (
            <tr
              key={i}
              className={`${
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
              <td colSpan={2} className="border-r-2 px-4">
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
              <td colSpan={1} className="border-r-2 px-4 py-1">
                {team.poolWins + " - " + team.poolLosses}
              </td>
              <td colSpan={1} className="p-1">
                {team.poolPointDifferential}
              </td>
            </tr>
          );
        })}
      </table>
    </>
  );
};

function compareFunctionPool(a: any, b: any) {
  return b.poolWins - a.poolWins || b.poolPointDifferential - a.poolPointDifferential;
}