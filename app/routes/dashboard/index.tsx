import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { requireAuth } from '~/server/auth.server';
import { getCurrentUser } from '~/server/db.server';
import { User } from '~/types';
import { ReactElement } from 'react';

type ActionData = {
  error?: string;
};

type LoaderData = {
  message: string;
  currentUser: User | undefined;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuth(request);
  const currentUser = await getCurrentUser(user.uid);
  return json<LoaderData>({
    message: `Hello ${user.displayName || 'unknown'}!`,
    currentUser,
  });
};

export default function Index() {
  const action = useActionData<ActionData>();
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>{data.message}</h1>
      <p>Press the button below to log out.</p>
      <Form method="post">
        <button type="submit" name="logout">
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
