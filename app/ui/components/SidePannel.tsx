import { NavLink } from '@remix-run/react';


export default function SidePannel() {
  return (
    <div className="flex h-full w-80 flex-col items-center bg-white pt-4 shadow-md">
      <div className="flex flex-row  gap-2 px-6 py-4 ">
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
      </div>
      <div className="flex flex-col space-y-8 pt-10">
        <NavLink
          to="."
          className={({ isActive }) =>
            isActive
              ? 'flex flex-row items-center space-x-3 text-2xl font-bold underline'
              : 'flex flex-row items-center space-x-3 text-2xl font-bold hover:text-[#2196F3]'
          }
        >
          <img src="/icons8-home-50.png" alt="" className="h-10 w-10" />
          <p>Home</p>
        </NavLink>
        <NavLink
          to="./tournaments"
          className={({ isActive }) =>
            isActive
              ? 'flex flex-row items-center space-x-3 text-2xl font-bold underline'
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
              ? 'flex flex-row items-center space-x-3 text-2xl font-bold underline'
              : 'flex flex-row items-center space-x-3 text-2xl font-bold hover:text-[#2196F3]'
          }
        >
          <img src="/icons8-question-mark-30.png" alt="" className="h-10 w-10" />
          <p>About</p>
        </NavLink>
        <NavLink
          to="./pricing"
          className={({ isActive }) =>
            isActive
              ? 'flex flex-row items-center space-x-3 text-2xl font-bold underline'
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
              ? 'flex flex-row items-center space-x-3 text-2xl font-bold underline'
              : 'flex flex-row items-center space-x-3 text-2xl font-bold hover:text-[#2196F3]'
          }
        >
          <img src="/icons8-user-30.png" alt="" className="h-10 w-10" />
          <p>Profile</p>
        </NavLink>
      </div>
    </div>
  );
}
