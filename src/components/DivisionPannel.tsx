import { Division, Team, User, UsersInTeam } from "@prisma/client";
import { trpc } from "utils/trpc";
import { NewDivisionForm } from "./DivisionForm";
import { DivisionAccordian } from "./Admin/DivisionAccordian";

export type DivisionPannelProps = {
    format: string;
    id: number;
  };

  type DPannelArr = Division & {
    entries: (Team & {
        players: (UsersInTeam & {
            user: User;
        })[];
    })[]
}
  
  export function DivisionPannel(props: DivisionPannelProps) {
    const divisions: DPannelArr[] = [];
    if (props.format.includes("SAME_SEX")) {
      const divMen = trpc.tournament.getDivisionsByType.useQuery({
        tournamentId: props.id,
        type: "MENS",
      });
      const divWom = trpc.tournament.getDivisionsByType.useQuery({
        tournamentId: props.id,
        type: "WOMENS",
      });
      if (divMen.data && divWom.data) {
        for (let i = 0; i < divMen.data.length; i++) {
          divisions.push(divMen.data[i]);
        }
        for (let i = 0; i < divWom.data.length; i++) {
          divisions.push(divWom.data[i]);
        }
      }
      console.log(divisions)
    } else {
      const divCoed = trpc.tournament.getDivisionsByType.useQuery({
        tournamentId: props.id,
        type: "COED",
      });
      if (divCoed.data) {
        for (let i = 0; i < divCoed.data.length; i++) {
          divisions.push(divCoed.data[i]);
        }
      }
      console.log(divisions)
    }
  
    return (
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className="flex flex-col space-x-4 p-2">
            <p className="pb-4 text-2xl">Divisions</p>
            {props?.format?.includes("SAME_SEX") ? (
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col">
                  <p className="pb-2 text-lg">Mens</p>
                  <div className="flex flex-row space-x-4">
                    {divisions.filter(isCorrectDivision("MENS")).map((div) => (
                        <DivisionAccordian division={div} key={div.name} />
                    ))}
                    <NewDivisionForm type={props.format} sex={"MENS"} />
                  </div>
                </div>
                <div>
                  <p className="pb-2 text-lg">Womens</p>
                  <div className="flex flex-row space-x-4">
                    {divisions.filter(isCorrectDivision("WOMENS")).map((div) => (
                    <DivisionAccordian division={div} key={div.name} />
                    ))}
                    <NewDivisionForm type={props.format} sex={"WOMENS"} />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="pb-2 text-lg">Not Same Sex</p>
                <div className="flex flex-row space-x-4">
                  {divisions.filter(isCorrectDivision("COED")).map((div) => (
                    <DivisionAccordian division={div} key={div.name} />
                  ))}
                  <NewDivisionForm type={props.format} sex={"COED"} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  function isCorrectDivision(divisionToCompare: string) {
    return function (element: Division) {
      return element.type === divisionToCompare;
    };
  }