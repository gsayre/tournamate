/* eslint-disable @next/next/no-img-element */
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { Division } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import Sidebar from "../../../../components/Sidebar";
import TopBar from "../../../../components/TopBar";
import { trpc } from "../../../../utils/trpc";

export async function getServerSideProps(context: any) {
  const { userId } = getAuth(context.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }
  return { props: { ...buildClerkProps(context.req) } };
}

export default function TournamentView() {
  const router = useRouter();
  const { tournamentId } = router.query;
  const tId: number = parseInt(tournamentId as string);
  const tournamentData = trpc.tournament.getTournament.useQuery({
    id: tId,
  }).data;
  const divisionData = trpc.tournament.getDivisions.useQuery({
    tournamentId: tId,
  }).data;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {modalOpen ? (
        <SignupModal setModalOpen={setModalOpen} />
      ) : (
        <div className="flex h-screen w-screen">
          <div className="flex h-full w-full flex-row">
            <Sidebar />
            <div className="flex h-full w-full flex-col ">
              <TopBar />
              <div className=" h-full w-full p-4">
                <div>
                  <p className="text-2xl text-gray-500">
                    {tournamentData?.tournament.name}
                  </p>
                  <button
                    className="rounded bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
                    onClick={() => setModalOpen(true)}
                  >
                    Sign Up
                  </button>
                </div>

                {divisionData &&
                  divisionData.map((division) => {
                    return (
                      <DivisionAccordian
                        division={division}
                        key={division.name + division.type}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

type divAccordianProps = {
  division: Division;
};

const DivisionAccordian = (props: divAccordianProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div
      className="flex h-fit w-5/6 flex-col odd:bg-[#5BA6A1] even:bg-[#374C64] text-white"
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      <div className="flex h-fit flex-row items-center space-x-4 p-2">
        {isOpen ? (
          <img
            src="/icons/icons8-triangle-arrow-24.png"
            alt="arrow"
            className="h-4 w-4 fill-white"
          />
        ) : (
          <img
            src="/icons/icons8-triangle-arrow-24.png"
            alt="arrow"
            className="h-4 w-4 -rotate-90"
          />
        )}
        <p className="text-2xl font-semibold">{props.division.name}</p>
      </div>

      {isOpen && (
        <div className="flex w-full flex-col bg-white p-4 text-black">
          <div className="flex flex-col">
            <p className="pb-2 text-2xl">Pools</p>
            <div className="flex flex-row space-x-4">
              <PoolTable />
              <PoolTable />
              <PoolTable />
              <PoolTable />
            </div>
          </div>
          <div className="flex flex-col pt-4">
            <p className="pb-2 text-2xl">Bracket</p>
          </div>
        </div>
      )}
    </div>
  );
};

const PoolTable = (props: any) => {
  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-slate-200">
      <div className="w-full text-center bg-green-500 rounded-t-xl">Header</div>
      <div>Team 1</div>
      <div>Team 2</div>
      <div>Team 3</div>
      <div>Team 4</div>
    </div>
  );
}
type SignupModalProps = {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const SignupModal: React.FC<SignupModalProps> = ({ setModalOpen }) =>  {
  const [signupData, setSignupData] = useState({
    daysToPlay:'',
  });

  return(
    <div className="absolute inset-0 flex items-center justify-center bg-black/75">
      <div className="flex w-10/12 flex-col space-y-4 bg-white p-4">
        <p className="text-2xl font-semibold">Sign Up</p>
        <div>
        <label >
            Which day would you like to play?
          </label>
        <select
          name="type"
          id="type"
          className="border-2"
          onChange={(e) =>
            setSignupData({
              ...signupData,
              daysToPlay: e.target.value,
            })
          }
        >
          
          <option value={'1'}>Day One</option>
          <option value={'2'}>Day Two</option>
          <option value={'B'}>Both</option>
        </select>
        {}
        </div>
        <button
            onClick={() => setModalOpen(false)}
            className="h-10 w-28 rounded-3xl bg-red-500 p-2 text-xl font-semibold text-white hover:bg-red-600"
          >
            Cancel
          </button>
      </div>
    </div>
  )
}
