"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { type DivisionType } from "@/server/db/schema/tournament";
import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm';
import {schema}from '@/server/db';

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  'one' | 'many',
  boolean,
  TSchema,
  TSchema[TableName]
>['with'];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;



export default function DirectorDivisionPannel({
  divisions,
}: {
  divisions: DivisionType[];
}) {
  return (
    <div>
      <Accordion type="single" collapsible>
        {divisions.map((division) => (
          <AccordionItem value={division.name} key={division.name}>
            <AccordionTrigger>
              {division.type + " - " + division.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                  <h5>Entries</h5>
                  <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell>Team</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {division.entries.map((entry) => (
                        <TableRow>
                            <TableCell>{entry.}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                    
                    </Table>
                </div>
                </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
