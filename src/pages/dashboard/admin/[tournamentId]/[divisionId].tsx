import { useRouter } from "next/router";
import Sidebar from "../../../../components/Sidebar";
import TopBar from "../../../../components/TopBar";
import { requireAuth } from "../../../../utils/requireAuth";
import { trpc } from "../../../../utils/trpc";

export async function getServerSideProps(context: any) {
  return requireAuth(context);
}

export default function Admin() {
    let divisionData;
    const router = useRouter();
    const { tournamentId, divisionId } = router.query;
    if (divisionId){
    divisionData = trpc.tournament.getDivision.useQuery({
  divisionId: +divisionId,
}).data;
    }
  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <Sidebar />
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className=" h-full w-full  p-4">
            <p className="flex w-full justify-center pt-4 text-5xl">
              {divisionData?.name} division
            </p>
            <div className="flex h-full w-full flex-row space-x-8 overflow-x-scroll overflow-y-scroll">
              <div className="flex h-5/6 w-96 flex-col bg-white drop-shadow-xl">
                Entries
              </div>
              <div className="flex flex-col space-y-8 w-full">
                <div className="flex h-2/6 w-full bg-white drop-shadow-xl">Pools</div>
                <div className="flex h-2/6 bg-white drop-shadow-xl">Bracket</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}