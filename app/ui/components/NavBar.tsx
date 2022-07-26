import { Link } from "@remix-run/react";

export default function NavBar() {
  return (
    <header
      className="sticky top-0 z-50 flex w-full justify-between bg-white shadow-lg
      "
    >
      <div className="flex flex-row items-center gap-2 px-8 py-4">
        <img
          src="https://www.svgrepo.com/show/12756/cup.svg"
          alt="Cup SVG Vector"
          title="Cup SVG Vector"
          className="h-12 w-12"
        />
        <div>
          <span className="text-3xl font-bold text-[#2196F3]">Tourna</span>
          <span className="text-3xl font-bold text-[#F24E1E]">Mate</span>
        </div>
      </div>
      <div className="flex flex-row items-center gap-16">
        <a href="#Why" className="text-2xl font-semibold">
          Why
        </a>
        <a href="#Features" className="text-2xl font-semibold">
          Features
        </a>
        <a href="#Pricing" className="text-2xl font-semibold">
          Pricing
        </a>
      </div>
      <div className="flex flex-row items-center gap-3 pr-8">
        <Link
          to="/login"
          className=" flex h-14 w-24 items-center rounded text-xl font-medium text-[#F24E1E]"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className=" flex h-14 w-24 items-center justify-center rounded bg-[#2196F3] text-xl font-medium text-white"
        >
          Register
        </Link>
      </div>
    </header>
  );
}
