import {
  Link,
  Form,
  useLoaderData,
  useActionData,
  useFetcher,
} from '@remix-run/react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '~/firebase-service';
import { sessionLogin } from '~/firebase.sessions.server';

export let action = async (request: Request) => {
  let formData = await request.formData();
  let email = formData.get('email') as string;
  let googleLogin = formData.get('google-login');
  let password = formData.get('password') as string;

  await signOut(auth);

  try {
    if (googleLogin) {
      return await sessionLogin(
        request,
        formData.get('idToken') as string,
        '/'
      );
    } else {
      const authResp = await signInWithEmailAndPassword(auth, email, password);

      // if signin was successful then we have a user
      if (authResp.user) {
        const idToken = await auth!.currentUser!.getIdToken();
        return await sessionLogin(request, idToken, '/');
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: { message: error?.message } };
    }
  }
};

export default function login() {
  const signInWithGoogle = () => {
    // const provider = new GoogleAuthProvider();
    // signInWithPopup(auth, provider)
    //   .then(async (res) => {
    //     const idToken = await res.user.getIdToken();
    //     fetcher.submit(
    //       { idToken: idToken, 'google-login': true },
    //       { method: 'post' }
    //     );
    //   })
    //   .catch((err) => {
    //     console.log('signInWithGoogle', err);
    //   });
    console.log('Tried google sign in');
  };

  return (
    <div className="flex flex-col">
      <h3>Remix Login With Firebase, Email & Google Auth</h3>
      <Form method="post">
        <div className="flex flex-row">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="me@mail.com" required />
        </div>
        <div className="flex flex-row">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" required />
        </div>
        <div className="flex flex-row">
          <button name="email-login" value="true" type="submit">
            Login With Email
          </button>
          <button type="button" onClick={() => signInWithGoogle()}>
            <i></i>
            Login with Google
          </button>
        </div>
      </Form>
      <div></div>
      <div>
        <div>
          <Link to="/register">Register</Link>
        </div>
        <div>
          <Link to="/forgot">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}
