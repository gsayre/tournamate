import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, Form, useActionData } from '@remix-run/react';

export default function register() {
  return (
    <div>
      <header className="sticky top-0 z-50 flex w-full justify-between bg-white shadow-lg">
        <div className="flex flex-row items-center">
          <Link to="/" className="flex flex-row items-center gap-2 px-8 py-4">
            <img
              src="https://www.svgrepo.com/show/12756/cup.svg"
              alt="Cup SVG Vector"
              title="Cup SVG Vector"
              className="h-12 w-12"
            />
            <div>
              <span className="text-3xl font-bold text-[#2196F3]">Tourna</span>
              <span className="text-3xl font-bold text-[#F24E1E]">Mate</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-3 pr-8">
          <p className="text-m -mb-1 font-medium">Already have one?</p>
          <Link
            to="/login"
            className=" flex h-14 w-24 items-center rounded text-xl font-medium text-[#2196F3]"
          >
            Sign In
          </Link>
        </div>
      </header>
      <div className="flex flex-row">
        <div className="flex h-[calc(100vh-20vh)] w-[calc(100vw/2)] flex-col justify-center">
          <p className="pt-16 pl-8 text-5xl font-semibold">Basic Information</p>
          <Form className="flex flex-col pl-8">
            <div className=" mt-8 flex flex-row">
              <label className="flex flex-col pl-8 text-3xl font-medium">
                First Name:{' '}
                <input
                  type="text"
                  name="firstname"
                  className="rounded-md p-1 text-2xl outline outline-1 outline-black focus:outline-blue-800"
                  placeholder="First Name"
                />
              </label>
              <label className="flex flex-col pl-8 text-3xl font-medium">
                Last Name:{' '}
                <input
                  type="text"
                  name="lastname"
                  className="rounded-md p-1 text-2xl outline outline-1 outline-black focus:outline-blue-800"
                  placeholder="Last Name"
                />
              </label>
            </div>
            <div className="mt-2 flex flex-row">
              <label className=" flex flex-col pl-8 text-3xl font-medium">
                Date of Birth:{' '}
                <input
                  type="date"
                  name="dob"
                  className="rounded-md text-2xl outline outline-1 outline-black focus:outline-blue-800"
                />
              </label>
              <label className=" flex flex-col pl-8 text-3xl font-medium">
                Sex:{' '}
                <select
                  name="sex"
                  className="rounded-md p-1 text-2xl outline outline-1 outline-black focus:outline-blue-800"
                >
                  <option value="">--Please choose an option--</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
            </div>
            <label className="mt-2 flex flex-col pl-8 text-3xl font-medium">
              Email Address:{' '}
              <input
                type="email"
                name="email"
                className="mt-2 w-9/12 rounded-md outline outline-1 outline-black focus:outline-blue-800"
              />
            </label>
            <label className=" mt-2 flex flex-col pl-8 text-3xl font-medium">
              Address:{' '}
              <input
                type="text"
                name="address"
                className="mt-2 w-9/12 rounded-md outline outline-1 outline-black focus:outline-2 focus:outline-blue-800"
              />
            </label>
          </Form>
        </div>
        <div className="flex w-[calc(100vw/2)] flex-col items-center justify-center">
          <img
            src="beachvolleyball.jpg"
            alt="Beach Volleyball"
            className="h-9/12 z-50 -mb-96 flex w-2/5"
          />
          <div className="-mt-48 -mr-48 h-[760px] w-[500px] bg-[#F24E1E]"></div>
        </div>
      </div>
    </div>
  );
}
