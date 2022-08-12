import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { logout } from '~/lib/auth.server';

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};
export const loader: LoaderFunction = async () => {
  //TODO: Switch to redirect('/home')
  return redirect('/home');
};
