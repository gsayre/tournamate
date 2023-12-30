import { useAuth } from "@clerk/nextjs";
import type { NextPage } from "next";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";
import { PropsWithChildren, useEffect } from "react";
import TopBar from "@components/TopBar";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { trpc } from "../../utils/trpc";
import { prisma } from "../../server/db/client";

export async function getServerSideProps(context: any) {
  const { userId } = getAuth(context.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }
  return { props: { ...buildClerkProps(context.req) } };
}

export default function Dashboard({ children }: PropsWithChildren) {
  const updateOrCreateUser = trpc.user.createOrFindUser.useMutation();
  useEffect(() => {
    updateOrCreateUser.mutate();
  }, []);
  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className=" h-full w-full p-4">
            <div className="h-full w-full rounded-md bg-white p-4">
              <div className="p-4">
                <h1 className="text-3xl font-semibold">Main Page</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}