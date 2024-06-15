import { api } from "@/trpc/server"

export default async function PartnerList({ name }: { name: string }) {
    const potentialPartners = await api.tournamentBasic.findPartner({ playerName: name });
    return (
        <div>
            {potentialPartners.map((partner) => (
                <div key={partner.id} className={`${name.length > 0 ? "" : "hidden"}`}>
                    {partner.name}
                </div>
            ))}
        </div>
    )
}