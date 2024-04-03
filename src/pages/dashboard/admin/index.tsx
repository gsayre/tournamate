import { FC, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import TopBar from "../../../components/TopBar";
import { trpc } from "../../../utils/trpc";
import { Format, Tournament, Type } from "@prisma/client";
import Link from "next/link";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { useAuth } from "@clerk/nextjs";
import type { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
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

export default function Admin() {
  return (
    <div className="flex h-screen w-screen">
      <div className="flex h-full w-full flex-row">
        <div className="flex h-full w-full flex-col ">
          <TopBar />
          <div className=" h-full w-full  p-4">
            <CorrectPannel />
          </div>
        </div>
      </div>
    </div>
  );
}

const CorrectPannel = () => {
  const userData = trpc.user.getUserRoles.useQuery();
  if (userData.data?.isAdmin) {
    return <AdminPannel />;
  } else if (userData.data?.isTournamentDirector) {
    return <TournamentDirectorPannel />;
  } else {
    return <TournamentDirectorApplication />;
  }
};

const AdminPannel = () => {
  const tdRequests = trpc.user.getTournamentDirectorRequests.useQuery();
  const { userId } = useAuth()
  const TDUsername = trpc.user.findUsername.useQuery({
    id: userId as string,
  });
  const approveTDRequest =
    trpc.user.approveTournamentDirectorRequest.useMutation();
  const denyTDRequest = trpc.user.denyTournamentDirectorRequest.useMutation();

  return (
    <div className="flex h-full w-full flex-col rounded-md bg-white p-4">
      <h1 className="text-3xl font-bold pb-4">Admin Portal</h1>
      <div className="flex flex-col pt-4">
        <p className="text-xl pb-2 font-semibold">Tournament Director Requests</p>
        {tdRequests.data && tdRequests.data?.length > 0 ? (tdRequests.data?.map((request) => (
          <div
            key={request.tdRequestId}
            className="flex w-full flex-col  space-x-4 rounded-md bg-white p-4 drop-shadow-lg"
          >
            <p className="text-2xl font-semibold">{TDUsername.data}</p>
            <div className="flex flex-col pt-2">
              <p className="text-lg">{request.content}</p>
              <div className="flex flex-row justify-end pt-2">
                <button
                  className="h-10 w-28 rounded-3xl bg-green-500 p-2 text-xl font-semibold text-white"
                  onClick={() =>
                    approveTDRequest.mutate(
                      { userId: request.profileId },
                      { onSuccess: () => tdRequests.refetch() }
                    )
                  }
                >
                  Approve
                </button>
                <button
                  className="h-10 w-28 rounded-3xl bg-red-500 p-2 text-xl font-semibold text-white"
                  onClick={() =>
                    denyTDRequest.mutate(
                      { userId: request.profileId },
                      { onSuccess: () => tdRequests.refetch() }
                    )
                  }
                >
                  Deny
                </button>
              </div>
            </div>
          </div>
        ))) : (<p className="indent-4 font-normal">No requests...</p>)}
      </div>
    </div>
  );
};

const TournamentDirectorPannel = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const ownedTournaments = trpc.tournament.getOwnedTournaments.useQuery();
  return (
    <>
      {modalOpen ? (
        <TournamentCreationModal setModalOpen={setModalOpen} />
      ) : (
        <div className="flex h-full w-full flex-col rounded-md bg-white p-4">
          <h1 className="text-3xl font-bold">Tournament Director Portal</h1>
          <div className="flex flex-col pt-8">
            <h1 className="text-xl font-semibold">
              Your Tournament Statistics
            </h1>
            <div className="flex flex-row space-x-8 pt-2">
              <div className="flex flex-col bg-white p-4 drop-shadow-lg">
                <div className="flex">
                  <h1 className="text-xl font-semibold">Tournament Name</h1>
                </div>
                <div className="flex flex-row space-x-8">
                  <p>Average Number of Players</p>
                  <p>Tournament Rating</p>
                  <p>Cash Flow Statistics</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col pt-8">
            <h1 className="text-xl font-semibold">Your Upcoming Tournaments</h1>
            <div className="flex flex-row space-x-8 pt-2">
              {ownedTournaments.data
                ?.filter(isNotPastCurrentDate)
                .map((tournament) => (
                  <TournamentCard
                    key={tournament.tournamentId}
                    tournament={tournament}
                  />
                ))}
              <AddTournamentCard setModalOpen={setModalOpen} />
            </div>
          </div>
          <div className="flex flex-col pt-8">
            <h1 className="text-xl font-semibold">Your Finished Tournaments</h1>
            <div className="flex flex-row space-x-8 pt-2">
              {ownedTournaments.data
                ?.filter(isPastCurrentDate)
                .map((tournament) => (
                  <TournamentCard
                    key={tournament.tournamentId}
                    tournament={tournament}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function isPastCurrentDate(tournament: Tournament) {
  if (tournament.dayTwo && tournament.dayTwoDate) {
    return (
      tournament.dayTwoDate.toDateString() > new Date().toDateString()
    );
  } else {
    console.log(tournament.dayOneDate.toDateString());
    return (
      tournament.dayOneDate.toDateString() > new Date().toDateString()
    );
  }
}

function isNotPastCurrentDate(tournament: Tournament) {
  if (tournament.dayTwo && tournament.dayTwoDate) {
    return (
      tournament.dayTwoDate.toDateString() < new Date().toDateString()
    );
  } else {
    return (
      tournament.dayOneDate.toDateString() < new Date().toDateString()
    );
  }
}

const TournamentDirectorApplication = () => {
  const [formContent, setFormContent] = useState<string>("");
  const submitTDRequest =
    trpc.user.createTournamentDirectorRequest.useMutation();
  const { userId } = useAuth();
  return (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-white p-2">
      <form method="post" className="flex w-8/12 flex-col" id="TDForm">
        <div className="w-full p-4 text-center">
          <h1 className="text-5xl font-bold text-[#F24E1E]">
            Tournament Director Application
          </h1>
        </div>
        <div className="w-full p-4">
          <label htmlFor="content" className="flex flex-col">
            <p className="mb-4 text-3xl">
              Why would you like to be a tournament director?
            </p>
            <textarea
              className="h-96 rounded-lg p-4 text-2xl outline outline-1 outline-stone-300 drop-shadow-lg"
              name="content"
              onChange={(e) => setFormContent(e.target.value)}
            />
          </label>
        </div>
        <div className="flex w-full justify-end p-4">
          <button
            type="submit"
            className="h-14 w-32 rounded-full bg-[#2196F3] text-xl font-bold"
            onClick={() =>
              submitTDRequest.mutate({
                userId: userId as string,
                content: formContent,
              })
            }
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

interface tournamentCardProps {
  tournament: Tournament;
}

const TournamentCard = (props: tournamentCardProps) => {
  return (
    <Link href={`./admin/${props.tournament.tournamentId}`}>
      <div className="flex h-72 w-56 flex-col  space-x-4 rounded-md bg-white p-4 drop-shadow-lg">
        <div className="flex h-full flex-col p-2">
          <p className="text-2xl font-semibold">{props.tournament.name}</p>
          <div className="flex h-full flex-col space-y-2 pt-2">
            <div className="flex flex-col h-full">
              {props.tournament.dayTwo ? (
                <>
                  <p>
                    {props.tournament.dayOneDate.toDateString() +
                      " - " +
                      props.tournament.dayTwoDate?.toDateString()}
                  </p>
                </>
              ) : (
                <>{props.tournament.dayOneDate.toDateString()}</>
              )}
            </div>
            <div className="flex flex-row justify-end pt-4">
              <button className="h-10 w-28 rounded-3xl bg-green-500 p-2 text-xl font-semibold text-white">
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface ATCProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const AddTournamentCard: FC<ATCProps> = ({ setModalOpen }) => {
  return (
    <div
      className="flex w-56 h-72 flex-col items-center justify-center rounded-md border-2 border-dashed border-black/20 bg-black/5 p-4 drop-shadow-lg hover:bg-black/10"
      onClick={() => setModalOpen(true)}
    >
      <div className="-mt-6 -mr-2 flex flex-col">
        <div className="h-12 w-2 bg-white" />
        <div className="-mt-7 -ml-5 h-2 w-12 bg-white" />
      </div>
    </div>
  );
};

interface TCMModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

type TournamentDataObject = Pick<
  Tournament,
  | "name"
  | "type"
  | "dayOne"
  | "dayTwo"
  | "dayOneFormat"
  | "dayTwoFormat"
  | "location"
  | "tournamentDirectorId"
  | "dayOneDate"
  | "dayTwoDate"
>;

type AddressData = {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

const TournamentCreationModal: FC<TCMModalProps> = ({ setModalOpen }) => {
  const [addressData, setAddressData] = useState<AddressData>({
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [tournamentData, setTournamentData] = useState<TournamentDataObject>({
    name: "",
    type: Type.GRASS,
    dayOne: true,
    dayTwo: false,
    dayOneFormat: Format.SAME_SEX_DOUBLES,
    dayTwoFormat: Format.REVERSE_COED_DOUBLES,
    location: "",
    tournamentDirectorId: "",
    dayOneDate: new Date(),
    dayTwoDate: new Date(),
  });

  const createTournament = trpc.tournament.createTournament.useMutation();
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/75">
      <div className="flex w-10/12 flex-col space-y-4 bg-white p-4">
        <h1>Create your tournament!</h1>
        <label htmlFor="tournament-name">Tournament Name</label>
        <input
          type={"text"}
          id="tournament-name"
          placeholder={"Tournament Name"}
          className="border-2"
          onChange={(e) =>
            setTournamentData({ ...tournamentData, name: e.target.value })
          }
        />
        <select
          name="type"
          id="type"
          className="border-2"
          onChange={(e) =>
            setTournamentData({
              ...tournamentData,
              type: e.target.value as Type,
            })
          }
        >
          <option value={Type.NONE}>
            Please select the type of tournament
          </option>
          <option value={Type.GRASS}>Grass</option>
          <option value={Type.SAND}>Sand</option>
          <option value={Type.INDOOR}>Indoor</option>
        </select>
        <div className="flex flex-row space-x-4">
          <fieldset>
            <legend>How many days will you tournament happen?</legend>
            <label htmlFor="tournament-duration-one-day">One Day</label>
            <input
              type="radio"
              name="tournament-duration"
              id="tournament-duration-one-day"
              value="1"
              className=""
              defaultChecked
              onChange={() =>
                setTournamentData({
                  ...tournamentData,
                  dayOne: true,
                  dayTwo: false,
                })
              }
            />
            <label htmlFor="tournament-duration-two-day">Two Days</label>
            <input
              type="radio"
              name="tournament-duration"
              id="tournament-duration-two-day"
              value="2"
              className=""
              onChange={() =>
                setTournamentData({
                  ...tournamentData,
                  dayOne: true,
                  dayTwo: true,
                })
              }
            />
          </fieldset>
        </div>
        {tournamentData.dayTwo ? (
          <>
            <label htmlFor="start">Start date:</label>
            <input
              type="date"
              id="start"
              className="h-10 w-40 border-2"
              onChange={(e) =>
                setTournamentData({
                  ...tournamentData,
                  dayOneDate: new Date(
                    e.target.value.split("-")[0] +
                      "-" +
                      e.target.value.split("-")[1] +
                      "-" +
                      (Number(e.target.value.split("-")[2]) + 1).toString()
                  ),
                })
              }
            />
            <label htmlFor="end">End date:</label>
            <input
              type="date"
              id="end"
              className="h-10 w-40 border-2"
              onChange={(e) =>
                setTournamentData({
                  ...tournamentData,
                  dayTwoDate: new Date(
                    e.target.value.split("-")[0] +
                      "-" +
                      e.target.value.split("-")[1] +
                      "-" +
                      (Number(e.target.value.split("-")[2]) + 1).toString()
                  ),
                })
              }
            />
            <select
              name="format-day-one"
              id="format-day-one"
              className="border-2"
              onChange={(e) =>
                setTournamentData({
                  ...tournamentData,
                  dayOneFormat: e.target.value as Format,
                })
              }
            >
              <option value={Format.NONE}>
                Please select your day one format
              </option>
              <option value={Format.SAME_SEX_DOUBLES}>Same Sex Doubles</option>
              <option value={Format.COED_DOUBLES}>COED Doubles</option>
              <option value={Format.SAME_SEX_SIXES}>Same Sex Sixes</option>
              <option value={Format.COED_SIXES}>COED Sixes</option>
              <option value={Format.REVERSE_COED_QUADS}>Revco Quads</option>
              <option value={Format.SAME_SEX_TRIPLES}>Same Sex Triples</option>
              <option value={Format.REVERSE_COED_DOUBLES}>Revco Doubles</option>
            </select>
            <select
              name="format-day-two"
              id="format-day-two"
              className="border-2"
              onChange={(e) =>
                setTournamentData({
                  ...tournamentData,
                  dayTwoFormat: e.target.value as Format,
                })
              }
            >
              <option value={Format.NONE}>
                Please select your day two format
              </option>
              <option value={Format.SAME_SEX_DOUBLES}>Same Sex Doubles</option>
              <option value={Format.COED_DOUBLES}>COED Doubles</option>
              <option value={Format.SAME_SEX_SIXES}>Same Sex Sixes</option>
              <option value={Format.COED_SIXES}>COED Sixes</option>
              <option value={Format.REVERSE_COED_QUADS}>Revco Quads</option>
              <option value={Format.SAME_SEX_TRIPLES}>Same Sex Triples</option>
              <option value={Format.REVERSE_COED_DOUBLES}>Revco Doubles</option>
            </select>
          </>
        ) : (
          <>
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              className="h-10 w-40 border-2"
              onChange={(e) =>
                setTournamentData({
                  ...tournamentData,
                  dayOneDate: new Date(
                    e.target.value.split("-")[0] +
                      "-" +
                      e.target.value.split("-")[1] +
                      "-" +
                      (Number(e.target.value.split("-")[2]) + 1).toString()
                  ),
                })
              }
            />
            <select
              name="format"
              id="format"
              className="border-2"
              onChange={(e) =>
                setTournamentData({
                  ...tournamentData,
                  dayOneFormat: e.target.value as Format,
                })
              }
            >
              <option value={Format.NONE}>Please select your format</option>
              <option value={Format.SAME_SEX_DOUBLES}>Same Sex Doubles</option>
              <option value={Format.COED_DOUBLES}>COED Doubles</option>
              <option value={Format.SAME_SEX_SIXES}>Same Sex Sixes</option>
              <option value={Format.COED_SIXES}>COED Sixes</option>
              <option value={Format.REVERSE_COED_QUADS}>Revco Quads</option>
              <option value={Format.SAME_SEX_TRIPLES}>Same Sex Triples</option>
              <option value={Format.REVERSE_COED_DOUBLES}>Revco Doubles</option>
            </select>
          </>
        )}
        <label htmlFor="address">Street Address</label>
        <input
          type="text"
          id="address"
          placeholder="Street Address"
          className="border-2"
          onChange={(e) =>
            setAddressData({ ...addressData, streetAddress: e.target.value })
          }
        />
        <label htmlFor="address">City</label>
        <input
          type="text"
          id="city"
          placeholder="city"
          className="border-2"
          onChange={(e) =>
            setAddressData({ ...addressData, city: e.target.value })
          }
        />
        <label htmlFor="address">State</label>
        <input
          type="text"
          id="state"
          placeholder="State"
          className="border-2"
          onChange={(e) =>
            setAddressData({ ...addressData, state: e.target.value })
          }
        />
        <label htmlFor="address">Zip Code</label>
        <input
          type="text"
          id="zip"
          placeholder="Zip Code"
          className="border-2"
          onChange={(e) =>
            setAddressData({ ...addressData, zipCode: e.target.value })
          }
        />
        <label htmlFor="address">Country</label>
        <input
          type="text"
          id="country"
          placeholder="Country"
          className="border-2"
          onChange={(e) =>
            setAddressData({ ...addressData, country: e.target.value })
          }
        />
        <div className="flex flex-row justify-end">
          <button
            onClick={() => {
              tournamentData.location = formatAddress(
                addressData.streetAddress,
                addressData.city,
                addressData.state,
                addressData.zipCode,
                addressData.country
              );
              createTournament.mutate(tournamentData, {
                onSuccess: () => setModalOpen(false),
              });
            }}
            className="h-10 w-28 rounded-3xl bg-green-500 p-2 text-xl font-semibold text-white"
          >
            Submit
          </button>
          <button
            onClick={() => setModalOpen(false)}
            className="h-10 w-28 rounded-3xl bg-red-500 p-2 text-xl font-semibold text-white hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

function formatAddress(
  address: string,
  city: string,
  state: string,
  zip: string,
  country: string
) {
  return `${address}, ${city}, ${state} ${zip}, ${country}`;
}
