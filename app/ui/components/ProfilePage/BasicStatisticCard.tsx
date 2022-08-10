interface Props {
  name: string;
  value: number;
}

export default function BasicStatisticsCard(props: Props) {
  return (
    <div className="flex h-44 w-44 flex-col items-center p-2 rounded-xl bg-white text-center">
      <p className="text-xl font-semibold">{props.name}</p>
      <p className="text-5xl font-bold mt-4">{props.value}</p>
    </div>
  );
}
