interface Props {
  tournamentName: string;
  averagePlacement: number;
}

export default function TopTournamentCard(props: Props) {
    return (
      <div className="flex h-72 w-72 flex-col items-center rounded-xl bg-white p-4 text-center">
        <div className="h-36 w-36 rounded-full bg-[#2196F3] bg-cover bg-center bg-origin-border flex justify-center items-center">
          <img
            src="https://www.svgrepo.com/show/12756/cup.svg"
            alt="Cup SVG Vector"
            title="Cup SVG Vector"
            className="h-24 w-24 mt-2"
          />
        </div>
        <p className="mt-4 text-3xl font-bold">{props.tournamentName}</p>
        <p className="mt-2 text-2xl font-semibold">{props.averagePlacement}</p>
      </div>
    );
}
