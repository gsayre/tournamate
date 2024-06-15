import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";

export default function UpcomingTournaments() {
  return (
    <div className="flex flex-col p-8 pt-6">
      <h1 className="pb-4 text-2xl">Upcoming Tournaments</h1>

      <Table>
        <TableCaption>List of the upcoming tournaments</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Signups</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Test</TableCell>
            <TableCell>09/18/24</TableCell>
            <TableCell>Raleigh, North Carolina</TableCell>
            <TableCell>31/64</TableCell>
            <TableCell className="text-right">
              <Link href={`/tournaments/${1}`}>Go To</Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
