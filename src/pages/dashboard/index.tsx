import type { NextPage } from "next";
import { PropsWithChildren } from "react";

const Dashboard: NextPage = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-col h-screen w-screen">
    <div className="flex flex-row">Header</div>
    <div className="flex flex-row">
      <div className="flex">Sidebar</div>
      <div className="flex">Main Content</div>
    </div>
  </div>;
};

export default Dashboard;
