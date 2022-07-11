import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { requireAuth } from '~/lib/firebase/auth.server';
import type { ActionFunction } from '@remix-run/node';
import { destroySession, getSession } from '~/sessions';
import { getCurrentUser } from '~/lib/firebase/db.server';
import type { DocumentData } from 'firebase-admin/firestore';

type ActionData = {
  error?: string;
};

type LoaderData = {
  message: string;
  currentUser: DocumentData | undefined;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuth(request);
  const currentUser = await getCurrentUser(user.uid);
  return json<LoaderData>({
    message: `Hello ${user.displayName || 'unknown'}!`,
    currentUser,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get('action');
  if (action === 'logout') {
    const session = await getSession(request.headers.get('cookie'));
    return redirect('/', {
      headers: { 'Set-Cookie': await destroySession(session) },
    });
  }
  return json<ActionData>({ error: 'unknown method' }, { status: 400 });
};

export default function Index() {
  const action = useActionData<ActionData>();
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>{data.message}</h1>
      <p>Press the button below to log out.</p>
      <Form method="post">
        <button type="submit" name="action" value="logout">
          Logout
        </button>
      </Form>
      {action?.error && <p style={{ color: 'red' }}>{action.error}</p>}
      <div>
        {data.currentUser ? (
          <div>
            <p>{data.currentUser.uid}</p>
            <p>{data.currentUser.playerRating}</p>
            <p>{data.currentUser.firstName}</p>
          </div>
        ) : (
          <p>No current user</p>
        )}
      </div>
    </div>
  );
}
