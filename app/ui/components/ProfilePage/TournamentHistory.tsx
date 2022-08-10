import TournamentHistoryItem from './TournamentHistoryItem';

const dummyTournaments = [
  {
    placement: '1',
    tournamentDate: '12/16',
    tournamentName: 'G-Vegas Volleyball',
  },
  {
    placement: 'P3',
    tournamentDate: '12/16',
    tournamentName: 'Chaos Volleyball',
  },
  {
    placement: '3',
    tournamentDate: '12/16',
    tournamentName: 'The Crown',
  },
  {
    placement: '2',
    tournamentDate: '12/16',
    tournamentName: 'Chucktown Volleyball',
  },
  {
    placement: '5',
    tournamentDate: '12/16',
    tournamentName: 'Chaos Volleyball',
  },
];

export default function TournamentHistory() {
  return (
    <div className="flex h-96 w-3/6 flex-col rounded-lg bg-white drop-shadow-lg p-4">
      <h1 className="text-3xl font-bold pb-3">Tournament History</h1>
      {dummyTournaments.map((tournament) => {
        return (
          <TournamentHistoryItem
            placement={tournament.placement}
            tournamentDate={tournament.tournamentDate}
            tournamentName={tournament.tournamentName}
            key={tournament.tournamentName}
          />
        );
      })}
    </div>
  );
}
