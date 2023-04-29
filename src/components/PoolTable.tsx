import { FakeEntriesTeamArr } from "../utils/types/team";
import { Dispatch, SetStateAction, useState } from "react";

type PoolTableProps = {
    pool: FakeEntriesTeamArr;
    poolNumber: number;
    pools: FakeEntriesTeamArr[];
    setPools: Dispatch<SetStateAction<FakeEntriesTeamArr[]>>;
  };
  
  export const PoolTable = ({ pool, poolNumber, pools, setPools }: PoolTableProps) => {
    const swapArray = pools.map((pool) => { return false });
    const [isSwapping, setIsSwapping] = useState(swapArray);
  
    const updateSwap = (index: number) => {
      const newArr = [...isSwapping];
      newArr[index] = !newArr[index];
      setIsSwapping(newArr);
    }
  
    const updatePoolLogic = (poolDelIndex: number, poolInsIndex: number ,teamIndex: number, pools:FakeEntriesTeamArr[]) => {
      const newArr = [...pools];
      const poolToDelFrom = newArr[poolDelIndex];
      const temp = poolToDelFrom.splice(teamIndex, 1)[0];
      newArr[poolInsIndex].push(temp);
      newArr[poolInsIndex].sort(function (a, b) {
        return b.teamRating - a.teamRating;
      });
      setPools(newArr);
    }
  
    return (
      <>
        <table className="border-seperate border-none">
          <thead className="justify-center bg-[#0ACF83] py-2 text-2xl font-bold text-white">
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
            <td colSpan={3} className="p-1 text-center font-semibold">
              Team
            </td>
          </tr>
          {pool.map((team, i) => {
            return (
              <tr key={i}>
                <td colSpan={1} className="border-r-2 p-1">{i + 1}</td>
                <td colSpan={2} className='px-4'>
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
                  <span className="pl-2">{ team.teamRating }</span>
                </td>
                <td colSpan={1} className="pl-4 pr-1">
                  {isSwapping[i] ? (
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
                  )}
                </td>
              </tr>
            );
          })}
        </table>
      </>
    );
  };
  