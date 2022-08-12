import { getUser, requireUserId } from '~/lib/auth.server';
import { redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import type { User } from '@prisma/client';
import SidePannel from '~/ui/components/SidePannel';
import TopBar from '~/ui/components/TopBar';

type LoaderData = {
  user: User;
};
export const loader: LoaderFunction = async ({ request }) => {
  //TODO: Figure out where the request is redirecting to (new URL(request.url).pathname)
  const userId = await requireUserId(request);
  const user = await getUser(request);
  return json({ user });
};

export default function Home() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <div className="flex h-screen w-screen flex-row">
      <div className="flex h-full w-full bg-[#E6E7EC]">
        <SidePannel />
        <div className="flex w-full flex-col">
          <TopBar currentUser={user} />
          <Outlet />
        </div>
      </div>
    </div>
  );
}