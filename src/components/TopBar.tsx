/* eslint-disable @next/next/no-img-element */
import { trpc } from "../utils/trpc";

export default function TopBar(props: any) {
  const toggleTDStatus = trpc.user.toggleTournamentDirectorRole.useMutation();
  const toggleAdminStatus = trpc.user.toggleAdminRole.useMutation();

  return (
    <div className="flex w-full flex-col bg-white">
      <div className="flex h-24 w-full flex-row items-center justify-between pl-4 shadow-md">
        <div className="flex h-12 w-96 items-center rounded-md bg-[#F3F4F6] p-2 pl-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 30 30"
            width="30px"
            height="30px"
            className="h-6 fill-black"
          >
            <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
          </svg>
          <p className="pl-4 text-xl font-bold">Search...</p>
        </div>
        <div className="flex h-full flex-row items-center pr-2">
          {/* {session?.user?.id === "cl9vnga1u0000vkykypjqp51g" && (
            <>
              <div className="flex h-full items-center justify-center border-l-2 px-4">
                <button
                  className="h-14 rounded-3xl bg-[#2196F3] p-2 text-xl font-semibold"
                  onClick={() =>
                    toggleTDStatus.mutate(
                      { userId: session?.user?.id as string },
                      { onSuccess: () => window.location.reload() }
                    )
                  }
                >
                  Toggle TD Status
                </button>
              </div>
              <div className="flex h-full items-center justify-center border-l-2 px-4">
                <button
                  className="h-14 rounded-3xl bg-[#F24E1E] p-2 text-xl font-semibold"
                  onClick={() =>
                    toggleAdminStatus.mutate(
                      { userId: session?.user?.id as string },
                      { onSuccess: () => window.location.reload() }
                    )
                  }
                >
                  Toggle Admin Status
                </button>
              </div>
            </>
          )} */}
          <div className="flex h-full items-center justify-center border-l-2 px-4">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                width="50px"
                height="50px"
                className="h-10 w-10 fill-black"
              >
                <path d="M 25 6 C 13.526286 6 4 13.7136 4 23.4375 C 4 29.610949 8.0052576 35.336806 14.298828 38.4375 A 1.0001 1.0001 0 0 0 14.298828 38.439453 C 14.321498 38.450593 14.316721 38.431551 14.306641 38.462891 C 14.026044 39.334531 13.083785 41.111046 12.175781 42.433594 A 1.0001 1.0001 0 0 0 13.294922 43.955078 C 15.7364 43.202868 18.266937 41.809598 19.787109 40.328125 C 19.787109 40.328125 19.789062 40.328125 19.789062 40.328125 C 20.69854 40.522027 21.624358 40.657425 22.554688 40.748047 C 24.946035 42.758366 28.247811 43.990234 31.841797 43.990234 C 33.013255 43.990234 34.188265 43.852989 35.337891 43.585938 C 36.384344 44.315325 37.521711 44.58987 38.572266 44.947266 A 1.0001 1.0001 0 0 0 39.742188 43.466797 C 39.384102 42.897562 39.169632 42.658155 38.972656 42.199219 C 42.649396 40.192133 44.947266 36.757832 44.947266 32.994141 C 44.947266 31.954794 44.763855 30.958201 44.447266 30.011719 C 45.441687 27.986624 46 25.763454 46 23.4375 C 46 13.7136 36.473714 6 25 6 z M 25 8 C 35.582286 8 44 15.0334 44 23.4375 C 44 24.888208 43.73741 26.284543 43.273438 27.617188 C 41.009817 24.24087 36.692775 22 31.841797 22 C 24.718957 22 18.736328 26.826273 18.736328 32.994141 C 18.736328 34.980576 19.36404 36.824024 20.443359 38.416016 C 20.361743 38.399548 20.278581 38.388465 20.197266 38.371094 A 1.0001 1.0001 0 0 0 20.191406 38.369141 C 20.064341 38.342981 19.927545 38.326172 19.78125 38.326172 C 19.264833 38.326172 18.765808 38.535031 18.398438 38.892578 A 1.0001 1.0001 0 0 0 18.396484 38.892578 C 17.701332 39.571005 16.505944 40.294461 15.214844 40.947266 C 15.543019 40.304953 16.038305 39.611017 16.210938 39.074219 C 16.512716 38.134058 16.070064 37.081797 15.181641 36.644531 C 9.4592628 33.825224 6 28.744051 6 23.4375 C 6 15.0334 14.417714 8 25 8 z M 31.841797 24 C 38.068957 24 42.947266 28.140009 42.947266 32.994141 C 42.947266 35.969675 41.145727 38.76769 37.958984 40.482422 A 1.0001 1.0001 0 0 0 37.957031 40.484375 C 37.326022 40.824847 37.074008 41.499264 37.072266 42.189453 C 36.896198 42.102293 36.592201 42.04088 36.447266 41.9375 A 1.0001 1.0001 0 0 0 36.445312 41.935547 C 36.12793 41.710906 35.739477 41.583984 35.345703 41.583984 C 35.199513 41.583984 35.052625 41.601246 34.910156 41.634766 C 33.901002 41.871228 32.868502 41.990234 31.841797 41.990234 C 25.614637 41.990234 20.736328 37.848273 20.736328 32.994141 C 20.736421 28.140011 25.614637 24 31.841797 24 z M 26.703125 31.056641 A 1.976 1.976 0 1 0 26.703125 35.007812 A 1.976 1.976 0 1 0 26.703125 31.056641 z M 32.236328 31.056641 A 1.976 1.976 0 1 0 32.236328 35.007812 A 1.976 1.976 0 1 0 32.236328 31.056641 z M 37.769531 31.056641 A 1.976 1.976 0 1 0 37.769531 35.007812 A 1.976 1.976 0 1 0 37.769531 31.056641 z" />
              </svg>
            </button>
          </div>
          <div className="flex h-full items-center justify-center border-l-2 px-4">
            <button>
              <img
                src="/icons/icons8-bell-24.png"
                alt=""
                className="h-10 w-10"
              />
            </button>
          </div>
          <div className="flex h-full flex-row items-center space-x-3 border-l-2 p-2 pl-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2196F3]">
              {/* {splitName(session?.user?.name)} */}
            </div>
            {/* <p className="text-2xl font-semibold">{session?.user?.name}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export function splitName(name: string | null | undefined): string {
  if (!name) return "";
  const names = name.split(" ");
  return names[0]?.charAt(0) + " " + names[1]?.charAt(0);
}
