import React, { useEffect, useState } from 'react';
import { Link, Form } from '@remix-run/react';

export default function Index() {
  const [whyToggleState, setWhyToggleState] = useState('Tournament Director');
  const [featureToggleState, setFeatureToggleState] = useState(
    'Tournament Director'
  );
  const [featureChoiceState, setFeatureChoiceState] = useState('TDFeature1');
  const [pricingToggleState, setPricingToggleState] = useState('Competitor');
  const [pricingComponent, setPricingComponent] = useState(
    <div>Competitor</div>
  );

  interface FeatureObject {
    [Feature: string]: {
      title: string;
      body: string;
      iconPath: string;
    };
  }

  const featuresObject: FeatureObject = {
    TDFeature1: {
      title: 'Tournament Sharing',
      body: 'Easily share your tournaments with the press of a button',
      iconPath: 'icons8-shared-mail-64.png',
    },
    TDFeature2: {
      title: 'Pool Play Generation',
      body: 'Generate pools from our player data to make them as fair as possible.',
      iconPath: 'icons8-automation-50.png',
    },
    TDFeature3: {
      title: 'Bracket Play Generation',
      iconPath: 'icons8-tournament-64.png',
      body: "Don't worry about waiting for pool play to finish to collect the score sheets to then spend 30 minutes trying to create brackets from inconsistent reffing. We generate the brackets for you",
    },
    TDFeature4: {
      title: 'Tournament Ranking System',
      body: 'We help recognize tournaments that are doing the right thing so that you are being promoted in the eyes of interested players.',
      iconPath: 'icons8-ranking-64.png',
    },
    CFeature1: {
      title: 'Competitor Ranking System',
      body: '',
      iconPath: 'icons8-ranking-128.png',
    },
    CFeature2: {
      title: 'Insightful Statistics',
      body: '',
      iconPath: 'icons8-statistics-64.png',
    },
    CFeature3: {
      title: 'No Paperwork',
      body: '',
      iconPath: 'icons8-toilet-paper-50.png',
    },
    CFeature4: {
      title: 'Smooth Tournament Experiences',
      body: '',
      iconPath: 'icons8-easy-to-find-50.png',
    },
  };

  useEffect(() => {
    switch (pricingToggleState) {
      case 'Competitor':
        setPricingComponent(
          <div className="flex h-full w-[100vw] flex-row items-center justify-center gap-16">
            <div className="flex h-5/6 w-2/12 flex-col shadow-2xl hover:bg-[#F24E1E] hover:text-white">
              <p className="ml-8 mt-8 text-5xl font-semibold">Basic</p>
              <p className="ml-8 mt-2 text-2xl font-normal">
                Perfect plan for the average
              </p>
              <p className="ml-8 text-2xl font-normal"> user</p>
              <p className="mt-6 ml-8 text-6xl font-bold">Free</p>
              <p className="ml-8 mt-2 text-xl font-normal text-[#000000]/[.40]">
                for a lifetime
              </p>
              <div className="m-8 flex items-center justify-center">
                <button className="h-12 w-10/12 rounded-xl text-xl font-bold outline outline-1 hover:bg-white hover:text-black hover:outline-white">
                  Try for Free
                </button>
              </div>
              <p className="ml-8 text-lg font-bold">
                <span>&#10003;</span> <span> Sign up for tournaments</span>
              </p>
              <p className="ml-8 mt-2 text-lg font-bold">
                <span>&#10003;</span> <span> Discover Other players</span>
              </p>
              <p className="ml-8 mt-2 text-lg font-bold">
                <span>&#10003;</span> <span> View tournament history</span>
              </p>
            </div>
            <div className=" flex h-5/6 w-2/12 flex-col shadow-2xl hover:bg-[#2196F3] hover:text-white">
              <p className="ml-8 mt-8 text-5xl font-semibold">Competitor</p>
              <p className="ml-8 mt-2 text-2xl font-normal">
                For the users that want to
              </p>
              <p className="ml-8 text-2xl font-normal">do more</p>
              <p className="mt-8 ml-8 text-6xl font-bold">$10</p>
              <p className="ml-8 mt-2 text-xl font-normal text-[#000000]/[.40]">
                /month
              </p>
              <div className="m-8 flex items-center justify-center">
                <button className="h-12 w-10/12 rounded-xl text-xl font-bold outline outline-1 hover:bg-white hover:text-black hover:outline-white">
                  Try for Free
                </button>
              </div>
              <p className="ml-8 text-lg font-bold">
                <span>&#10032;</span> <span> All perks from previous tier</span>
              </p>
              <p className="ml-8 mt-2 text-lg font-bold">
                <span>&#10003;</span> <span>Basic player statistics</span>
              </p>
              <p className="ml-8 mt-2 text-lg font-bold">
                <span>&#10003;</span> <span>....</span>
              </p>
            </div>
            <div className="flex h-5/6 w-2/12 flex-col shadow-2xl hover:bg-black/[.80] hover:text-white">
              <p className="ml-8 mt-8 text-5xl font-semibold">Champion</p>
              <p className="ml-8 mt-2 text-2xl font-normal">
                For those who want to take their game to the next level
              </p>
              <p className="mt-6 ml-8 text-6xl font-bold">$20</p>
              <p className="ml-8 mt-2 text-xl font-normal text-[#000000]/[.40]">
                /month
              </p>
              <div className="m-8 flex items-center justify-center">
                <button className="h-12 w-10/12 rounded-xl text-xl font-bold outline outline-1 hover:bg-white hover:text-black hover:outline-white">
                  Try for Free
                </button>
              </div>
              <p className="ml-8 text-lg font-bold">
                <span>&#10032;</span> <span>All perks from previous tier</span>
              </p>
              <p className="ml-8 mt-2 text-lg font-bold">
                <span>&#10003;</span> <span>Advanced player statistics</span>
              </p>
              <p className="ml-8 mt-2 text-lg font-bold">
                <span>&#10003;</span> <span>....</span>
              </p>
            </div>
          </div>
        );
        break;
      case 'Tournament Director':
        setPricingComponent(
          <div className="m-8 flex h-full w-[100vw] flex-row items-center justify-center">
            <div className="flex w-[calc(100vw/4)] flex-col items-center justify-center">
              <p className="text-9xl font-bold">$50</p>
              <p className="mt-4 text-center text-5xl font-medium">
                security fee for creating a tournament
              </p>
            </div>
            <div>
              <p className="text-9xl">&#8594;</p>
            </div>
            <div className="m-8 flex w-[calc(100vw/4)] flex-col items-center">
              <p className=" text-9xl font-bold">$10</p>
              <p className="mt-4 text-center text-5xl font-medium">
                per player participating in your tournament
              </p>
            </div>
            <div>
              <p className="text-9xl">&#8594;</p>
            </div>
            <div>
              <p className=" text-center text-9xl font-normal">
                We do the rest for you!
              </p>
            </div>
          </div>
        );
        break;
      case 'Business':
        setPricingComponent(
          <div className="m-8 flex w-[calc(100vw/2)] flex-col items-start justify-center">
            <p className="text-5xl font-medium">
              If you have any business inquiries or questions regarding the
              product please reach out to us at:
            </p>
            <p className="text-6xl font-bold">GrantSayre1999@gmail.com</p>
          </div>
        );
        break;
    }
  }, [pricingToggleState]);

  return (
    <div>
      <header
        className="sticky top-0 z-50 flex w-full justify-between bg-white shadow-lg
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
            to="/login"
            className=" flex h-14 w-24 items-center rounded text-xl font-medium text-[#F24E1E]"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className=" flex h-14 w-24 items-center justify-center rounded bg-[#2196F3] text-xl font-medium text-white"
          >
            Register
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
                  to="/login"
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
              {whyToggleState === 'Tournament Director' ? (
                <button
                  className="text-[#2196F3] underline underline-offset-8"
                  onClick={() => setWhyToggleState('Tournament Director')}
                >
                  Tournament Director
                </button>
              ) : (
                <button
                  className="hover:text-[#2196F3]"
                  onClick={() => setWhyToggleState('Tournament Director')}
                >
                  {' '}
                  Tournament Director
                </button>
              )}
              {whyToggleState === 'Tournament Director' ? (
                <button
                  className="hover:text-[#F24E1E]"
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
            <div className="flex flex-row pt-40">
              {whyToggleState === 'Tournament Director' ? (
                <div className="align-center flex w-[calc(100vw/3)] flex-col justify-center p-16 text-center">
                  <div className="flex h-64 w-64 items-center justify-center self-center rounded-full bg-[#F24E1E]">
                    <img src="today-128.png" alt="Calendar" />
                  </div>
                  <p className="mt-8 justify-center text-4xl font-bold">
                    Easily Create Your Tournament
                  </p>
                  <p className="mt-4 text-2xl font-normal">
                    With the click of a button anyone is able to create their
                    own tournaments
                  </p>
                </div>
              ) : (
                <div className="align-center flex w-[calc(100vw/3)] flex-col justify-center p-16 text-center">
                  <div className="flex h-64 w-64 items-center justify-center self-center rounded-full bg-[#F24E1E]">
                    <img
                      src="icons8-join-64.png"
                      alt="Calendar"
                      className="h-40 w-40"
                    />
                  </div>
                  <p className="mt-8 justify-center text-4xl font-bold">
                    Tournament Discovery
                  </p>
                  <p className="mt-4 text-2xl font-normal">
                    Find and register for the tournaments that you want to play
                    in all in one place with ease
                  </p>
                </div>
              )}
              {whyToggleState === 'Tournament Director' ? (
                <div className="align-center flex w-[calc(100vw/3)] flex-col justify-center p-16 text-center">
                  <div className="flex h-64 w-64 items-center justify-center self-center rounded-full bg-black">
                    <img src="arrow-58-128.png" alt="Calendar" />
                  </div>
                  <p className="mt-8 justify-center text-4xl font-bold">
                    Share Your Tournament
                  </p>
                  <p className="mt-4 text-2xl font-normal">
                    With the click of a button anyone is able to create their
                    own tournaments
                  </p>
                </div>
              ) : (
                <div className="align-center flex w-[calc(100vw/3)] flex-col justify-center p-16 text-center">
                  <div className="flex h-64 w-64 items-center justify-center self-center rounded-full bg-black">
                    <img
                      src="icons8-tournament-64.png"
                      alt="Calendar"
                      className="h-40 w-40"
                    />
                  </div>
                  <p className="mt-8 justify-center text-4xl font-bold">
                    Compete!
                  </p>
                  <p className="mt-4 text-2xl font-normal">
                    Receive live score updates,
                  </p>
                </div>
              )}

              {whyToggleState === 'Tournament Director' ? (
                <div className="align-center flex w-[calc(100vw/3)] flex-col justify-center p-16 text-center">
                  <div className="flex h-64 w-64 items-center justify-center self-center rounded-full bg-[#2196F3]">
                    <img
                      src="icons8-relax-50.png"
                      alt="Calendar"
                      className="h-40 w-40"
                    />
                  </div>
                  <p className="mt-8 justify-center text-4xl font-bold">
                    Sit Back and Relax
                  </p>
                  <p className="mt-4 text-2xl font-normal">
                    All you have to do is sit back and the application will run
                    the tournament for you!
                  </p>
                </div>
              ) : (
                <div className="align-center flex w-[calc(100vw/3)] flex-col justify-center p-16 text-center">
                  <div className="flex h-64 w-64 items-center justify-center self-center rounded-full bg-[#2196F3]">
                    <img
                      src="icons8-improvement-50.png"
                      alt="Calendar"
                      className="h-40 w-40"
                    />
                  </div>
                  <p className="mt-8 justify-center text-4xl font-bold">
                    Learn From The Results
                  </p>
                  <p className="mt-4 text-2xl font-normal">
                    When the tournament is over, a tournament report is
                    available to view. This will include: updates to your player
                    statistics, summaries of each of your games and other
                    interesting statistics.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div
            id="Features"
            className="flex h-screen w-full flex-col items-center bg-[#F24E1E]/[.20]"
          >
            <div>
              <p className="mt-16 pb-16 text-8xl font-semibold">
                <span className="font-bold text-[#2196F3] opacity-100">
                  Tourna
                </span>
                <span className="font-bold text-[#F24E1E] opacity-100">
                  Mate
                </span>{' '}
                Features
              </p>
            </div>
            <div className="flex flex-row gap-8 text-4xl font-semibold">
              {featureToggleState === 'Tournament Director' ? (
                <button
                  className="text-[#2196F3] underline underline-offset-8"
                  onClick={() => setFeatureToggleState('Tournament Director')}
                >
                  Tournament Director
                </button>
              ) : (
                <button
                  className="hover:text-[#2196F3]"
                  onClick={() => setFeatureToggleState('Tournament Director')}
                >
                  {' '}
                  Tournament Director
                </button>
              )}
              {featureToggleState === 'Tournament Director' ? (
                <button
                  className="hover:text-[#F24E1E]"
                  onClick={() => setFeatureToggleState('Competitor')}
                >
                  Competitor
                </button>
              ) : (
                <button
                  className="text-[#F24E1E] underline underline-offset-8"
                  onClick={() => setFeatureToggleState('Tournament Director')}
                >
                  Competitor
                </button>
              )}
            </div>
            <div className="flex flex-row">
              <div className="flex w-[calc(100vw/2)] items-center justify-center pt-24">
                <img
                  src="tournamentplanning.jfif"
                  alt="Tournament Planning"
                  className="w-5/12"
                />
                <div className="z-50 -ml-16 -mt-40 flex h-96 w-96 flex-col gap-4 rounded-lg bg-white">
                  {featureToggleState === 'Tournament Director' ? (
                    <div
                      className="mt-2 flex flex-row items-center p-2 hover:rounded-lg hover:bg-[#C4C4C4]/[.20]"
                      onClick={() => setFeatureChoiceState('TDFeature1')}
                    >
                      <div className=" ml-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#F24E1E]">
                        <img
                          src="icons8-shared-mail-64.png"
                          alt="Tournament Sharing Icon"
                          className="h-8 w-8"
                        />
                      </div>
                      <p className="ml-2 text-2xl font-semibold">
                        {featuresObject['TDFeature1'].title}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="mt-2 flex flex-row items-center p-2 hover:rounded-lg hover:bg-[#C4C4C4]/[.20]"
                      onClick={() => setFeatureChoiceState('CFeature1')}
                    >
                      <div className="ml-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#F24E1E]">
                        <img
                          src="icons8-ranking-128.png"
                          alt="Tournament Sharing Icon"
                          className="h-8 w-8 fill-black stroke-black"
                        />
                      </div>
                      <p className="ml-2 text-2xl font-semibold">
                        {featuresObject['CFeature1'].title}
                      </p>
                    </div>
                  )}

                  {featureToggleState === 'Tournament Director' ? (
                    <div
                      className="flex flex-row items-center p-2 hover:rounded-lg hover:bg-[#C4C4C4]/[.20]"
                      onClick={() => setFeatureChoiceState('TDFeature2')}
                    >
                      <div className="ml-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#2196F3]">
                        <img
                          src="icons8-automation-50.png"
                          alt="Tournament Sharing Icon"
                          className="h-8 w-8"
                        />
                      </div>
                      <p className="ml-2 text-2xl font-semibold">
                        {featuresObject['TDFeature2'].title}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="flex flex-row items-center p-2 hover:rounded-lg hover:bg-[#C4C4C4]/[.20]"
                      onClick={() => setFeatureChoiceState('CFeature2')}
                    >
                      <div className="ml-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#2196F3] ">
                        <img
                          src="icons8-statistics-64.png"
                          alt="Tournament Sharing Icon"
                          className="h-8 w-8"
                        />
                      </div>
                      <p className="ml-2 text-2xl font-semibold">
                        {featuresObject['CFeature2'].title}
                      </p>
                    </div>
                  )}
                  {featureToggleState === 'Tournament Director' ? (
                    <div
                      className="flex flex-row items-center p-2 hover:rounded-lg hover:bg-[#C4C4C4]/[.20]"
                      onClick={() => setFeatureChoiceState('TDFeature3')}
                    >
                      <div className=" ml-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#F24E1E]">
                        {' '}
                        <img
                          src="icons8-tournament-64.png"
                          alt="Tournament Sharing Icon"
                          className="h-8 w-8"
                        />{' '}
                      </div>
                      <p className="ml-2 text-2xl font-semibold">
                        {featuresObject['TDFeature3'].title}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="flex flex-row items-center p-2 hover:rounded-lg hover:bg-[#C4C4C4]/[.20]"
                      onClick={() => setFeatureChoiceState('CFeature3')}
                    >
                      <div className=" ml-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#F24E1E]">
                        {' '}
                        <img
                          src="icons8-toilet-paper-50.png"
                          alt="Tournament Sharing Icon"
                          className="h-8 w-8"
                        />{' '}
                      </div>
                      <p className="ml-2 text-2xl font-semibold">
                        {featuresObject['CFeature3'].title}
                      </p>
                    </div>
                  )}
                  {featureToggleState === 'Tournament Director' ? (
                    <div
                      className="flex flex-row items-center p-2 hover:rounded-lg hover:bg-[#C4C4C4]/[.20]"
                      onClick={() => setFeatureChoiceState('TDFeature4')}
                    >
                      <div className="ml-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#2196F3]">
                        <img
                          src="icons8-ranking-64.png"
                          alt="Tournament Sharing Icon"
                          className="h-8 w-8"
                        />
                      </div>
                      <p className="ml-2 text-2xl font-semibold">
                        {featuresObject['TDFeature4'].title}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="flex flex-row items-center p-2 hover:rounded-lg hover:bg-[#C4C4C4]/[.20]"
                      onClick={() => setFeatureChoiceState('CFeature4')}
                    >
                      <div className="ml-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#2196F3]">
                        <img
                          src="icons8-easy-to-find-50.png"
                          alt="Tournament Sharing Icon"
                          className="h-8 w-8"
                        />
                      </div>
                      <p className="ml-2 text-2xl font-semibold">
                        {featuresObject['CFeature4'].title}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="items-left flex w-[calc(100vw/2)] flex-col px-8 pt-16">
                <div className="ml-2 flex h-48 w-48 items-center justify-center rounded-full bg-[#2196F3]">
                  <img
                    src={featuresObject[featureChoiceState].iconPath}
                    alt="Tournament Sharing Icon"
                    className="h-24 w-24"
                  />
                </div>
                <p className="text-8xl font-bold">
                  {featuresObject[featureChoiceState].title}
                </p>
                <p className="items-left pt-4 indent-16 text-2xl font-medium">
                  {featuresObject[featureChoiceState].body}
                </p>
              </div>
            </div>
          </div>
          <div
            id="Pricing"
            className="flex h-screen w-full flex-col items-center bg-[#C4C4C4]/[.20]"
          >
            <div className="flex">
              <p className="mt-16 pb-16 text-8xl font-medium">
                Choose your{' '}
                <span className="font-bold text-[#F24E1E] opacity-100">
                  Plan
                </span>
              </p>
            </div>
            <div className="flex h-[100vh] w-full flex-col-reverse">
              <div className="z-50 flex h-[50vh] w-full items-center justify-center bg-white">
                {pricingComponent}
              </div>
              <div className="flex flex-row items-end justify-center">
                {pricingToggleState === 'Competitor' ? (
                  <div className="flex h-64 w-96  flex-col  items-center justify-center rounded-t-lg bg-white p-3 shadow-xl">
                    <img
                      src="icons8-person-64.png"
                      alt="Person icon"
                      className="h-16 w-16"
                    />
                    <p className="text-4xl font-semibold">Competitor</p>
                    <p className="mt-2 text-center  text-xl">
                      For those looking to compete
                    </p>
                  </div>
                ) : (
                  <div
                    className="flex h-48 w-96 flex-col  items-center justify-center bg-[#C4C4C4]/[.30] p-3 hover:h-64 hover:rounded-t-lg hover:bg-white"
                    onClick={() => setPricingToggleState('Competitor')}
                  >
                    <img
                      src="icons8-person-64.png"
                      alt="Person icon"
                      className="h-16 w-16"
                    />
                    <p className="text-4xl font-semibold">Competitor</p>
                    <p className="mt-2 text-center  text-xl">
                      For those looking to compete
                    </p>
                  </div>
                )}
                {pricingToggleState === 'Tournament Director' ? (
                  <div className="flex h-64 w-96  flex-col  items-center justify-center rounded-t-lg bg-white p-3 shadow-xl">
                    <img
                      src="icons8-business-50.png"
                      alt="Person icon"
                      className="h-16 w-16"
                    />
                    <p className="text-4xl font-semibold">
                      Tournament Director
                    </p>
                    <p className="mt-2 text-center  text-xl">
                      For those looking to run competitions
                    </p>
                  </div>
                ) : (
                  <div
                    className="flex h-48 w-96 flex-col items-center justify-center bg-[#C4C4C4]/[.30] p-3 hover:h-64 hover:rounded-t-lg hover:bg-white"
                    onClick={() => setPricingToggleState('Tournament Director')}
                  >
                    <img
                      src="icons8-business-50.png"
                      alt="Person icon"
                      className="h-16 w-16"
                    />
                    <p className="text-4xl font-semibold">
                      Tournament Director
                    </p>
                    <p className="mt-2 text-center text-xl ">
                      For those looking to run competitions
                    </p>
                  </div>
                )}
                {pricingToggleState === 'Business' ? (
                  <div className="flex h-64 w-96  flex-col  items-center justify-center rounded-t-lg bg-white p-3 shadow-xl">
                    <img
                      src="icons8-company-64.png"
                      alt="Person icon"
                      className="h-16 w-16"
                    />
                    <p className="text-4xl font-semibold">Business</p>
                    <p className="mt-2 text-center text-xl ">
                      For those looking to organize at a larger scale
                    </p>
                  </div>
                ) : (
                  <div
                    className="flex h-48 w-96 flex-col items-center justify-center bg-[#C4C4C4]/[.30] p-3 hover:h-64 hover:rounded-t-lg hover:bg-white"
                    onClick={() => setPricingToggleState('Business')}
                  >
                    <img
                      src="icons8-company-64.png"
                      alt="Person icon"
                      className="h-16 w-16"
                    />
                    <p className="text-4xl font-semibold">Business</p>
                    <p className="mt-2 text-center text-xl">
                      For those looking to organize at a larger scale
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
