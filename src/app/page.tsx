import { getServerAuthSession } from "@/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col p-2">
      <div className="flex flex-col p-8 pt-6">
        <h1 className="text-2xl ">
          {session && (
            <h2 className="text-3xl">
              Welcome{" "}
              <span className="font-bold tracking-tight">
                {session.user?.name ? session.user.name : session.user.email}
              </span>
              !
            </h2>
          )}
        </h1>
      </div>
    </main>
  );
}
