import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ComingSoon = () => {
  return (
    <main className="flex h-screen w-screen bg-black">
      <div className="flex h-full w-full flex-col items-center justify-center px-4">
        <h1 className="mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text pb-10 text-center text-7xl font-bold text-transparent md:text-5xl lg:text-9xl">
          Coming Soon
        </h1>
        <p className="text-center text-xl text-white lg:text-3xl">
          Grass volleyball tournament management has never been easier.
        </p>
        <div className="mt-20 flex w-full items-center justify-center space-x-4 pb-6">
          <Input
            type="email"
            placeholder="Email"
            className="w-64 border-transparent bg-[#292929] p-2 text-white outline-none focus-visible:ring-transparent lg:w-96"
          />
          <Button type="submit">Notify Me</Button>
        </div>
        <p className="text-md text-white lg:text-xl">
          Subscribe to get notified when we launch.
        </p>
      </div>
    </main>
  );
};
