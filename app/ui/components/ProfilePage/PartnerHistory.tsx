const dummyPartners = [
  {
    name: 'Norville Rogers',
    playerRatingDelta: 2.2,
    divisionAveragePlacement: ['A: 5', 'B: 2.3'],
  },
  {
    name: 'Velma Dinkley',
    playerRatingDelta: 2.2,
    divisionAveragePlacement: ['A: 5', 'B: 2.3'],
  },
  {
    name: 'Fred Jones',
    playerRatingDelta: 2.2,
    divisionAveragePlacement: ['A: 5', 'B: 2.3'],
  },
  {
    name: 'Daphne Blake',
    playerRatingDelta: 2.2,
    divisionAveragePlacement: ['A: 5', 'B: 2.3'],
  },
];

export default function PartnerHistory() {
  return (
    <div className="flex h-72 w-full flex-col overflow-y-auto rounded-lg bg-white p-4 drop-shadow-lg">
      <h1 className="pb-3 text-3xl font-bold">Partner History</h1>
      {dummyPartners.map((partner) => {
        return (
          <PartnerHistoryItem
            name={partner.name}
            playerRatingDelta={partner.playerRatingDelta}
            divisionAveragePlacement={partner.divisionAveragePlacement}
            key={partner.name}
          />
        );
      })}
    </div>
  );
}

interface Props {
  name: string;
  playerRatingDelta: number;
  divisionAveragePlacement: string[];
}

function PartnerHistoryItem(props: Props) {
  return (
    <div className="ml-6 flex flex-row items-center space-x-2 py-3 px-4 text-2xl font-semibold tracking-wider">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2196F3]">
        {props.name.split(' ')[0].charAt(0) +
          props.name.split(' ')[1].charAt(0)}
      </div>
      <p className="px-4">{props.name + ' |'}</p>
      <p className="pr-2">{props.playerRatingDelta + ' |'}</p>
      <p className="flex space-x-2">
        {props.divisionAveragePlacement.map((divisionAverage, i) => {
          return <span key={i}>{divisionAverage}</span>;
        })}
      </p>
    </div>
  );
}
