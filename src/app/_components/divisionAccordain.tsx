"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function DivisionAccordian() {
  return (
    <div>
      <Accordion type="single" collapsible className="w-4/5">
        {/* {mockedDivisions.map((division) => (
            <AccordionItem key={division.name} value={division.name}>
              <AccordionTrigger>{division.name}</AccordionTrigger>
              <AccordionContent>
                <h4 className="pb-2 text-xl font-semibold tracking-tight">
                  Teams
                </h4>
                <ul>
                  {division.teams.map((team) => (
                    <li key={team.id} className="flex flex-row ">
                      <p className="mr-2">{team.name + " - "}</p>
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
          ))} */}
      </Accordion>
    </div>
  );
}
