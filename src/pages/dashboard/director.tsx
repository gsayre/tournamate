import { useSession } from "next-auth/react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

export default function Director() {
    const { data: session } = useSession();
    return (
        <div className="flex h-screen w-screen">
            <div className="flex h-full w-full flex-row">
                <Sidebar />
                <div className="flex h-full w-full flex-col ">
                    <TopBar />
                    <div className=" h-full w-full p-4">
                        {session?.user?.id ? (
                            <div className="rounded-md bg-white p-2">
                                Tournament Director Portal
                            </div>
                        ) : (
                            <div className="flex h-4/6 w-8/12 rounded-md bg-white p-2">
                                <form method="post" className="flex w-full flex-col">
                                    <div className="w-full p-4 text-center">
                                        <h1 className="text-5xl text-[#F24E1E] font-bold">
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
                                            />
                                        </label>
                                    </div>
                                    <div className="flex w-full justify-end p-4">
                                        <button
                                            type="submit"
                                            className="h-14 w-32 rounded-full bg-[#2196F3] text-xl font-bold"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                    <input type='hidden' name='profile-id' value={session?.user?.id} />
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}