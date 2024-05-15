"use client";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useParams } from "next/navigation";

export default function Tournament() {
  const { tournamentid } = useParams<{ tournamentid: string }>();

  const mockedDivisions = [
    {
      name: "Open",
      teams: [
        {
          id: "team4",
          name: "Team 4",
          players: [
            {
              id: "player4",
              name: "Player 4",
            },
          ],
        },
      ],
    },
    {
      name: "AA",
      teams: [
        {
          id: "team1",
          name: "Team 1",
          players: [
            {
              id: "player1",
              name: "Player 1",
            },
          ],
        },
      ],
    },
    {
      name: "A",
      teams: [
        {
          id: "team2",
          name: "Team 2",
          players: [
            {
              id: "player2",
              name: "Player 2",
            },
          ],
        },
      ],
    },
    {
      name: "BB",
      teams: [
        {
          id: "team3",
          name: "Team 3",
          players: [
            {
              id: "player3",
              name: "Player 3",
            },
          ],
        },
      ],
    },
  ];

  return (
    <main className="flex flex-col p-8 pt-6">
      <h2 className="pb-4 text-3xl font-bold tracking-tight">
        Tournament {tournamentid}
      </h2>
      <div className="px-8">
        <h3 className="pb-2 text-2xl font-semibold tracking-tight">
          Divisions
        </h3>
        <Accordion type="single" collapsible className="w-4/5">
          {mockedDivisions.map((division) => (
            <AccordionItem key={division.name} value={division.name}>
              <AccordionTrigger>{division.name}</AccordionTrigger>
              <AccordionContent>
                <h4 className="pb-2 text-xl font-semibold tracking-tight">
                  Teams
                </h4>
                <ul>
                  {division.teams.map((team) => (
                    <li key={team.id} className="flex flex-row ">
                      <p className="mr-2">
                        {team.name + " - "}
                      </p>
                      <p>
                        {team.players.map((player) => (
                          <div key={player.id}>{player.name}</div>
                        ))}
                      </p>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
