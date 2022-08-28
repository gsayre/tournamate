import { Link, NavLink } from '@remix-run/react';
import { Form } from 'remix';

export default function SidePannel() {
  return (
    <div className="flex h-full w-80 flex-col items-center bg-white pt-4 shadow-md">
      <Link to='./' className="flex flex-row  gap-2 px-6 py-4 ">
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
      <div className="flex h-full flex-col justify-between pb-8">
        <div className="flex flex-col space-y-8 pt-10">
          <NavLink
            to="./tournaments"
            className={({ isActive }) =>
              isActive
                ? 'flex flex-row items-center space-x-3 text-2xl font-bold text-[#2196F3]'
                : 'flex flex-row items-center space-x-3 text-2xl font-bold hover:text-[#2196F3]'
            }
          >
            <img src="/icons8-trophy-30.png" alt="" className="h-10 w-10" />
            <p>Tournaments</p>
          </NavLink>
          <NavLink
            to="./about"
            className={({ isActive }) =>
              isActive
                ? 'flex flex-row items-center space-x-3 text-2xl font-bold text-[#2196F3]'
                : 'flex flex-row items-center space-x-3 text-2xl font-bold hover:text-[#2196F3]'
            }
          >
            <img
              src="/icons8-question-mark-30.png"
              alt=""
              className="h-10 w-10"
            />
            <p>About</p>
          </NavLink>
          <NavLink
            to="./pricing"
            className={({ isActive }) =>
              isActive
                ? 'flex flex-row items-center space-x-3 text-2xl font-bold text-[#2196F3]'
                : 'flex flex-row items-center space-x-3 text-2xl font-bold hover:text-[#2196F3]'
            }
          >
            <img
              src="/icons8-us-dollar-circled-30.png"
              alt=""
              className="h-10 w-10"
            />
            <p>Pricing</p>
          </NavLink>
          <NavLink
            to="./profile"
            className={({ isActive }) =>
              isActive
                ? 'flex flex-row items-center space-x-3 text-2xl font-bold text-[#2196F3]'
                : 'flex flex-row items-center space-x-3 text-2xl font-bold hover:text-[#2196F3]'
            }
          >
            <img
              src="/icons8-user-30.png"
              alt=""
              className="h-10 w-10"
            />
            <p>Profile</p>
          </NavLink>
        </div>
        <div className="flex w-full flex-row">
          <Form
            action="/logout"
            method="post"
            className="flex w-full flex-row items-center justify-center space-x-4"
          >
            <button
              type="submit"
              className="flex w-full flex-row items-center justify-center space-x-4"
            >
              <img className="h-8 w-8" src="/icons8-logout-50.png" alt="" />
              <p className="text-2xl font-semibold">Logout</p>
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
