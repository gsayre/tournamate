import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div className="flex h-full w-full flex-row items-center justify-center space-x-32 p-8">
      <Link
        to="./tournaments"
        className="flex h-4/6 w-96 items-center justify-center"
      >
        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#2196F3] p-4 text-center text-5xl font-semibold  hover:bg-[#2196F3]/[.90]">
          Participate in a tournament?
        </div>
      </Link>
      <Link
        to="./tournaments"
        className="flex h-4/6 w-96 items-center justify-center"
      >
        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-black p-4 text-center text-5xl font-semibold text-white hover:bg-black/[.90]">
          Create your own tournament?
        </div>
      </Link>
      <Link
        to="./profile"
        className="flex h-4/6 w-96 items-center justify-center"
      >
        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#F24E1E] p-4 text-center text-5xl font-semibold  hover:bg-[#F24E1E]/[.90]">
          Check your statistics?
        </div>
      </Link>
    </div>
  );
}
