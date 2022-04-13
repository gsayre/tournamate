import { Link, Form, useLoaderData } from '@remix-run/react';

export default function login() {
  return (
    <div>
      <Link to="/" className="text-xl ">
        Home
      </Link>
      <Form>
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" name="email" />
        <br />
        <label htmlFor="email">Password:</label>
        <input type="password" id="password" name="password" />
        <br />
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}
