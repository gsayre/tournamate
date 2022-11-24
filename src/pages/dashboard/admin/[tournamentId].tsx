import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";

export default function AdminTuornamentView() {
  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <Sidebar />
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className=" h-full w-full  p-4">
            <h1>Admin Tournament View</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
