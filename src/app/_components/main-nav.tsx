import Link from "next/link";
import Image from "next/image";
import { HomeIcon, LogIn, LogOut, Settings, Trophy } from "lucide-react";
import { getServerAuthSession } from "@/server/auth";

export default async function MainNav() {
  const session = await getServerAuthSession();
  return (
    <nav className="flex w-full items-center justify-between border-b px-8 py-3">
      <div className="flex flex-row items-center gap-2">
        <Image
          src={"/BlackLogo.png"}
          alt="Tournamate Logo"
          width={36}
          height={36}
        />
        <div className="flex  text-lg tracking-widest">
          <span>Tourna</span> <span className="text-orange-500">Mate</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" className="flex flex-row ">
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-lg bg-[#1e293b] p-2 text-white">
              <HomeIcon className="h-4 w-4" />
            </div>
            <span className="text-md tracking-wider"> Home</span>
          </div>
        </Link>
        <Link href="/tournaments" className="flex flex-row ">
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-lg bg-[#1e293b] p-2 text-white">
              <Trophy className="h-4 w-4" />
            </div>
            <span className="text-md tracking-wider">Tournaments</span>
          </div>
        </Link>
        {session?.user.isAdmin && (
          <Link href="/admin" className="flex flex-row ">
            <div className="flex items-center justify-center gap-3">
              <div className="rounded-lg bg-[#1e293b] p-2 text-white">
                <Settings className="h-4 w-4" />
              </div>
              <span className="text-md tracking-wider">Admin</span>
            </div>
          </Link>
        )}
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="flex flex-row "
        >
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-lg bg-[#1e293b] p-2 text-white">
              {session ? (
                <LogOut className="h-4 w-4" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
            </div>
            <span className="text-md tracking-wider">
              {session ? "Sign out" : "Sign in"}
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
