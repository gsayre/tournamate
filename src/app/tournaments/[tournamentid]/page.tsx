/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import DivisionAccordian from "@/app/_components/divisionAccordain";

export default async function Tournament({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log(searchParams);

  return (
    <main className="flex flex-col p-8 pt-6">
      <h2 className="pb-4 text-3xl font-bold tracking-tight">Tournament</h2>
      <div className="px-8">
        <h3 className="pb-2 text-2xl font-semibold tracking-tight">
          Divisions
        </h3>
        <DivisionAccordian />
      </div>
    </main>
  );
}
