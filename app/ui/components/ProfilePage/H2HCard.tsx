interface Props {
  nemesisName: string;
  value: number;
}

export default function H2HCard(props: Props) {
  return (
    <div className="flex h-72 w-72 flex-col items-center rounded-xl bg-white p-4 text-center">
      <div
        className="h-36 w-36 rounded-full bg-[url('/person2.avif')] bg-cover bg-center bg-origin-border mt-2"
      />
      <p className="text-3xl font-bold mt-4">{props.nemesisName}</p>
      <p className="text-2xl font-semibold mt-2">{props.value}</p>
    </div>
  );
}
