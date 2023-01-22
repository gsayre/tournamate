import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { requireAuth } from "../../utils/requireAuth";

export async function getServerSideProps(context: any) {
  return requireAuth(context, ({ session }: any) => {
    return {
      props: { session },
    };
  });
}

export default function Pricing() {
  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <Sidebar />
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className=" h-full w-full p-4">
            <div className="h-full w-full rounded-md bg-white p-4">
              <h1 className="text-5xl font-bold">FREE FOR NOW</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
