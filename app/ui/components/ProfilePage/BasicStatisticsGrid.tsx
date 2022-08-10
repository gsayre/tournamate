import BasicStatisticsCard from './BasicStatisticCard';

const dummyStatsData = [
  {
    name: 'Average Points Scored',
    value: 9.6,
  },
  {
    name: 'Average Point Differential',
    value: -7.1,
  },
  {
    name: 'Average Pool Play Win/Loss',
    value: 1.8,
  },
  {
    name: 'Average Service Errors per Set',
    value: 2.3,
  },
  {
    name: 'Average Doubles per Set',
    value: 0.4,
  },
  {
    name: 'Average Attacking Errors',
    value: 3.8,
  },
];

export default function BasicStatisticsGrid() {
  return (
    <div className=" grid h-64 w-1/2 grid-cols-3 gap-y-8 place-items-center">
      {dummyStatsData.map((statsData) => {
        return (
          <BasicStatisticsCard
            name={statsData.name}
            value={statsData.value}
            key={statsData.name}
          />
        );
      })}
    </div>
  );
}
