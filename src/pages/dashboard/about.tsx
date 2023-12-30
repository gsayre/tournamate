import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import TopBar from "../../components/TopBar";

export async function getServerSideProps(context: any) {
  const { userId } = getAuth(context.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return { props: { ...buildClerkProps(context.req) } };
}

export default function About() {
  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className=" h-full w-full p-4">
            <div className="h-full w-full rounded-md bg-white p-4">
              <div className="p-4">
                <h1 className="text-3xl font-semibold">About</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
