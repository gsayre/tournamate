import bcrypt from 'bcryptjs';
import { json, createCookieSessionStorage, redirect } from '@remix-run/node';
import { prisma } from './db.server';
import type { LoginForm, RegisterForm } from './types/types';
import { createUser } from './users.server';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET is not set');
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: 'tournamate-session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function registerUser(user: RegisterForm) {
  const exists = await prisma.user.count({ where: { email: user.email } });
  if (exists) {
    return json(
      { error: `User already exists with that email` },
      { status: 400 }
    );
  }

  const newUser = await createUser(user);
  if (!newUser) {
    return json(
      {
        error: `Something went wrong trying to create a new user.`,
        fields: { email: user.email, password: user.password },
      },
      { status: 400 }
    );
  }
  return createUserSession(newUser.id, '/');
}

export const loginUser = async (form: LoginForm) => {
  const user = await prisma.user.findUnique({ where: { email: form.email } });
  if (!user || !(await bcrypt.compare(form.password, user.password))) {
    return json({ error: 'Incorrect Login' }, { status: 400 });
  }
  //TODO: May need to switch this to /home
  return createUserSession(user.id, '/');
};

export async function createUserSession(userId: number, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'number') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'number') return null;
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== 'number') {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, profile: true },
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}
