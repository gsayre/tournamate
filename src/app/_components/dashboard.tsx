"use client";
import router from "next/router";
import { signout } from "~/actions";
import { auth } from "~/edgedb";

export default async function Dashboard() {
  const session = auth.getSession();
  if (!(await session.isSignedIn())) {
    router.push("/");
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <button
        onClick={async () => {
          signout();
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
