import { User } from '@prisma/client';
import { useMatches } from '@remix-run/react';

export default function ProfileBanner() {
  const matches = useMatches();
  let parentData = matches.find((route) => route.pathname === '/home')?.data;

  return (
    <div className="flex flex-col px-4 mb-4">
      <div className="h-44 w-full rounded-xl bg-[url('/nature.webp')] bg-cover bg-center bg-origin-border" />
      <div className="flex flex-row justify-between px-16">
        <div className="flex">
          <div className="-mt-24 h-48 w-48 rounded-full bg-black bg-[url('/person1.avif')] bg-cover bg-center" />
          <div className="pl-6">
            <p className="text-3xl font-bold">
              {parentData!.user.profile.firstName +
                ' ' +
                parentData!.user.profile.lastName}
            </p>
            <p className="text-xl">Player Location</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row space-x-2 ">
            <span className="text- text-lg font-semibold">Social Media</span>
            <img src="/twitter.png" alt="" className="h-8 w-8" />
            <img src="/instagram.webp" alt="" className="h-8 w-8" />
            <img src="/facebook.webp" alt="" className="h-8 w-8" />
          </div>
          <button className="mt-2 h-8 w-36 rounded-lg bg-[#2196F3]">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
