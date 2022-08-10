interface Props {
  placement: string;
  tournamentDate: string;
  tournamentName: string;
}

export default function TournamentHistoryItem(props: Props) {
  return (
    <div className="flex flex-row items-center space-x-2 py-3 text-2xl font-semibold px-4 ml-6 tracking-wider">
      {props.placement == '1' ? (
        <div className=" text-amber-400">1</div>
      ) : props.placement == '2' ? (
        <div className=" text-neutral-500">2</div>
      ) : props.placement == '3' ? (
        <div className=" text-amber-800">3</div>
      ) : (
        <div className="">{props.placement}</div>
      )}
      <p className="px-4">{props.tournamentDate}</p>
      <p className="">{props.tournamentName}</p>
    </div>
  );
}
