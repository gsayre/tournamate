import { useLoaderData } from '@remix-run/react';
import {LoaderFunction} from "@remix-run/node"

export default function Index() {
  return (
    <div>
      <p>Dashboard</p>
      <p>Tournaments</p>
    </div>
  );
}
