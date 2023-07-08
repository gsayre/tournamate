import { Game, Pool, Team, User } from "@prisma/client";
import { FakeEntriesTeamArr } from "../utils/types/team";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { trpc } from "utils/trpc";

type PoolTableProps = {
  pool: any;
  poolNumber: number;
  pools: any;
};

export const PoolTable = ({ pool, poolNumber, pools }: PoolTableProps) => {
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
            <th colSpan={4} className="rounded-t-lg">
              Pool {poolNumber} {"   "}
              {poolRating}
            </th>
          </tr>
        </thead>
        <tr>
          <td colSpan={1} className="p-1 text-center font-semibold">
            Place
          </td>
          <td colSpan={3} className="p-1 text-center font-semibold">
            Team
          </td>
        </tr>
        {pool.teams.map((team, i) => {
          return (
            <tr key={i}>
              <td colSpan={1} className="border-r-2 p-1">
                {i + 1}
              </td>
              <td colSpan={2} className="px-4">
                {team?.players.map((player, j, arr) => {
                  return (
                    <>
                      {j == arr.length - 1 ? (
                        <span key={player.userId}>
                          {player.user.fullName.includes("Boy")
                            ? player.user.fullName.substring(0, 7)
                            : player.user.fullName.substring(0, 8)}
                        </span>
                      ) : (
                        <span key={player.userId}>
                          {player.user.fullName.includes("Boy")
                            ? player.user.fullName.substring(0, 7)
                            : player.user.fullName.substring(0, 8)}{" "}
                          {" - "}
                        </span>
                      )}
                    </>
                  );
                })}
                <span className="pl-2">{team.teamRating}</span>
              </td>
              <td colSpan={1} className="pl-4 pr-1">
                {/* {isSwapping[i] ? (
                    <>
                      {pools.map((pool, j) => {
                        return (
                          <>
                            {j !== poolNumber - 1 && (
                              <button
                                onClick={() => {
                                  updateSwap(i);
                                  updatePoolLogic(poolNumber - 1, j, i, pools);
                                }}
                                key={j}
                                className="p-1"
                              >
                                Pool {j + 1}
                              </button>
                            )}
                          </>
                        );
                      })
                      }
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          updateSwap(i);
                        }}
                      >
                        Swap
                      </button>
                    </>
                  )} */}
              </td>
            </tr>
          );
        })}
      </table>
    </>
  );
};
