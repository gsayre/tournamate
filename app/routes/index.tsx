import { LoaderFunction, redirect } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { getUser } from '~/lib/auth.server';
import NavBar from '~/ui/components/NavBar';

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect('/home') : null;
};

export default function Index() {
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
