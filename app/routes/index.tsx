import { Link } from 'remix';

export default function Index() {
  return (
    <div className="w-full">
      <header className="sticky top-0 z-50 flex justify-between bg-white">
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
          <Link to="#Why" className="fon-semibold text-2xl">
            Why
          </Link>
          <Link to="#Features" className="text-2xl font-semibold">
            Features
          </Link>
          <Link to="#Pricing" className="text-2xl font-semibold">
            Pricing
          </Link>
        </div>
        <div className="flex flex-row items-center gap-3 pr-8">
          <Link
            to="/Login"
            className=" flex h-14 w-24 items-center rounded text-xl font-medium text-[#F24E1E]"
          >
            Sign In
          </Link>
          <Link
            to="/Register"
            className=" flex h-14 w-24 items-center justify-center rounded bg-[#2196F3] text-xl font-medium text-white"
          >
            Sign Up
          </Link>
        </div>
      </header>
      <main className="relative">
        <div className="flex flex-col">
          <div
            id="HeroSection"
            className="flex h-screen w-full flex-col items-center bg-slate-100"
          >
            <div>
              <p className="pb-16">
                <span className="text-9xl font-bold text-[#2196F3]">
                  Tourna
                </span>
                <span className="text-9xl font-bold text-[#F24E1E]">Mate</span>
              </p>
            </div>

            <div className="flex flex-row gap-24">
              <div className="flex w-[calc(100vw/2)] flex-col items-center justify-center">
                <img
                  src="fitness.svg"
                  alt="Volleyball Image"
                  title="Volleyball Image"
                  className="h-124 w-full"
                />
                <a
                  href="http://www.freepik.com"
                  className="text-xs font-thin text-stone-600"
                >
                  Designed by stories / Freepik
                </a>
              </div>
              <div className="flex w-[calc(100vw/2)] flex-col items-center">
                <p className="text-8xl font-semibold">
                  Focus on the{' '}
                  <span className="font-bold text-[#2196F3]">Tournament</span>
                </p>
              </div>
            </div>
          </div>
          <div id="Why" className="h-screen w-full">
            {' '}
            Why Section
          </div>
          <div id="Features" className="h-screen w-full">
            Features Section
          </div>
          <div id="Pricing" className="h-screen w-full">
            Pricing Section
          </div>
        </div>
      </main>
    </div>
  );
}
