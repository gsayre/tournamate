import { AuthShowcase } from "./AuthShowCase";

export const HomePage = () => {
    return (
      <main className="bg-home-mobile lg:bg-home-desktop flex h-screen w-full flex-col items-center justify-between bg-right-bottom p-4 lg:bg-cover">
        <h1 className="mt-24 text-center text-5xl font-extrabold leading-normal text-gray-700 lg:mt-80 lg:text-8xl">
          <span className="text-[#2196F3]">Tourna</span>
          <span className="text-[#F24E1E]">Mate</span> App
        </h1>
        <div className="mb-8 lg:mb-28">
          <AuthShowcase />
        </div>
      </main>
    );
}