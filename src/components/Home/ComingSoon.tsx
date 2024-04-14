import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { trpc } from "utils/trpc";

export const ComingSoon = () => {
  const addEmailToSubscribers = trpc.comingSoon.subscribeToUpdates.useMutation()
  const [email, setEmail] = useState("")
  return (
    <main className="flex flex-col h-screen w-screen bg-black overflow-clip">
      <div className="w-full p-4 ml-6 flex flex-row">
      <Image src={'/images/WhiteLogo.png'} alt="Tournamate Logo" width={56} height={56}/>
      <p className="text-white tracking-widest justify-center items-center h-full flex ml-2 text-2xl">TournaMate</p>
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center px-4">
        <h1 className="mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text pb-10 text-center text-7xl font-bold text-transparent md:text-5xl lg:text-9xl">
          Coming Soon
        </h1>
        <p className="text-center text-xl text-white lg:text-3xl">
          Outdoor volleyball tournament management has never been easier.
        </p>
        <div className="mt-20 flex w-full items-center justify-center space-x-4 pb-6">
          <Input
            type="email"
            placeholder="Email"
            className="w-64 border-transparent bg-[#292929] p-2 text-white outline-none focus-visible:ring-transparent lg:w-96"
            onChange={e => setEmail(e.target.value)}
          />
          <Button type="submit" onClick={() => {addEmailToSubscribers.mutate({email: email})}}>Notify Me</Button>
        </div>
        <p className="text-md text-white lg:text-xl">
          Subscribe to get notified when we launch.
        </p>
      </div>
    </main>
  );
};
