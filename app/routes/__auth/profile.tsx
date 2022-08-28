import BasicStatisticsGrid from "~/ui/components/ProfilePage/BasicStatisticsGrid";
import H2HCard from "~/ui/components/ProfilePage/H2HCard";
import PartnerHistory from "~/ui/components/ProfilePage/PartnerHistory";
import ProfileBanner from "~/ui/components/ProfilePage/ProfileBanner";
import TopTournamentCard from "~/ui/components/ProfilePage/TopTournamentCard";
import TournamentHistory from "~/ui/components/ProfilePage/TournamentHistory";
import TournamentPlacement from "~/ui/components/ProfilePage/TournamentPlacement";

export default function Profile() {
  return (
    <div className="flex flex-col space-x-4 space-y-6 p-8 overflow-y-auto overflow-x-hidden">
      <ProfileBanner />
      <TournamentPlacement />
      <div className="flex w-full flex-row space-x-4">
        <TournamentHistory />
        <BasicStatisticsGrid />
      </div>
      <div className="flex w-full flex-row space-x-4">
        <div className="flex w-1/2 flex-row justify-around space-x-12">
          <H2HCard nemesisName="Jane Shmoe" value={-9.4} />
          <TopTournamentCard
            tournamentName="Chaos Volleyball"
            averagePlacement={1.2}
          />
        </div>
        <div className="w-1/2">
          <PartnerHistory/>
        </div>
      </div>
    </div>
  );
}
