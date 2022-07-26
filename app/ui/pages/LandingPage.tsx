import { Link } from '@remix-run/react';
import NavBar from '../components/NavBar';

export default function LandingPage() {

  return (
    <div className="flex h-screen w-full flex-col bg-slate-100 ">
      <NavBar/>
      <div className="flex flex-col h-full">
        <h1 className="text-6xl font-semibold pt-8 pl-8 text-[#F24E1E]">Create or compete in tournaments near you!</h1>
        <div className="flex flex-row w-full h-full items-center justify-between px-8 ">
          <img src="map.webp" alt=""  className='flex h-4/6 w-4/6'/>
          <Link to="register" className=" text-white flex h-16 w-36 items-center justify-center rounded-xl bg-[#2196F3] md:text-xl">
            Begin Today!
          </Link>
        </div>
      </div>
    </div>
  );
}
