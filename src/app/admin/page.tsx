import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/server";
import RequestApproval from "../_components/admin/tdApplicationApproval";
import RequestDenial from "../_components/admin/tdApplicationDenial";

export default async function Admin() {
  const tournamentDirectorRequests =
    await api.admin.getTournamentDirectorApplication();

  return (
    <main className="flex flex-col p-8 pt-6">
      <h2 className="pb-4 text-3xl font-bold tracking-tight">Admin</h2>
      <h3 className="pb-2 text-xl font-semibold tracking-tight">
        Tournament Director Applications
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournamentDirectorRequests.map((request) => (
            <TableRow key={request.userId}>
              <TableCell>{request.userId}</TableCell>
              <TableCell>{request.user.email}</TableCell>
              <TableCell className="text-right">
                <RequestApproval userId={request.userId} />
              </TableCell>
              <TableCell className="text-right">
                <RequestDenial userId={request.userId} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
