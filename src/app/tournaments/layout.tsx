import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { getServerAuthSession } from "@/server/auth";
import { Lock } from "lucide-react";
import Link from "next/link";

export default async function TournamentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <div className="p-4">
      <div className="flex flex-row gap-2 tracking-widest text-blue-500 p-2">
        <Link href="./tournaments">
          Player
        </Link>
        <Separator orientation="vertical" className="bg-gray-300 h-8"/>
        <Link href="/tournaments/director">
          {session?.user.isTournamentDirector ? (
            <span>Tournament Director</span>
          ) : (
            <div className="flex flex-row items-center justify-center gap-1">
              <Lock className="h-4 w-4" />
              <span>Tournament Director</span>
            </div>
          )}
        </Link>
      </div>
      {children}
    </div>
  );
}
