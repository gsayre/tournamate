import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "utils/trpc";

type PointData = {
  teamNum: number;
  pointNature: string;
  reason: string;
  player: string;
};

export default function RefView() {
  const router = useRouter();
  const { gameId } = router.query;
  const gId: number = parseInt(gameId as string);
  const gameAndScore = trpc.tournament.getGameAndScore.useQuery({
    gameId: gId,
  }).data?.gameAndScore;
  let teamOneScore: number | null = 0,
    teamTwoScore: number | null = 0,
    scoreCap: number | null = 0;
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
  const teamOnePlayerOne = gameAndScore?.teams[0].Team.players[0].user.fullName
    ? gameAndScore?.teams[0].Team.players[0].user.fullName
    : "PLAYER ABSENT";
  const teamOnePlayerTwo = gameAndScore?.teams[0].Team.players[1].user.fullName
    ? gameAndScore?.teams[0].Team.players[1].user.fullName
    : "PLAYER ABSENT";
  const teamTwoPlayerOne = gameAndScore?.teams[1].Team.players[0].user.fullName
    ? gameAndScore?.teams[1].Team.players[0].user.fullName
    : "PLAYER ABSENT";
  const teamTwoPlayerTwo = gameAndScore?.teams[1].Team.players[1].user.fullName
    ? gameAndScore?.teams[1].Team.players[1].user.fullName
    : "PLAYER ABSENT";

  const [explanationStep, setExplanationStep] = useState(1);
  const [pointData, setPointData] = useState<PointData>({
    teamNum: 0,
    pointNature: "",
    reason: "",
    player: "",
  });

  useEffect(() => {
    console.log(pointData);
  }, [pointData]);

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
              teamOne={[teamOnePlayerOne, teamOnePlayerTwo]}
              teamOneId={gameAndScore.teams[0].teamId}
              teamTwo={[teamTwoPlayerOne, teamTwoPlayerTwo]}
              teamTwoId={gameAndScore.teams[1].teamId}
              teamNum={1}
              currentSet={gameAndScore.currentSet}
              explanationStep={explanationStep}
              setExplanationStep={setExplanationStep}
              pointData={pointData}
              setPointData={setPointData}
            />
            <ScoreCard
              gameId={gameAndScore.gameId}
              score={teamTwoScore}
              teamOne={[teamOnePlayerOne, teamOnePlayerTwo]}
              teamOneId={gameAndScore.teams[0].teamId}
              teamTwo={[teamTwoPlayerOne, teamTwoPlayerTwo]}
              teamTwoId={gameAndScore.teams[1].teamId}
              teamNum={2}
              currentSet={gameAndScore.currentSet}
              explanationStep={explanationStep}
              setExplanationStep={setExplanationStep}
              pointData={pointData}
              setPointData={setPointData}
            />
          </>
        ) : explanationStep === 2 ? (
          <PointExplanationOne
            explanationStep={explanationStep}
            setExplanationStep={setExplanationStep}
            pointData={pointData}
            setPointData={setPointData}
          />
        ) : explanationStep === 3 ? (
          <PointExplanationTwo
            explanationStep={explanationStep}
            setExplanationStep={setExplanationStep}
            pointData={pointData}
            setPointData={setPointData}
          />
        ) : gameAndScore?.teams[0].Team.players &&
          gameAndScore?.teams[1].Team.players &&
          explanationStep === 4 ? (
          <PointExplanationThree
            setExplanationStep={setExplanationStep}
            pointData={pointData}
            setPointData={setPointData}
            teamOneId={gameAndScore.teams[0].teamId}
            teamOne={[teamOnePlayerOne, teamOnePlayerTwo]}
            teamTwoId={gameAndScore.teams[1].teamId}
            teamTwo={[teamTwoPlayerOne, teamTwoPlayerTwo]}
          />
        ) : null}
      </div>
    </div>
  );
}

type ScoreCardProps = {
  gameId: number;
  score: number | null;
  teamOneId: number;
  teamOne: string[];
  teamTwoId: number;
  teamTwo: string[];
  teamNum: number;
  currentSet: number;
  explanationStep: number;
  setExplanationStep: React.Dispatch<React.SetStateAction<number>>;
  pointData: PointData;
  setPointData: React.Dispatch<React.SetStateAction<PointData>>;
};

function ScoreCard({
  gameId,
  score,
  currentSet,
  teamNum,
  teamOne,
  teamOneId,
  teamTwo,
  teamTwoId,
  explanationStep,
  setExplanationStep,
  pointData,
  setPointData,
}: ScoreCardProps) {
  const addPointToGame = trpc.tournament.addPointToGame.useMutation();
  const teamToPass: number = teamNum === 1 ? teamOneId : teamTwoId;
  return (
    <div
      className={`${
        teamNum === 1 ? "bg-red-600" : "bg-blue-600"
      } flex h-full w-full cursor-pointer flex-col justify-center space-y-8 text-center`}
      onClick={() => {
        setPointData({ ...pointData, teamNum: teamNum });
        setExplanationStep(explanationStep + 1);
      }}
    >
      <p className="text-9xl font-bold">{score}</p>
      {/* {teamScored === 1 ? <p className="text-red-100">Serving</p> : null} */}
      <div className="flex flex-row justify-center space-x-2 text-3xl font-light">
        {teamNum == 1 ? <p>{teamOne[0]}</p> : <p>{teamTwo[0]}</p>}
        <p>-</p>
        {teamNum == 1 ? <p>{teamOne[1]}</p> : <p>{teamTwo[1]}</p>}
      </div>
    </div>
  );
}

type PointExplanationOneProps = {
  explanationStep: number;
  setExplanationStep: React.Dispatch<React.SetStateAction<number>>;
  pointData: PointData;
  setPointData: React.Dispatch<React.SetStateAction<PointData>>;
};

function PointExplanationOne({
  explanationStep,
  setExplanationStep,
  pointData,
  setPointData,
}: PointExplanationOneProps) {
  return (
    <div className="flex flex-col justify-center space-y-16 text-center">
      <p className="text-9xl font-bold">Point Nature</p>
      <div className="flex flex-row space-x-4 justify-center">
        <button
          onClick={() => {
            setPointData({ ...pointData, pointNature: "Positive" });
            setExplanationStep(explanationStep + 1);
          }}
          className="w-56 rounded-full bg-green-500 p-4 text-3xl font-semibold text-white"
        >
          Positive
        </button>
        <button
          className="w-56 rounded-full bg-red-500 p-4 text-3xl font-semibold text-white"
          onClick={() => {
            setPointData({ ...pointData, pointNature: "Negative" });
            setExplanationStep(explanationStep + 1);
          }}
        >
          Negative
        </button>
      </div>
    </div>
  );
}

type PointExplanationTwoProps = {
  explanationStep: number;
  setExplanationStep: React.Dispatch<React.SetStateAction<number>>;
  pointData: PointData;
  setPointData: React.Dispatch<React.SetStateAction<PointData>>;
};

function PointExplanationTwo({
  explanationStep,
  setExplanationStep,
  pointData,
  setPointData,
}: PointExplanationTwoProps) {
  return (
    <div className="flex flex-col justify-center space-y-16 text-center">
      <p className="text-9xl font-bold">Reason</p>
      {pointData.pointNature === "Positive" ? (
        <div className="flex flex-row space-x-4">
          <button
            onClick={() => {
              setPointData({ ...pointData, reason: "Service Ace" });
              setExplanationStep(explanationStep + 1);
            }}
            className="w-56 rounded-full bg-green-500 p-4 text-3xl font-semibold text-white"
          >
            Service Ace
          </button>
          <button
            onClick={() => {
              setPointData({ ...pointData, reason: "Block" });
              setExplanationStep(explanationStep + 1);
            }}
            className="w-56 rounded-full bg-green-500 p-4 text-3xl font-semibold text-white"
          >
            Block
          </button>
          <button
            onClick={() => {
              setPointData({ ...pointData, reason: "Kill" });
              setExplanationStep(explanationStep + 1);
            }}
            className="w-56 rounded-full bg-green-500 p-4 text-3xl font-semibold text-white"
          >
            Kill
          </button>
        </div>
      ) : pointData.pointNature === "Negative" ? (
        <div className="flex flex-row space-x-4">
          <button
            onClick={() => {
              setPointData({ ...pointData, reason: "Hitting Error" });
              setExplanationStep(explanationStep + 1);
            }}
            className="w-56 rounded-full bg-red-500 p-4 text-3xl font-semibold text-white"
          >
            Hitting Error
          </button>
          <button
            className="w-56 rounded-full bg-red-500 p-4 text-3xl font-semibold text-white"
            onClick={() => {
              setPointData({ ...pointData, reason: "Service Error" });
              setExplanationStep(explanationStep + 1);
            }}
          >
            Service Error
          </button>
          <button></button>
          <button
            onClick={() => {
              setPointData({ ...pointData, reason: "Net Violation" });
              setExplanationStep(explanationStep + 1);
            }}
            className="w-56 rounded-full bg-red-500 p-4 text-3xl font-semibold text-white"
          >
            Net Violation
          </button>
          <button
            onClick={() => {
              setPointData({ ...pointData, reason: "Double Contact" });
              setExplanationStep(explanationStep + 1);
            }}
            className="w-56 rounded-full bg-red-500 p-4 text-3xl font-semibold text-white"
          >
            Double Contact
          </button>
          <button
            onClick={() => {
              setPointData({ ...pointData, reason: "Lift/Carry" });
              setExplanationStep(explanationStep + 1);
            }}
            className="w-56 rounded-full bg-red-500 p-4 text-3xl font-semibold text-white"
          >
            Lift/Carry
          </button>
        </div>
      ) : null}
    </div>
  );
}

type PointExplanationThreeProps = {
  teamOneId: number;
  teamOne: string[];
  teamTwoId: number;
  teamTwo: string[];
  setExplanationStep: React.Dispatch<React.SetStateAction<number>>;
  pointData: PointData;
  setPointData: React.Dispatch<React.SetStateAction<PointData>>;
};

function PointExplanationThree({
  teamOneId,
  teamOne,
  teamTwoId,
  teamTwo,
  setExplanationStep,
  pointData,
  setPointData,
}: PointExplanationThreeProps) {
  const playerOne =
    pointData.teamNum === 1 && pointData.pointNature === "Positive"
      ? teamOne[0]
      : pointData.teamNum === 1 && pointData.pointNature === "Negative"
      ? teamTwo[0]
      : pointData.teamNum === 2 && pointData.pointNature === "Positive"
      ? teamTwo[0]
      : teamOne[0];
  const playerTwo =
    pointData.teamNum === 1 && pointData.pointNature === "Positive"
      ? teamOne[1]
      : pointData.teamNum === 1 && pointData.pointNature === "Negative"
      ? teamTwo[1]
      : pointData.teamNum === 2 && pointData.pointNature === "Positive"
      ? teamTwo[1]
      : teamOne[1];
  return (
    <div className="flex flex-col justify-center space-y-16 text-center">
      <p className="text-9xl font-bold">Player</p>
      <div className="flex flex-row space-x-4">
        <button
          onClick={() => {
            setPointData({ ...pointData, player: playerOne });
            setExplanationStep(1);
            setPointData({
              teamNum: 0,
              pointNature: "",
              reason: "",
              player: "",
            });
          }}
          className={`w-56 rounded-full ${
            pointData.pointNature === "Positive" ? "bg-green-500" : "bg-red-500"
          } p-4 text-3xl font-semibold text-white`}
        >
          {playerOne}
        </button>
        <button
          className={`w-56 rounded-full ${
            pointData.pointNature === "Positive" ? "bg-green-500" : "bg-red-500"
          } p-4 text-3xl font-semibold text-white`}
          onClick={() => {
            setPointData({ ...pointData, player: playerTwo });
            setExplanationStep(1);
            setPointData({
              teamNum: 0,
              pointNature: "",
              reason: "",
              player: "",
            });
          }}
        >
          {playerTwo}
        </button>
      </div>
    </div>
  );
}
