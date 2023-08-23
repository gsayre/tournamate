import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "utils/trpc";

export default function RefView() {
  const router = useRouter();
  const { gameId } = router.query;
  const gId: number = parseInt(gameId as string);
  const gameAndScore = trpc.tournament.getGameAndScore.useQuery({
    gameId: gId,
  }).data?.gameAndScore;
  let teamOneScore: number | null = 0, teamTwoScore: number | null = 0, scoreCap: number| null = 0;
  if (gameAndScore) {
    switch (gameAndScore.currentSet) {
      case 1: {
        teamOneScore = gameAndScore.gameOneTeamOneScore;
        teamTwoScore = gameAndScore.gameOneTeamTwoScore;
        scoreCap = gameAndScore.gameOneScoreCap;
        break;
      }
      case 2: {
        teamOneScore = gameAndScore.gameTwoTeamOneScore;
        teamTwoScore = gameAndScore.gameTwoTeamTwoScore;
        scoreCap = gameAndScore.gameTwoScoreCap;
        break;
      }
      case 3: {
        teamOneScore = gameAndScore.gameThreeTeamOneScore;
        teamTwoScore = gameAndScore.gameThreeTeamTwoScore;
        scoreCap = gameAndScore.gameThreeScoreCap;
        break;
      }
    }
  }

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
        {explanationStep === 1 &&
        gameAndScore?.teams[0].Team.players &&
        gameAndScore?.teams[1].Team.players ? (
          <>
              <ScoreCard
                gameId={gameAndScore.gameId}
              score={teamOneScore}
              teamOne={[
                gameAndScore?.teams[0].Team.players[0].user.fullName,
                gameAndScore?.teams[0].Team.players[1].user.fullName,
                ]}
                teamOneId={gameAndScore.teams[0].teamId}
              teamTwo={[
                gameAndScore?.teams[1].Team.players[0].user.fullName,
                gameAndScore?.teams[1].Team.players[1].user.fullName,
                ]}
                teamTwoId={gameAndScore.teams[1].teamId}
              teamNum={1}
              teamScored={teamScored}
              explanationStep={explanationStep}
              setExplanationStep={setExplanationStep}
            />
              <ScoreCard
                gameId={gameAndScore.gameId}
              score={teamTwoScore}
              teamOne={[
                gameAndScore?.teams[0].Team.players[0].user.fullName,
                gameAndScore?.teams[0].Team.players[1].user.fullName,
                ]}
                teamOneId={gameAndScore.teams[0].teamId}
              teamTwo={[
                gameAndScore?.teams[1].Team.players[0].user.fullName,
                gameAndScore?.teams[1].Team.players[1].user.fullName,
                ]}
                teamTwoId={gameAndScore.teams[1].teamId}
              teamNum={2}
              teamScored={teamScored}
              explanationStep={explanationStep}
              setExplanationStep={setExplanationStep}
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
  gameId: number,
  score: number | null;
  teamOneId: number;
  teamOne: string[];
  teamTwoId: number;
  teamTwo: string[];
  teamNum: number;
  explanationStep: number;
  teamScored: number;
  setExplanationStep: React.Dispatch<React.SetStateAction<number>>;
};

function ScoreCard({
  gameId,
  score,
  teamNum,
  teamOne,
  teamOneId,
  teamTwo,
  teamTwoId,
  explanationStep,
  setExplanationStep,
  teamScored,
}: ScoreCardProps) {
  const addPointToGame = trpc.tournament.addPointToGame.useMutation()
  const teamToPass:number = teamNum ===1 ? teamOneId : teamTwoId
  return (
    <div
      className={`${
        teamNum === 1 ? "bg-red-600" : "bg-blue-600"
      } flex h-full w-full cursor-pointer flex-col justify-center space-y-8 text-center`}
      onClick={() => {
        addPointToGame.mutate({
          teamNum: teamNum,
          gameId: gameId
        })
        setExplanationStep(explanationStep + 1);
      }}
    >
      <p className="text-9xl font-bold">{score}</p>
      {teamScored === 1 ? <p className="text-red-100">Serving</p> : null}
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
  setPointNature,
}: PointExplanationProps) {
  return (
    <div className="flex flex-col justify-center space-y-16 text-center">
      <p className="text-9xl font-bold">Reason</p>
      <div className="flex flex-row space-x-4">
        <button
          onClick={() => {
            setPointNature("Negative");
            setExplanationStep(explanationStep + 1);
          }}
          className="w-56 rounded-full bg-red-500 p-4 text-3xl font-semibold text-white"
        >
          Hitting Error
        </button>
        <button
          className="w-56 rounded-full bg-red-500 p-4 text-3xl font-semibold text-white"
          onClick={() => {
            setPointNature("Negative");
            setExplanationStep(explanationStep + 1);
          }}
        >
          Service Error
        </button>
        <button
          onClick={() => {
            setPointNature("Positive");
            setExplanationStep(explanationStep + 1);
          }}
          className="w-56 rounded-full bg-green-500 p-4 text-3xl font-semibold text-white"
        >
          Service Ace
        </button>
        <button
          onClick={() => {
            setPointNature("Positive");
            setExplanationStep(explanationStep + 1);
          }}
          className="w-56 rounded-full bg-green-500 p-4 text-3xl font-semibold text-white"
        >
          Block
        </button>
        <button
          onClick={() => {
            setPointNature("Positive");
            setExplanationStep(explanationStep + 1);
          }}
          className="w-56 rounded-full bg-green-500 p-4 text-3xl font-semibold text-white"
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
            setTeamScored(0);
            setPointNature("");
            setExplanationStep(1);
          }}
          className="w-56 rounded-full bg-red-500 p-4 text-3xl font-semibold text-white"
        >
          {teamNum === 1 && pointNature === "Positive" ? teamOne[0] : null}
          {teamNum === 1 && pointNature === "Negative" ? teamTwo[0] : null}
          {teamNum === 2 && pointNature === "Positive" ? teamTwo[0] : null}
          {teamNum === 2 && pointNature === "Negative" ? teamOne[0] : null}
        </button>
        <button
          className="w-56 rounded-full bg-red-500 p-4 text-3xl font-semibold text-white"
          onClick={() => {
            setTeamScored(0);
            setPointNature("");
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
