import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Division } from "@prisma/client";
import { Search } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "utils/trpc";
import { PartnerCard } from "./PartnerCard";
import { AppRouter } from "server/trpc/router/_app";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type InferredTournamentDataType = RouterOutputs["tournament"]["getTournament"];

type SignupModalProps = {
  divisionsPerDay: Array<Division[]>;
  tournamentData: InferredTournamentDataType;
};

export const SignupModal = ({
  divisionsPerDay,
  tournamentData,
}: SignupModalProps) => {
  const router = useRouter();
  const { tournamentId } = router.query;
  const tId: number = parseInt(tournamentId as string);
  const [playingDayOne, setPlayingDayOne] = useState(false);
  const [playingDayTwo, setPlayingDayTwo] = useState(false);
  const [playerOneName, setPlayerOneName] = useState("");
  const [playerTwoName, setPlayerTwoName] = useState("");
  const [partnerOneDivisionSelection, setPartnerOneDivisionSelection] =
    useState(0);
  const [partnerTwoDivisionSelection, setPartnerTwoDivisionSelection] =
    useState(0);
  const { data } = trpc.tournament.getTopFiveParnterResults.useQuery(
    { partner: playerOneName },
    { enabled: !!playerOneName },
  );
  const { data: data2 } = trpc.tournament.getTopFiveParnterResults.useQuery(
    { partner: playerTwoName },
    { enabled: !!playerTwoName },
  );
  useEffect(() => {
    console.log("Updated division selection", partnerOneDivisionSelection);
  }, [partnerOneDivisionSelection]);

  return (
    <Dialog>
      <DialogTrigger className="w-32 rounded-xl bg-white p-2 text-xl font-semibold">
        Sign Up
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Sign Up For {tournamentData?.tournament.name}
          </DialogTitle>
          <DialogDescription>
            Pick the dates you are wanting to play in
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start space-y-2">
          <div className="flex gap-4">
            <div className="flex space-x-2">
              <p>Day One</p>
              <input
                type="checkbox"
                name="dayOne"
                id="dayOne"
                onChange={() => setPlayingDayOne(!playingDayOne)}
              ></input>
            </div>
            {tournamentData.tournament.dayTwo ? (
              <div className="flex space-x-2">
                <p>Day Two</p>
                <input
                  type="checkbox"
                  name="dayTwo"
                  id="dayTwo"
                  onChange={() => setPlayingDayTwo(!playingDayTwo)}
                />
              </div>
            ) : null}
          </div>
          <div className="flex w-full flex-col">
            {playingDayOne ? (
              <div className="flex w-full flex-col">
                <label>Day One Partner</label>
                <div className="flex flex-row items-center justify-center pb-2">
                  <Search />
                  <Input
                    type="text"
                    className="border-transparent text-lg caret-violet-400 focus-visible:ring-transparent"
                    value={playerOneName}
                    onChange={(e) => setPlayerOneName(e.target.value)}
                    placeholder="Search for a partner"
                  ></Input>
                </div>
                <Separator className="bg-slate-400" />
                {data && (
                  <div className="w-full">
                    <p className="pt-1">
                      Found <span className="font-bold">{data.length}</span>{" "}
                      <span className="font-semibold">
                        {data.length === 1
                          ? "person"
                          : data.length > 1
                            ? "people"
                            : null}
                      </span>
                    </p>
                    {data.map((partner) => {
                      return (
                        <PartnerCard
                          key={partner.id}
                          partner={partner}
                          tournamentId={tId}
                          divisionSelections={divisionsPerDay[0]}
                          divisionSelected={partnerOneDivisionSelection}
                          setPartnerDivision={setPartnerOneDivisionSelection}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}
            {playingDayTwo ? (
              <div className="flex w-full flex-col pt-8">
                <label>Day Two Partner</label>
                <div className="flex flex-row items-center justify-center pb-2">
                  <Search />
                  <Input
                    type="text"
                    className="border-transparent text-lg caret-violet-400 focus-visible:ring-transparent"
                    value={playerTwoName}
                    onChange={(e) => setPlayerTwoName(e.target.value)}
                    placeholder="Search for a partner"
                  ></Input>
                </div>
                <Separator className="bg-slate-400" />
                {data2 && (
                  <div className="w-full">
                    <p className="pt-1">
                      Found <span className="font-bold">{data2.length}</span>{" "}
                      <span className="font-semibold">
                        {data2.length === 1
                          ? "person"
                          : data2.length > 1
                            ? "people"
                            : null}
                      </span>
                    </p>
                    {data2.map((partner) => {
                      return (
                        <PartnerCard
                          key={partner.id}
                          partner={partner}
                          tournamentId={tId}
                          divisionSelections={divisionsPerDay[1]}
                          divisionSelected={partnerTwoDivisionSelection}
                          setPartnerDivision={setPartnerTwoDivisionSelection}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
