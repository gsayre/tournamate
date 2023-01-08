/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { string } from "zod";

export default function SidePannel() {
  return (
    <div className="flex h-full w-80 flex-col items-center bg-white pt-4 shadow-md">
      <Link href="/" className="flex flex-row  gap-2 px-6 py-4 ">
        <TitleWithIcon />
      </Link>
      <div className="flex h-full flex-col justify-between pb-8">
        <div className="flex flex-col space-y-8 pt-10">
          <Link href="./dashboard/tournaments">
            <TextWithIcon
              text="Tournaments"
              iconURL="/icons/icons8-trophy-30.png"
            />
          </Link>
          <Link href="./dashboard/about">
            <TextWithIcon
              text="About"
              iconURL="/icons/icons8-question-mark-30.png"
            />
          </Link>
          <Link href="./dashboard/pricing">
            <TextWithIcon
              text="Pricing"
              iconURL="/icons/icons8-us-dollar-circled-30.png"
            />
          </Link>
          <Link href="./dashboard/profile">
            <TextWithIcon text="Profile" iconURL="/icons/icons8-user-30.png" />
          </Link>
          <Link href="./dashboard/admin">
            <TextWithIcon
              text="Admin"
              iconURL="/icons/icons8-automation-50.png"
            />
          </Link>
        </div>
        <div className="flex w-full flex-row">
          <button
            type="submit"
            className="flex w-full flex-row items-center justify-center space-x-4"
            onClick={() => signOut()}
          >
            <TextWithIcon text="Logout" iconURL="/icons/icons8-logout-50.png" />
          </button>
        </div>
      </div>
    </div>
  );
}

const TextWithIcon = ({ text, iconURL }: { text: string; iconURL: string }) => {
  return (
    <div className="flex flex-row items-center space-x-3 p-2 text-2xl font-bold text-[#2196F3]">
      <img src={iconURL} alt="" className="h-10 w-10" />
      <p className="text-2xl font-bold">{text}</p>
    </div>
  );
};

const TitleWithIcon = () => {
  return (
    <>
      {/* <Image
        src="https://www.svgrepo.com/show/12756/cup.svg"
        alt="Cup SVG Vector"
        title="Cup SVG Vector"
        className="h-12 w-12"
        width={48}
        height={48}
      /> */}
      <div>
        <span className="text-3xl font-bold text-[#2196F3]">Tourna</span>
        <span className="text-3xl font-bold text-[#F24E1E]">Mate</span>
      </div>
    </>
  );
};
