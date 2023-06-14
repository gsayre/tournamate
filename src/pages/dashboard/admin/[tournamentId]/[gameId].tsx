import { useRouter } from "next/router";
import { useState } from "react";

export default function RefView() {
  const router = useRouter();
  const [explanationStep, setExplanationStep] = useState(1);
  const [teamScored, setTeamScored] = useState(0);
  const [pointNature, setPointNature] = useState("");

  return (
    <div className="flex h-screen w-screen flex-col">
      <button
        onClick={() => {
          router.back();
        }}
      >
        Go Back
      </button>
      <div className="flex h-full w-full flex-row justify-center">
        {explanationStep === 1 ? (
          <>
            <ScoreCard
              score={0}
              teamOne={["Player One", "Player Two"]}
              teamTwo={["Player Three", "Player Four"]}
              teamNum={1}
              teamScored={teamScored}
              explanationStep={explanationStep}
              setExplanationStep={setExplanationStep}
              setTeamScored={setTeamScored}
            />
            <ScoreCard
              score={0}
              teamOne={["Player One", "Player Two"]}
              teamTwo={["Player Three", "Player Four"]}
              teamNum={2}
              teamScored={teamScored}
              explanationStep={explanationStep}
              setExplanationStep={setExplanationStep}
              setTeamScored={setTeamScored}
            />
          </>
        ) : explanationStep === 2 ? (
          <PointExplanationOne
            explanationStep={explanationStep}
            setExplanationStep={setExplanationStep}
            setPointNature={setPointNature}
          />
        ) : (
          <PointExplanationTwo
            setExplanationStep={setExplanationStep}
            setTeamScored={setTeamScored}
            setPointNature={setPointNature}
            pointNature={pointNature}
            teamNum={teamScored}
            teamOne={["Player One", "Player Two"]}
            teamTwo={["Player Three", "Player Four"]}
          />
        )}
      </div>
    </div>
  );
}

type ScoreCardProps = {
  score: number;
  teamOne: string[];
  teamTwo: string[];
  teamNum: number;
  explanationStep: number;
  teamScored: number;
  setExplanationStep: React.Dispatch<React.SetStateAction<number>>;
  setTeamScored: React.Dispatch<React.SetStateAction<number>>;
};

function ScoreCard({
  score,
  teamNum,
  teamOne,
  teamTwo,
  explanationStep,
  setExplanationStep,
  teamScored,
  setTeamScored
}: ScoreCardProps) {
  return (
    <div
      className={`${
        teamNum === 1 ? "bg-red-600" : "bg-blue-600"
      } flex h-full w-full flex-col justify-center space-y-8 text-center cursor-pointer`}
      onClick={() => {
        setTeamScored(teamNum);
        setExplanationStep(explanationStep + 1);
      }}
    >
      <p className="text-9xl font-bold">{score}</p>
      { teamScored === 1 ? <p className="text-red-100">Serving</p> : null}
      <div className="flex flex-row justify-center space-x-2 text-3xl font-light">
        {teamNum == 1 ? <p>{teamOne[0]}</p> : <p>{teamTwo[0]}</p>}
        <p>-</p>
        {teamNum == 1 ? <p>{teamOne[1]}</p> : <p>{teamTwo[1]}</p>}
      </div>
    </div>
  );
}

type PointExplanationProps = {
  explanationStep: number;
  setExplanationStep: React.Dispatch<React.SetStateAction<number>>;
  setPointNature: React.Dispatch<React.SetStateAction<string>>;
};

function PointExplanationOne({
  explanationStep,
  setExplanationStep,
  setPointNature
}: PointExplanationProps) {
  return (
    <div className="flex flex-col justify-center space-y-16 text-center">
      <p className="text-9xl font-bold">Reason</p>
      <div className="flex flex-row space-x-4">
        <button
          onClick={() => {
            setPointNature("Negative")
            setExplanationStep(explanationStep + 1);
          }}
          className="font-semibold bg-red-500 p-4 text-3xl text-white rounded-full w-56"
        >
          Hitting Error
        </button>
        <button
        className="font-semibold bg-red-500 p-4 text-3xl text-white rounded-full w-56"
          onClick={() => {
            setPointNature("Negative")
            setExplanationStep(explanationStep + 1);
          }}
        >
          Service Error
        </button>
        <button
          onClick={() => {
            setPointNature("Positive")
            setExplanationStep(explanationStep + 1);
          }}
          className="font-semibold bg-green-500 p-4 text-3xl text-white rounded-full w-56"
        >
          Service Ace
        </button>
        <button
          onClick={() => {
            setPointNature("Positive")
            setExplanationStep(explanationStep + 1);
          }}
          className="font-semibold bg-green-500 p-4 text-3xl text-white rounded-full w-56"
        >
          Block
        </button>
        <button
          onClick={() => {
            setPointNature("Positive")
            setExplanationStep(explanationStep + 1);
          }}
          className="font-semibold bg-green-500 p-4 text-3xl text-white rounded-full w-56"
        >
          Kill
        </button>
      </div>
    </div>
  );
}

type PointExplanationTwoProps = {
  setExplanationStep: React.Dispatch<React.SetStateAction<number>>;
  setTeamScored: React.Dispatch<React.SetStateAction<number>>;
  setPointNature: React.Dispatch<React.SetStateAction<string>>;
  teamNum: number;
  pointNature: string;
  teamOne: string[];
  teamTwo: string[];
};

function PointExplanationTwo({
  setExplanationStep,
  setTeamScored,
  setPointNature,
  pointNature,
  teamNum,
  teamOne,
  teamTwo,
}: PointExplanationTwoProps) {
  return (
    <div className="flex flex-col justify-center space-y-16 text-center">
      <p className="text-9xl font-bold">Reason</p>
      <div className="flex flex-row space-x-4">
        <button
          onClick={() => {
            setTeamScored(0)
            setPointNature("")
            setExplanationStep(1);
          }}
          className="font-semibold bg-red-500 p-4 text-3xl text-white rounded-full w-56"
        >
          {teamNum === 1 && pointNature === "Positive" ? teamOne[0] : null}
          {teamNum === 1 && pointNature === "Negative" ? teamTwo[0] : null}
          {teamNum === 2 && pointNature === "Positive" ? teamTwo[0] : null}
          {teamNum === 2 && pointNature === "Negative" ? teamOne[0] : null}
        </button>
        <button
        className="font-semibold bg-red-500 p-4 text-3xl text-white rounded-full w-56"
          onClick={() => {
            setTeamScored(0)
            setPointNature("")
            setExplanationStep(1);
          }}
        >
          {teamNum === 1 && pointNature === "Positive" ? teamOne[1] : null}
          {teamNum === 1 && pointNature === "Negative" ? teamTwo[1] : null}
          {teamNum === 2 && pointNature === "Positive" ? teamTwo[1] : null}
          {teamNum === 2 && pointNature === "Negative" ? teamOne[1] : null}
        </button>
      </div>
    </div>
  );
}
