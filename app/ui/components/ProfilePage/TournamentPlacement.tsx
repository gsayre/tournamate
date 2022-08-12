import { useMatches } from '@remix-run/react';

const dummyPlacementData = [
  {
    division: 'Open',
    format: 'Reverse Coed',
    averagePlacement: '3.8',
  },
  {
    division: 'Open',
    format: 'Coed',
    averagePlacement: 'P3',
  },
  {
    division: 'Open',
    format: 'Same Sex',
    averagePlacement: '2.6',
  },
  {
    division: 'AA',
    format: 'Same Sex',
    averagePlacement: '1.9',
  },
];

export default function TournamentPlacement() {
  const matches = useMatches();
  let parentData = matches.find((route) => route.pathname === '/')?.data;

  return (
    <div className="flex h-64 w-full flex-col rounded-xl bg-white p-4">
      <p className="text-3xl font-semibold">Average Tournament Placement</p>
      <div className="flex flex-row p-4">
        {dummyPlacementData.map((placementData, i) => {
          return (
            <div className="flex flex-row items-center justify-center" key={i}>
              {i !== 0 ? (
                <div className="mx-4 h-40 w-0.5 border border-black" />
              ) : null}
              <div className="flex flex-col">
                <p className="text-3xl font-semibold">
                  {placementData.division}
                </p>
                <p className="text-xl">{placementData.format}</p>
              </div>
              <p className="mx-8 text-5xl font-bold">
                {placementData.averagePlacement}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
