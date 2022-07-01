import { useLoaderData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { commitSession, getSession } from '~/sessions';
import { isSessionValid } from '~/firebase.sessions.server';
import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('cookie'));
  const { sessionError , decodedClaims } = await isSessionValid(request, '/login');
  const headers = {
    'Set-Cookie': await commitSession(session),
  };
  if (uid) {
    return redirect('/dashboard', { headers });
  }
  return json(null, { headers });
};

type ActionData = {
  error?: string;
};

export default function Index() {
  return (
    <div>
      <p>Dashboard</p>
      <p>Tournaments</p>
    </div>
  );
}
