import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PastTournaments() {
  return (
    <div className="flex flex-col p-8 pt-6">
      <h1 className="pb-4 text-2xl">Past Tournaments</h1>

      <Table>
        <TableCaption>List of the past tournaments</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Signups</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Chaos</TableCell>
            <TableCell>05/20/23</TableCell>
            <TableCell>Charlotte, North Carolina</TableCell>
            <TableCell className="text-right">64/64</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}