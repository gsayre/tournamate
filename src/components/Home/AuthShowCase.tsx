import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";

export const AuthShowcase = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {isSignedIn && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-row">
            <p className="text-2xl font-semibold text-[#F24E1E] lg:text-5xl">
              Welcome {user?.fullName}!
            </p>
          </div>
          <div className="rounded-xl bg-green-500/90 p-4 text-center text-xl font-semibold tracking-wide text-white lg:text-5xl">
            <Link href={"./dashboard"}>To Application</Link>
          </div>
        </div>
      )}
      {!isSignedIn && (
        <p className="rounded-xl bg-green-500/90 p-4 text-center text-5xl font-semibold tracking-wide text-white">
          <Link href="/sign-in">Sign in</Link>
        </p>
      )}
    </div>
  );
};
