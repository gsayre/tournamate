/* eslint-disable react-hooks/rules-of-hooks */
import { json, redirect } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Link, useActionData } from '@remix-run/react';
import { checkSessionCookie, signIn } from '~/server/auth.server';
import { commitSession, getSession } from '~/sessions';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('cookie'));
  const { uid } = await checkSessionCookie(session);
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

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const email = form.get('email')
  const password = form.get('password');
  const formError = json({ error: "Please fill all fields" }, { status: 400 })
  if (typeof email !== "string") return formError
  if (typeof password !== "string") return formError

  try {
    const sessionCookie = await signIn(email, password)
    const session = await getSession(request.headers.get('cookie'))
    session.set("session", sessionCookie)
    return redirect('/dashboard', {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    })
  } catch (error) {
    console.log(error)
    return json<ActionData>({error: String(error)}, {status: 400})
  }
};

export default function login() {
  const action = useActionData<ActionData>();
  return (
    <div>
      <h1>Login</h1>
      {action?.error && <p>{action.error}</p>}
      <form method="post">
        <input
          style={{ display: 'block' }}
          name="email"
          placeholder="you@example.com"
          type="email"
        />
        <input
          style={{ display: 'block' }}
          name="password"
          placeholder="password"
          type="password"
        />
        <button style={{ display: 'block' }} type="submit">
          Login
        </button>
      </form>
      <p>
        Do you want to <Link to="/join">join</Link>?
      </p>
    </div>
  );
}
