import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { DecodedIdToken } from "firebase-admin/auth";
import { checkSessionCookie } from "~/lib/firebase/auth.server";
import { getSession } from "~/sessions";
import AlternateLandingPage from "~/ui/pages/AlternateLandingPage"
import DashboardPage from "~/ui/pages/DashboardPage";
import LandingPage from "~/ui/pages/LandingPage"

type LoaderData = {
  uid: DecodedIdToken |string | undefined;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('cookie'));
  const { uid } = await checkSessionCookie(session);
  return json<LoaderData>({uid});
};

export default function Index() {
  const feelinSpicy: boolean = false;
  const data = useLoaderData()
  
  return (<div>
    {data!.uid ? (<DashboardPage/>) : (feelinSpicy ? (<AlternateLandingPage/>): (<LandingPage/>))}
  </div> )
}
