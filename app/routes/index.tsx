import React, { useEffect, useState } from 'react';
import { Link } from 'remix';

export default function Index() {
  const [WhyToggleState, setWhyToggleState] = useState('Tournament Director');
  const [featureToggleState, setFeatureToggleState] = useState(
    'Tournament Director'
  );
  const [pricingToggleState, setPricingToggleState] = useState(
    'Tournament Director'
  );

  return (
    <div>
      <header
        className="sticky top-0 z-50 flex justify-between bg-white shadow-lg
      "
      >
        <div className="flex flex-row items-center gap-2 px-8 py-4">
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
        <div className="flex flex-row items-center gap-16">
          <a href="#Why" className="text-2xl font-semibold">
            Why
          </a>
          <a href="#Features" className="text-2xl font-semibold">
            Features
          </a>
          <a href="#Pricing" className="text-2xl font-semibold">
            Pricing
          </a>
        </div>
        <div className="flex flex-row items-center gap-3 pr-8">
          <Link
            to="/Login"
            className=" flex h-14 w-24 items-center rounded text-xl font-medium text-[#F24E1E]"
          >
            Sign In
          </Link>
          <Link
            to="/Register"
            className=" flex h-14 w-24 items-center justify-center rounded bg-[#2196F3] text-xl font-medium text-white"
          >
            Sign Up
          </Link>
        </div>
      </header>
      <main className="relative">
        <div className="flex flex-col">
          <div
            id="HeroSection"
            className="flex h-screen w-full flex-col items-center bg-slate-100"
          >
            <div>
              <p className="mt-16 pb-16">
                <span className="text-9xl font-bold text-[#2196F3]">
                  Tourna
                </span>
                <span className="text-9xl font-bold text-[#F24E1E]">Mate</span>
              </p>
            </div>

            <div className="flex flex-row gap-24">
              <div className="flex w-[calc(100vw/2)] flex-col items-center justify-center">
                <img
                  src="fitness.svg"
                  alt="Volleyball Image"
                  title="Volleyball Image"
                  className="h-124 ml-48 w-full px-16"
                />
                <a
                  href="http://www.freepik.com"
                  className="text-xs font-thin text-stone-600"
                >
                  Designed by stories / Freepik
                </a>
              </div>
              <div className="flex w-[calc(100vw/2)] flex-col items-center">
                <p className="text-9xl font-normal">Focus on</p>
                <p className="pb-10 text-9xl font-normal">
                  the{' '}
                  <span className="font-semibold text-[#2196F3]">
                    Tournament
                  </span>
                </p>
                <p className="text-5xl font-medium">
                  Let us handle the{' '}
                  <span className="font-bold text-[#F24E1E]">logistics</span>{' '}
                </p>
                <div className="flex flex-row gap-4 pt-4">
                  <div className="flex w-96 flex-col text-right">
                    <div className="flex flex-row-reverse ">
                      <div className="flex h-1 w-72 bg-[#F24E1E]" />
                    </div>
                    <p className="mt-4 text-3xl">
                      Plan, create, share and manage your tournament on our
                      platform - without all the hassle
                    </p>
                  </div>
                  <div className="flex w-96 flex-col">
                    <div className="flex h-1 w-72 bg-[#2196F3]"></div>
                    <p className="mt-4 text-3xl">
                      Participate in tournaments with a smooth player experience
                      and level up your game play with our insightful player
                      analytics
                    </p>
                  </div>
                </div>
                <Link
                  to="/Login"
                  className="mt-16 flex h-16 w-96 items-center justify-center rounded-lg bg-[#2196F3] text-xl font-bold text-white"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>
          <div
            id="Why"
            className="flex h-screen w-full flex-col items-center bg-[#2196F3]/[.20]"
          >
            <div>
              <p className="mt-16 pb-16 text-8xl font-semibold">
                Why{' '}
                <span className="font-bold text-[#2196F3] opacity-100">
                  Tourna
                </span>
                <span className="font-bold text-[#F24E1E] opacity-100">
                  Mate
                </span>
                ?
              </p>
            </div>
            <div className="flex flex-row gap-8 text-4xl font-semibold">
              {WhyToggleState === 'Tournament Director' ? (
                <button
                  className="text-[#2196F3] underline underline-offset-8"
                  onClick={() => setWhyToggleState('Tournament Director')}
                >
                  Tournament Director
                </button>
              ) : (
                <button
                  className=""
                  onClick={() => setWhyToggleState('Tournament Director')}
                >
                  {' '}
                  Tournament Director
                </button>
              )}
              {WhyToggleState === 'Tournament Director' ? (
                <button
                  className=""
                  onClick={() => setWhyToggleState('Competitor')}
                >
                  Competitor
                </button>
              ) : (
                <button
                  className="text-[#F24E1E] underline underline-offset-8"
                  onClick={() => setWhyToggleState('Tournament Director')}
                >
                  Competitor
                </button>
              )}
            </div>
            <div className="flex flex-row pt-48">
              <div className="align-center flex w-[calc(100vw/3)] flex-col justify-center p-16 text-center">
                <div className="flex h-64 w-64 items-center justify-center self-center rounded-full bg-[#F24E1E]">
                  <img src="today-128.png" alt="Calendar" />
                </div>
                <p className="mt-8 justify-center text-4xl font-bold">
                  Easily Create Your Tournament
                </p>
                <p className="mt-2 text-2xl font-normal">
                  With the click of a button anyone is able to create their own
                  tournaments
                </p>
              </div>
              <div className="align-center flex w-[calc(100vw/3)] flex-col justify-center p-16 text-center">
                <div className="flex h-64 w-64 items-center justify-center self-center rounded-full bg-black">
                  <img src="arrow-58-128.png" alt="Calendar" />
                </div>
                <p className="mt-8 justify-center text-4xl font-bold">
                  Share Your Tournament
                </p>
                <p className="mt-2 text-2xl font-normal">
                  With the click of a button anyone is able to create their own
                  tournaments
                </p>
              </div>
              <div className="align-center flex w-[calc(100vw/3)] flex-col justify-center p-16 text-center">
                <div className="flex h-64 w-64 items-center justify-center self-center rounded-full bg-[#2196F3]">
                  <img src="icons8-relax-50.png" alt="Calendar" className='w-40 h-40'/>
                </div>
                <p className="mt-8 justify-center text-4xl font-bold">
                  Sit back and relax
                </p>
                <p className="mt-2 text-2xl font-normal">
                  With the click of a button anyone is able to create their own
                  tournaments
                </p>
              </div>
            </div>
          </div>
          <div
            id="Features"
            className="h-screen w-full bg-[#F24E1E] opacity-20"
          >
            Features Section
          </div>
          <div id="Pricing" className="h-screen w-full bg-[#C4C4C4] opacity-20">
            Pricing Section
          </div>
        </div>
      </main>
    </div>
  );
}
