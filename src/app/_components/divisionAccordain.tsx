"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";
import { type schema } from "@/server/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export type DivisionWithEntries = InferResultType<
  "division",
  { entries: { with: { team: { with: { players: true } } } } }
>;

export default function DivisionAccordian({
  divisions,
}: {
  divisions: DivisionWithEntries[];
  name: string;
}) {
  return (
    <div>
      <Accordion type="single" collapsible className="w-4/5">
        {divisions.map((division) => (
          <AccordionItem value={division.name} key={division.name}>
            <AccordionTrigger>
                <p>{division.type + " - " + division.name}</p>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                  <h5 className="pb-2 text-lg font-semibold">Entries</h5>
                  {division.entries.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell>Team</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {division.entries.map((entry) => (
                          <>
                            {entry.team.players.length > 0 && (
                              <TableRow key={entry.team.id}>
                                <TableCell>
                                  {entry.team.players[0]?.userId +
                                    " " +
                                    entry.team.players[0]?.userId}
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div>No entries</div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
