"use client";
import { useParams } from "next/navigation";

export default function Tournament() {
  const { tournamentid } = useParams<{ tournamentid: string }>();

  return (
    <main className="flex flex-col p-8 pt-6">
      <h2 className="pb-4 text-3xl font-bold tracking-tight">
        Tournament {tournamentid}
      </h2>
    </main>
  );
}
