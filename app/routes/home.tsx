// import { getUser, requireUserId } from '~/lib/auth.server';
// import { redirect } from '@remix-run/node';
// import type { LoaderFunction } from '@remix-run/node';
// import { json } from '@remix-run/node';
// import { Outlet, useLoaderData } from '@remix-run/react';
// import type { User } from '@prisma/client';
// import SidePannel from '~/ui/components/SidePannel';
// import TopBar from '~/ui/components/TopBar';

// type LoaderData = {
//   user: User;
// };
// export const loader: LoaderFunction = async ({ request }) => {
//   //TODO: Figure out where the request is redirecting to (new URL(request.url).pathname)
//   const userId = await requireUserId(request);
//   const user = await getUser(request);
//   return json({ user });
// };

// export default function Home() {
//   const { user } = useLoaderData<LoaderData>();

//   return (
//     <div className="flex h-screen w-screen flex-row">
//       <div className="flex h-full w-full bg-[#E6E7EC]">
//         <SidePannel />
//         <div className="flex w-full flex-col">
//           <TopBar currentUser={user} />
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }

import { redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { getUser } from '~/lib/auth.server';
import NavBar from '~/ui/components/NavBar';

export const loader: LoaderFunction = async ({ request }) => {
  //TODO: Switch to redirect('/)
  return (await getUser(request)) ? redirect('/') : null;
};

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col bg-slate-100 ">
      <NavBar />
      <div className="flex h-full flex-col">
        <h1 className="pt-8 pl-8 text-6xl font-semibold text-[#F24E1E]">
          Create or compete in tournaments near you!
        </h1>
        <div className="flex h-full w-full flex-row items-center justify-between px-8 ">
          <img src="map.webp" alt="" className="flex h-4/6 w-4/6" />
          <Link
            to="/register"
            className=" flex h-16 w-36 items-center justify-center rounded-xl bg-[#2196F3] text-white md:text-xl"
          >
            Begin Today!
          </Link>
        </div>
      </div>
    </div>
  );
}
