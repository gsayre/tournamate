import Link from "next/link";
import { useRouter } from "next/router";

export default function RefView() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-screen">
      <button onClick={() => {router.back()}}>Go Back</button>
      <ScoreCard score={0} playerOneName={"Player One"} playerTwoName={"Player Two"} />
      <ScoreCard score={0} playerOneName={"Player Three"} playerTwoName={"Player Four"} />
    </div>
  );
}

type ScoreCardProps = {
  score: number;
  playerOneName: string;
  playerTwoName: string;
};

function ScoreCard({score, playerOneName, playerTwoName}: ScoreCardProps) {
  return (
    <div>
      <div className="flex flex-col"> 
        <p>{score}</p>
        <p>{playerOneName}</p>
        <p>{playerTwoName}</p>
      </div>
    </div>
  )
}
